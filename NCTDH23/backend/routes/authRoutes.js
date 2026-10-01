const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { JWT_SECRET, authenticateToken } = require('../middleware/auth');

// Register user (Student or Company)
router.post('/register', async (req, res) => {
  try {
    const { email, password, role, fullName, companyName } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Vui lòng nhập đầy đủ Email, Mật khẩu và Vai trò' });
    }

    if (!['student', 'company'].includes(role)) {
      return res.status(400).json({ error: 'Vai trò không hợp lệ' });
    }

    // Check existing email
    const existing = await db.asyncGet('SELECT id FROM users WHERE email = ?', [email.trim().toLowerCase()]);
    if (existing) {
      return res.status(400).json({ error: 'Email này đã được sử dụng trong hệ thống' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userRes = await db.asyncRun(
      'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
      [email.trim().toLowerCase(), passwordHash, role]
    );

    const userId = userRes.lastID;

    // Create profile
    if (role === 'student') {
      await db.asyncRun(
        'INSERT INTO student_profiles (user_id, full_name) VALUES (?, ?)',
        [userId, fullName || 'Sinh viên mới']
      );
    } else if (role === 'company') {
      await db.asyncRun(
        'INSERT INTO company_profiles (user_id, company_name) VALUES (?, ?)',
        [userId, companyName || 'Doanh nghiệp mới']
      );
    }

    // Generate token
    const token = jwt.sign({ id: userId, email, role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Đăng ký tài khoản thành công',
      token,
      user: { id: userId, email, role }
    });
  } catch (err) {
    console.error('Lỗi đăng ký:', err);
    res.status(500).json({ error: 'Lỗi máy chủ khi đăng ký' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Vui lòng điền email và mật khẩu' });
    }

    const user = await db.asyncGet('SELECT * FROM users WHERE email = ?', [email.trim().toLowerCase()]);
    if (!user) {
      return res.status(400).json({ error: 'Email hoặc mật khẩu không chính xác' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Email hoặc mật khẩu không chính xác' });
    }

    // Fetch user details
    let profile = null;
    if (user.role === 'student') {
      profile = await db.asyncGet('SELECT * FROM student_profiles WHERE user_id = ?', [user.id]);
    } else if (user.role === 'company') {
      profile = await db.asyncGet('SELECT * FROM company_profiles WHERE user_id = ?', [user.id]);
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Đăng nhập thành công',
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
    res.status(500).json({ error: 'Lỗi máy chủ khi đăng nhập' });
  }
});

// Get Current User profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await db.asyncGet('SELECT id, email, role, created_at FROM users WHERE id = ?', [req.user.id]);
    if (!user) {
      return res.status(404).json({ error: 'Người dùng không tồn tại' });
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
    res.status(500).json({ error: 'Lỗi máy chủ' });
  }
});

// Change Password
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Vui lòng cung cấp mật khẩu hiện tại và mật khẩu mới' });
    }

    const user = await db.asyncGet('SELECT * FROM users WHERE id = ?', [req.user.id]);
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);

    if (!isMatch) {
      return res.status(400).json({ error: 'Mật khẩu hiện tại không đúng' });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await db.asyncRun('UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [
      newHash,
      req.user.id
    ]);

    res.json({ message: 'Đổi mật khẩu thành công' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi đổi mật khẩu' });
  }
});

module.exports = router;
