const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken, isStudent } = require('../middleware/auth');

// Toggle Save / Unsave Job
router.post('/toggle', authenticateToken, isStudent, async (req, res) => {
  try {
    const { jobId } = req.body;
    if (!jobId) {
      return res.status(400).json({ error: 'Mã việc làm không hợp lệ' });
    }

    const student = await db.asyncGet('SELECT id FROM student_profiles WHERE user_id = ?', [req.user.id]);
    const existing = await db.asyncGet('SELECT id FROM saved_jobs WHERE student_id = ? AND job_id = ?', [
      student.id,
      jobId
    ]);

    if (existing) {
      await db.asyncRun('DELETE FROM saved_jobs WHERE id = ?', [existing.id]);
      res.json({ saved: false, message: 'Đã bỏ lưu việc làm' });
    } else {
      await db.asyncRun('INSERT INTO saved_jobs (student_id, job_id) VALUES (?, ?)', [student.id, jobId]);
      res.json({ saved: true, message: 'Đã lưu việc làm thành công' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi lưu/bỏ lưu việc làm' });
  }
});

// Get List of Saved Jobs for Student
router.get('/my-saved', authenticateToken, isStudent, async (req, res) => {
  try {
    const student = await db.asyncGet('SELECT id FROM student_profiles WHERE user_id = ?', [req.user.id]);

    const jobs = await db.asyncAll(
      `
      SELECT j.*, c.company_name, c.logo as company_logo, sj.saved_at
      FROM saved_jobs sj
      JOIN jobs j ON sj.job_id = j.id
      JOIN company_profiles c ON j.company_id = c.id
      WHERE sj.student_id = ?
      ORDER BY sj.saved_at DESC
    `,
      [student.id]
    );

    for (let job of jobs) {
      const skills = await db.asyncAll('SELECT skill_name FROM job_skills WHERE job_id = ?', [job.id]);
      job.skills = skills.map((s) => s.skill_name);
    }

    res.json({ jobs });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi lấy danh sách việc làm đã lưu' });
  }
});

// Check if specific job is saved by student
router.get('/check/:jobId', authenticateToken, isStudent, async (req, res) => {
  try {
    const student = await db.asyncGet('SELECT id FROM student_profiles WHERE user_id = ?', [req.user.id]);
    const existing = await db.asyncGet('SELECT id FROM saved_jobs WHERE student_id = ? AND job_id = ?', [
      student.id,
      req.params.jobId
    ]);

    res.json({ isSaved: !!existing });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi máy chủ' });
  }
});

module.exports = router;
