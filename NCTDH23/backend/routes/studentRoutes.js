const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken, isStudent } = require('../middleware/auth');
const upload = require('../middleware/upload');
const path = require('path');
const fs = require('fs');

// Get student full profile with Education, Skills, Experience, Projects
router.get('/profile', authenticateToken, isStudent, async (req, res) => {
  try {
    const profile = await db.asyncGet('SELECT * FROM student_profiles WHERE user_id = ?', [req.user.id]);
    if (!profile) {
      return res.status(404).json({ error: 'Không tìm thấy hồ sơ sinh viên' });
    }

    const education = await db.asyncAll('SELECT * FROM student_education WHERE student_id = ?', [profile.id]);
    const skills = await db.asyncAll('SELECT * FROM student_skills WHERE student_id = ?', [profile.id]);
    const experience = await db.asyncAll('SELECT * FROM student_experience WHERE student_id = ?', [profile.id]);
    const projects = await db.asyncAll('SELECT * FROM student_projects WHERE student_id = ?', [profile.id]);

    // Calculate profile completion percentage
    let score = 0;
    if (profile.full_name) score += 15;
    if (profile.phone) score += 10;
    if (profile.bio) score += 10;
    if (profile.university) score += 15;
    if (profile.cv_url) score += 20;
    if (skills.length > 0) score += 10;
    if (experience.length > 0) score += 10;
    if (projects.length > 0) score += 10;

    res.json({
      profile: {
        ...profile,
        education,
        skills,
        experience,
        projects,
        completionPercentage: Math.min(score, 100)
      }
    });
  } catch (err) {
    console.error('Lỗi lấy hồ sơ sinh viên:', err);
    res.status(500).json({ error: 'Lỗi máy chủ' });
  }
});

