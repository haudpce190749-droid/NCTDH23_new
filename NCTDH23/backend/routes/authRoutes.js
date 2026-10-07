const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { JWT_SECRET, authenticateToken } = require('../middleware/auth');
const { sendOtpEmail } = require('../services/mailService');

// 1. Send OTP for Registration or Password Reset
router.post('/send-otp', async (req, res) => {
  try {
    const { email, purpose = 'register' } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Địa chỉ email không hợp lệ.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // If registering, check if email is already registered
    if (purpose === 'register') {
      const existing = await db.asyncGet('SELECT id FROM users WHERE email = ?', [cleanEmail]);
      if (existing) {
        return res.status(400).json({ error: 'Email này đã được đăng ký tài khoản trong hệ thống.' });
      }
    } else if (purpose === 'forgot_password') {
      const existing = await db.asyncGet('SELECT id FROM users WHERE email = ?', [cleanEmail]);
      if (!existing) {
        return res.status(404).json({ error: 'Không tìm thấy tài khoản liên kết với email này.' });
      }
    }

    // Check rate limit: cooldown 30 seconds for same email
    const recentOtp = await db.asyncGet(
      `SELECT id, created_at FROM email_otps 
       WHERE email = ? AND purpose = ? 
       ORDER BY id DESC LIMIT 1`,
      [cleanEmail, purpose]
    );

    if (recentOtp && recentOtp.created_at) {
      const createdAtTime = new Date(recentOtp.created_at).getTime();
      const nowTime = Date.now();
      if (nowTime - createdAtTime < 30 * 1000) {
        const remaining = Math.ceil((30 * 1000 - (nowTime - createdAtTime)) / 1000);
        return res.status(429).json({ 
          error: `Vui lòng đợi ${remaining} giây trước khi yêu cầu gửi lại mã OTP mới.` 
        });
      }
    }

    // Generate random 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Expires in 5 minutes (in SQLite format YYYY-MM-DD HH:MM:SS)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString().replace('T', ' ').slice(0, 19);

    // Save OTP into database
    await db.asyncRun(
      'INSERT INTO email_otps (email, otp_code, purpose, expires_at) VALUES (?, ?, ?, ?)',
      [cleanEmail, otpCode, purpose, expiresAt]
    );

    // Send email via mailService
    const mailResult = await sendOtpEmail(cleanEmail, otpCode, purpose);

    res.json({
      message: `Mã xác thực OTP đã được gửi đến email ${cleanEmail}. Vui lòng kiểm tra hộp thư (cả mục Spam/Rác).`,
      expiresInMinutes: 5,
      devOtp: mailResult.devOtp || undefined,
    });
  } catch (err) {
    console.error('Lỗi khi gửi mã OTP:', err);
    res.status(500).json({ error: err.message || 'Lỗi máy chủ khi gửi mã xác thực. Vui lòng thử lại sau.' });
  }
});

