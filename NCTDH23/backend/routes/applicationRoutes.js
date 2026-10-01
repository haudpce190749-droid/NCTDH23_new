const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken, isStudent, isCompany } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Submit Job Application (Student)
router.post('/apply', authenticateToken, isStudent, upload.single('cv'), async (req, res) => {
  try {
    const { job_id, cover_letter, portfolio_url, contact_phone, contact_email, use_existing_cv } = req.body;

    if (!job_id) {
      return res.status(400).json({ error: 'Mã công việc không hợp lệ' });
    }

    const student = await db.asyncGet('SELECT * FROM student_profiles WHERE user_id = ?', [req.user.id]);
    if (!student) {
      return res.status(400).json({ error: 'Không tìm thấy hồ sơ sinh viên' });
    }

    // Check existing application
    const existing = await db.asyncGet(
      'SELECT id FROM applications WHERE job_id = ? AND student_id = ?',
      [job_id, student.id]
    );
    if (existing) {
      return res.status(400).json({ error: 'Bạn đã nộp ứng tuyển cho công việc này trước đó' });
    }

    let cvUrl = student.cv_url;
    let cvFilename = student.cv_filename;

    if (req.file) {
      cvUrl = `/uploads/${req.file.filename}`;
      cvFilename = req.file.originalname;
    } else if (use_existing_cv !== 'true' && !cvUrl) {
      return res.status(400).json({ error: 'Vui lòng chọn hoặc tải lên tệp CV để ứng tuyển' });
    }

    const appRes = await db.asyncRun(
      `
      INSERT INTO applications (job_id, student_id, cv_url, cv_filename, cover_letter, portfolio_url, contact_phone, contact_email, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'submitted')
    `,
      [
        job_id,
        student.id,
        cvUrl,
        cvFilename,
        cover_letter || '',
        portfolio_url || student.github_url || '',
        contact_phone || student.phone || '',
        contact_email || req.user.email,
      ]
    );

    res.status(201).json({
      message: 'Nộp ứng tuyển thành công! Nhà tuyển dụng sẽ xem xét hồ sơ của bạn.',
      applicationId: appRes.lastID
    });
  } catch (err) {
    console.error('Lỗi nộp ứng tuyển:', err);
    res.status(500).json({ error: 'Lỗi máy chủ khi nộp hồ sơ' });
  }
});

// Get all applications submitted by Student
router.get('/my-applications', authenticateToken, isStudent, async (req, res) => {
  try {
    const student = await db.asyncGet('SELECT id FROM student_profiles WHERE user_id = ?', [req.user.id]);

    const applications = await db.asyncAll(
      `
      SELECT a.*, j.title as job_title, j.job_type, j.location, j.salary_min, j.salary_max, j.salary_negotiable,
             c.company_name, c.logo as company_logo
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      JOIN company_profiles c ON j.company_id = c.id
      WHERE a.student_id = ?
      ORDER BY a.applied_at DESC
    `,
      [student.id]
    );

    res.json({ applications });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi lấy danh sách hồ sơ ứng tuyển' });
  }
});

// Check if student applied for a specific job
router.get('/check-status/:jobId', authenticateToken, isStudent, async (req, res) => {
  try {
    const student = await db.asyncGet('SELECT id FROM student_profiles WHERE user_id = ?', [req.user.id]);
    const application = await db.asyncGet(
      'SELECT id, status, applied_at FROM applications WHERE job_id = ? AND student_id = ?',
      [req.params.jobId, student.id]
    );

    res.json({ applied: !!application, application });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi máy chủ' });
  }
});

// Get applicants for Company (filterable by job_id and status)
router.get('/company/applicants', authenticateToken, isCompany, async (req, res) => {
  try {
    const company = await db.asyncGet('SELECT id FROM company_profiles WHERE user_id = ?', [req.user.id]);
    const { jobId, status, q } = req.query;

    let sql = `
      SELECT a.*, j.title as job_title,
             s.full_name as student_name, s.avatar as student_avatar, s.university, s.major, s.graduation_year, s.gpa
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      JOIN student_profiles s ON a.student_id = s.id
      WHERE j.company_id = ?
    `;
    const params = [company.id];

    if (jobId) {
      sql += ` AND a.job_id = ?`;
      params.push(jobId);
    }

    if (status) {
      sql += ` AND a.status = ?`;
      params.push(status);
    }

    if (q) {
      sql += ` AND (s.full_name LIKE ? OR j.title LIKE ? OR s.university LIKE ?)`;
      const term = `%${q}%`;
      params.push(term, term, term);
    }

    sql += ` ORDER BY a.applied_at DESC`;

    const applicants = await db.asyncAll(sql, params);
    res.json({ applicants });
  } catch (err) {
    console.error('Lỗi lấy danh sách ứng viên:', err);
    res.status(500).json({ error: 'Lỗi máy chủ khi lấy ứng viên' });
  }
});

// Update Application Status (Company only)
router.put('/:id/status', authenticateToken, isCompany, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const applicationId = req.params.id;

    const allowedStatuses = ['submitted', 'reviewing', 'shortlisted', 'interview', 'accepted', 'rejected'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Trạng thái ứng tuyển không hợp lệ' });
    }

    const company = await db.asyncGet('SELECT id FROM company_profiles WHERE user_id = ?', [req.user.id]);

    const application = await db.asyncGet(
      `
      SELECT a.id 
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE a.id = ? AND j.company_id = ?
    `,
      [applicationId, company.id]
    );

    if (!application) {
      return res.status(404).json({ error: 'Không tìm thấy hồ sơ hoặc bạn không có quyền cập nhật' });
    }

    await db.asyncRun(
      'UPDATE applications SET status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, notes || null, applicationId]
    );

    res.json({ message: 'Cập nhật trạng thái ứng tuyển thành công' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi máy chủ khi cập nhật trạng thái' });
  }
});

module.exports = router;