// Get student public profile by ID (For Companies)
router.get('/public-profile/:id', authenticateToken, async (req, res) => {
  try {
    const profileId = req.params.id;
    const profile = await db.asyncGet('SELECT * FROM student_profiles WHERE id = ?', [profileId]);
    if (!profile) {
      return res.status(404).json({ error: 'Không tìm thấy hồ sơ sinh viên' });
    }

    const education = await db.asyncAll('SELECT * FROM student_education WHERE student_id = ?', [profileId]);
    const skills = await db.asyncAll('SELECT * FROM student_skills WHERE student_id = ?', [profileId]);
    const experience = await db.asyncAll('SELECT * FROM student_experience WHERE student_id = ?', [profileId]);
    const projects = await db.asyncAll('SELECT * FROM student_projects WHERE student_id = ?', [profileId]);

    res.json({
      profile: {
        ...profile,
        education,
        skills,
        experience,
        projects
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi máy chủ' });
  }
});

// Update personal information
router.put('/profile', authenticateToken, isStudent, async (req, res) => {
  try {
    const { full_name, phone, location, bio, university, major, graduation_year, gpa, linkedin_url, github_url, website_url } = req.body;

    const profile = await db.asyncGet('SELECT id FROM student_profiles WHERE user_id = ?', [req.user.id]);
    if (!profile) {
      return res.status(404).json({ error: 'Không tìm thấy hồ sơ sinh viên' });
    }

    await db.asyncRun(
      `
      UPDATE student_profiles SET
        full_name = ?, phone = ?, location = ?, bio = ?, university = ?, major = ?,
        graduation_year = ?, gpa = ?, linkedin_url = ?, github_url = ?, website_url = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
      [
        full_name,
        phone,
        location,
        bio,
        university,
        major,
        graduation_year ? parseInt(graduation_year) : null,
        gpa ? parseFloat(gpa) : null,
        linkedin_url,
        github_url,
        website_url,
        profile.id
      ]
    );

    res.json({ message: 'Cập nhật thông tin cá nhân thành công' });
  } catch (err) {
    console.error('Lỗi cập nhật thông tin:', err);
    res.status(500).json({ error: 'Lỗi khi cập nhật hồ sơ' });
  }
});

// Upload Avatar
router.post('/avatar', authenticateToken, isStudent, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Vui lòng chọn hình ảnh đại diện' });
    }

    const avatarUrl = `/uploads/${req.file.filename}`;
    await db.asyncRun('UPDATE student_profiles SET avatar = ? WHERE user_id = ?', [avatarUrl, req.user.id]);

    res.json({ message: 'Cập nhật ảnh đại diện thành công', avatarUrl });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Lỗi khi tải ảnh đại diện' });
  }
});

// CV Upload / Replace
router.post('/cv', authenticateToken, isStudent, upload.single('cv'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Vui lòng chọn tệp CV để tải lên (PDF, DOC, DOCX)' });
    }

    const cvUrl = `/uploads/${req.file.filename}`;
    const cvFilename = req.file.originalname;

    const profile = await db.asyncGet('SELECT cv_url FROM student_profiles WHERE user_id = ?', [req.user.id]);

    // Delete old file if exists
    if (profile && profile.cv_url) {
      const oldPath = path.join(__dirname, '..', profile.cv_url);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    await db.asyncRun(
      'UPDATE student_profiles SET cv_url = ?, cv_filename = ?, cv_updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
      [cvUrl, cvFilename, req.user.id]
    );

    res.json({ message: 'Tải lên CV thành công', cvUrl, cvFilename });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Lỗi khi tải lên CV' });
  }
});

// Delete CV
router.delete('/cv', authenticateToken, isStudent, async (req, res) => {
  try {
    const profile = await db.asyncGet('SELECT cv_url FROM student_profiles WHERE user_id = ?', [req.user.id]);

    if (profile && profile.cv_url) {
      const oldPath = path.join(__dirname, '..', profile.cv_url);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }

      await db.asyncRun(
        'UPDATE student_profiles SET cv_url = NULL, cv_filename = NULL, cv_updated_at = NULL WHERE user_id = ?',
        [req.user.id]
      );
    }

    res.json({ message: 'Đã xóa CV thành công' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi xóa CV' });
  }
});

// CRUD for Education
router.post('/education', authenticateToken, isStudent, async (req, res) => {
  try {
    const { university, major, graduation_year, gpa, degree } = req.body;
    const profile = await db.asyncGet('SELECT id FROM student_profiles WHERE user_id = ?', [req.user.id]);

    const result = await db.asyncRun(
      `INSERT INTO student_education (student_id, university, major, graduation_year, gpa, degree) VALUES (?, ?, ?, ?, ?, ?)`,
      [profile.id, university, major, graduation_year, gpa, degree]
    );

    res.status(201).json({ message: 'Thêm học vấn thành công', id: result.lastID });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi thêm học vấn' });
  }
});

router.delete('/education/:id', authenticateToken, isStudent, async (req, res) => {
  try {
    const profile = await db.asyncGet('SELECT id FROM student_profiles WHERE user_id = ?', [req.user.id]);
    await db.asyncRun('DELETE FROM student_education WHERE id = ? AND student_id = ?', [req.params.id, profile.id]);
    res.json({ message: 'Đã xóa thông tin học vấn' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi xóa học vấn' });
  }
});

// CRUD for Skills
router.post('/skills', authenticateToken, isStudent, async (req, res) => {
  try {
    const { skill_name, skill_level } = req.body;
    const profile = await db.asyncGet('SELECT id FROM student_profiles WHERE user_id = ?', [req.user.id]);

    const result = await db.asyncRun(
      `INSERT INTO student_skills (student_id, skill_name, skill_level) VALUES (?, ?, ?)`,
      [profile.id, skill_name, skill_level || 'Trung bình']
    );

    res.status(201).json({ message: 'Thêm kỹ năng thành công', id: result.lastID });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi thêm kỹ năng' });
  }
});

router.delete('/skills/:id', authenticateToken, isStudent, async (req, res) => {
  try {
    const profile = await db.asyncGet('SELECT id FROM student_profiles WHERE user_id = ?', [req.user.id]);
    await db.asyncRun('DELETE FROM student_skills WHERE id = ? AND student_id = ?', [req.params.id, profile.id]);
    res.json({ message: 'Đã xóa kỹ năng' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi xóa kỹ năng' });
  }
});

// CRUD for Experience
router.post('/experience', authenticateToken, isStudent, async (req, res) => {
  try {
    const { company, position, start_date, end_date, is_current, description } = req.body;
    const profile = await db.asyncGet('SELECT id FROM student_profiles WHERE user_id = ?', [req.user.id]);

    const result = await db.asyncRun(
      `INSERT INTO student_experience (student_id, company, position, start_date, end_date, is_current, description) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [profile.id, company, position, start_date, end_date, is_current ? 1 : 0, description]
    );

    res.status(201).json({ message: 'Thêm kinh nghiệm thành công', id: result.lastID });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi thêm kinh nghiệm' });
  }
});

router.delete('/experience/:id', authenticateToken, isStudent, async (req, res) => {
  try {
    const profile = await db.asyncGet('SELECT id FROM student_profiles WHERE user_id = ?', [req.user.id]);
    await db.asyncRun('DELETE FROM student_experience WHERE id = ? AND student_id = ?', [req.params.id, profile.id]);
    res.json({ message: 'Đã xóa kinh nghiệm làm việc' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi xóa kinh nghiệm' });
  }
});

// CRUD for Projects
router.post('/projects', authenticateToken, isStudent, async (req, res) => {
  try {
    const { title, description, technologies, project_url } = req.body;
    const profile = await db.asyncGet('SELECT id FROM student_profiles WHERE user_id = ?', [req.user.id]);

    const result = await db.asyncRun(
      `INSERT INTO student_projects (student_id, title, description, technologies, project_url) VALUES (?, ?, ?, ?, ?)`,
      [profile.id, title, description, technologies, project_url]
    );

    res.status(201).json({ message: 'Thêm dự án thành công', id: result.lastID });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi thêm dự án' });
  }
});

router.delete('/projects/:id', authenticateToken, isStudent, async (req, res) => {
  try {
    const profile = await db.asyncGet('SELECT id FROM student_profiles WHERE user_id = ?', [req.user.id]);
    await db.asyncRun('DELETE FROM student_projects WHERE id = ? AND student_id = ?', [req.params.id, profile.id]);
    res.json({ message: 'Đã xóa dự án cá nhân' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi xóa dự án' });
  }
});

module.exports = router;