// 2. Verify OTP & Complete Registration
router.post('/verify-otp-register', async (req, res) => {
  try {
    const { email, otp, password, role, fullName, companyName } = req.body;

    if (!email || !otp || !password || !role) {
      return res.status(400).json({ error: 'Vui lòng nhập đầy đủ thông tin và mã xác thực OTP.' });
    }

    if (!['student', 'company'].includes(role)) {
      return res.status(400).json({ error: 'Vai trò tài khoản không hợp lệ.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.toString().trim();

    // Check OTP in database
    const otpRecord = await db.asyncGet(
      `SELECT id, otp_code, expires_at, is_verified 
       FROM email_otps 
       WHERE email = ? AND purpose = 'register' AND is_verified = 0 
       ORDER BY id DESC LIMIT 1`,
      [cleanEmail]
    );

    if (!otpRecord) {
      return res.status(400).json({ error: 'Mã OTP không tồn tại hoặc đã được sử dụng. Vui lòng yêu cầu mã mới.' });
    }

    if (otpRecord.otp_code !== cleanOtp) {
      return res.status(400).json({ error: 'Mã xác thực OTP không chính xác. Vui lòng kiểm tra lại.' });
    }

    const expiresTime = new Date(otpRecord.expires_at).getTime();
    if (Date.now() > expiresTime) {
      return res.status(400).json({ error: 'Mã xác thực OTP đã hết hạn (quá 5 phút). Vui lòng gửi lại mã mới.' });
    }

    // Double check email duplicate
    const existing = await db.asyncGet('SELECT id FROM users WHERE email = ?', [cleanEmail]);
    if (existing) {
      return res.status(400).json({ error: 'Email này đã được đăng ký tài khoản.' });
    }

    // Mark OTP as verified
    await db.asyncRun('UPDATE email_otps SET is_verified = 1 WHERE id = ?', [otpRecord.id]);

    // Create User
    const passwordHash = await bcrypt.hash(password, 10);
    const userRes = await db.asyncRun(
      'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
      [cleanEmail, passwordHash, role]
    );

    const userId = userRes.lastID;
    let profile = null;

    // Create Profile
    if (role === 'student') {
      const studentName = fullName ? fullName.trim() : 'Sinh viên mới';
      const profRes = await db.asyncRun(
        'INSERT INTO student_profiles (user_id, full_name) VALUES (?, ?)',
        [userId, studentName]
      );
      profile = await db.asyncGet('SELECT * FROM student_profiles WHERE id = ?', [profRes.lastID]);
    } else if (role === 'company') {
      const compName = companyName ? companyName.trim() : 'Doanh nghiệp mới';
      const profRes = await db.asyncRun(
        'INSERT INTO company_profiles (user_id, company_name) VALUES (?, ?)',
        [userId, compName]
      );
      profile = await db.asyncGet('SELECT * FROM company_profiles WHERE id = ?', [profRes.lastID]);
    }

    // Generate JWT Token
    const token = jwt.sign({ id: userId, email: cleanEmail, role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Xác thực email và đăng ký tài khoản thành công!',
      token,
      user: {
        id: userId,
        email: cleanEmail,
        role,
        profile
      }
    });
  } catch (err) {
    console.error('Lỗi khi xác thực OTP đăng ký:', err);
    res.status(500).json({ error: 'Lỗi máy chủ khi hoàn tất đăng ký. Vui lòng thử lại.' });
  }
});

// 3. Fallback direct register (for backward compatibility)
router.post('/register', async (req, res) => {
  try {
    const { email, password, role, fullName, companyName } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Vui lòng nhập đầy đủ Email, Mật khẩu và Vai trò.' });
    }

    if (!['student', 'company'].includes(role)) {
      return res.status(400).json({ error: 'Vai trò tài khoản không hợp lệ.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check existing email
    const existing = await db.asyncGet('SELECT id FROM users WHERE email = ?', [cleanEmail]);
    if (existing) {
      return res.status(400).json({ error: 'Email này đã được sử dụng trong hệ thống.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userRes = await db.asyncRun(
      'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
      [cleanEmail, passwordHash, role]
    );

    const userId = userRes.lastID;
    let profile = null;

    if (role === 'student') {
      const studentName = fullName ? fullName.trim() : 'Sinh viên mới';
      const profRes = await db.asyncRun(
        'INSERT INTO student_profiles (user_id, full_name) VALUES (?, ?)',
        [userId, studentName]
      );
      profile = await db.asyncGet('SELECT * FROM student_profiles WHERE id = ?', [profRes.lastID]);
    } else if (role === 'company') {
      const compName = companyName ? companyName.trim() : 'Doanh nghiệp mới';
      const profRes = await db.asyncRun(
        'INSERT INTO company_profiles (user_id, company_name) VALUES (?, ?)',
        [userId, compName]
      );
      profile = await db.asyncGet('SELECT * FROM company_profiles WHERE id = ?', [profRes.lastID]);
    }

    const token = jwt.sign({ id: userId, email: cleanEmail, role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Đăng ký tài khoản thành công!',
      token,
      user: {
        id: userId,
        email: cleanEmail,
        role,
        profile
      }
    });
  } catch (err) {
    console.error('Lỗi đăng ký:', err);
    res.status(500).json({ error: 'Lỗi máy chủ khi đăng ký tài khoản. Vui lòng thử lại.' });
  }
});

// 4. Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Vui lòng điền email và mật khẩu.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await db.asyncGet('SELECT * FROM users WHERE email = ?', [cleanEmail]);
    if (!user) {
      return res.status(400).json({ error: 'Email hoặc mật khẩu không chính xác.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Email hoặc mật khẩu không chính xác.' });
    }

    let profile = null;
    if (user.role === 'student') {
      profile = await db.asyncGet('SELECT * FROM student_profiles WHERE user_id = ?', [user.id]);
    } else if (user.role === 'company') {
      profile = await db.asyncGet('SELECT * FROM company_profiles WHERE user_id = ?', [user.id]);
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Đăng nhập thành công!',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile
      }
    });
  } catch (err) {
    console.error('Lỗi đăng nhập:', err);
    res.status(500).json({ error: 'Lỗi máy chủ khi đăng nhập. Vui lòng thử lại.' });
  }
});

// 5. Get Current User profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await db.asyncGet('SELECT id, email, role, created_at FROM users WHERE id = ?', [req.user.id]);
    if (!user) {
      return res.status(404).json({ error: 'Người dùng không tồn tại.' });
    }

    let profile = null;
    if (user.role === 'student') {
      profile = await db.asyncGet('SELECT * FROM student_profiles WHERE user_id = ?', [user.id]);
    } else if (user.role === 'company') {
      profile = await db.asyncGet('SELECT * FROM company_profiles WHERE user_id = ?', [user.id]);
    }

    res.json({ user: { ...user, profile } });
  } catch (err) {
    console.error('Lỗi lấy thông tin cá nhân:', err);
    res.status(500).json({ error: 'Lỗi máy chủ khi tải thông tin tài khoản.' });
  }
});

// 6. Change Password
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Vui lòng cung cấp mật khẩu hiện tại và mật khẩu mới.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Mật khẩu mới phải có tối thiểu 6 ký tự.' });
    }

    const user = await db.asyncGet('SELECT * FROM users WHERE id = ?', [req.user.id]);
    if (!user) {
      return res.status(404).json({ error: 'Người dùng không tồn tại.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Mật khẩu hiện tại không đúng.' });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await db.asyncRun('UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [
      newHash,
      req.user.id
    ]);

    res.json({ message: 'Đổi mật khẩu thành công!' });
  } catch (err) {
    console.error('Lỗi đổi mật khẩu:', err);
    res.status(500).json({ error: 'Lỗi máy chủ khi đổi mật khẩu.' });
  }
});

module.exports = router;
