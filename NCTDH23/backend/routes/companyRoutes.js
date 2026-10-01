const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken, isCompany } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public Company Directory
router.get('/', async (req, res) => {
  try {
    const { q, industry, location } = req.query;
    let sql = `
      SELECT c.*, (SELECT COUNT(*) FROM jobs j WHERE j.company_id = c.id AND j.status = 'published') as open_jobs_count
      FROM company_profiles c
      WHERE 1=1
    `;
    const params = [];

    if (q) {
      sql += ` AND (c.company_name LIKE ? OR c.description LIKE ?)`;
      params.push(`%${q}%`, `%${q}%`);
    }

    if (industry) {
      sql += ` AND c.industry = ?`;
      params.push(industry);
    }

    if (location) {
      sql += ` AND c.location LIKE ?`;
      params.push(`%${location}%`);
    }

    sql += ` ORDER BY open_jobs_count DESC, c.company_name ASC`;

    const companies = await db.asyncAll(sql, params);
    res.json({ companies });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi lấy danh sách nhà tuyển dụng' });
  }
});

// Get Company profile by ID (Public view with active job postings)
router.get('/:id', async (req, res) => {
  try {
    const companyId = req.params.id;
    const company = await db.asyncGet('SELECT * FROM company_profiles WHERE id = ?', [companyId]);

    if (!company) {
      return res.status(404).json({ error: 'Không tìm thấy doanh nghiệp' });
    }

    const jobs = await db.asyncAll(
      `SELECT * FROM jobs WHERE company_id = ? AND status = 'published' ORDER BY created_at DESC`,
      [companyId]
    );

    for (let job of jobs) {
      const skills = await db.asyncAll('SELECT skill_name FROM job_skills WHERE job_id = ?', [job.id]);
      job.skills = skills.map((s) => s.skill_name);
    }

    res.json({ company, jobs });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi lấy chi tiết doanh nghiệp' });
  }
});

// Get current logged-in company profile & stats dashboard
router.get('/dashboard/me', authenticateToken, isCompany, async (req, res) => {
  try {
    const company = await db.asyncGet('SELECT * FROM company_profiles WHERE user_id = ?', [req.user.id]);
    if (!company) {
      return res.status(404).json({ error: 'Không tìm thấy thông tin doanh nghiệp' });
    }

    const activeJobsCount = await db.asyncGet(
      "SELECT COUNT(*) as count FROM jobs WHERE company_id = ? AND status = 'published'",
      [company.id]
    );
    const closedJobsCount = await db.asyncGet(
      "SELECT COUNT(*) as count FROM jobs WHERE company_id = ? AND status = 'closed'",
      [company.id]
    );
    const draftJobsCount = await db.asyncGet(
      "SELECT COUNT(*) as count FROM jobs WHERE company_id = ? AND status = 'draft'",
      [company.id]
    );

    const totalApplications = await db.asyncGet(
      `
      SELECT COUNT(a.id) as count 
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE j.company_id = ?
    `,
      [company.id]
    );

    const recentApplications = await db.asyncAll(
      `
      SELECT a.*, j.title as job_title, s.full_name as student_name, s.avatar as student_avatar
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      JOIN student_profiles s ON a.student_id = s.id
      WHERE j.company_id = ?
      ORDER BY a.applied_at DESC
      LIMIT 5
    `,
      [company.id]
    );

    res.json({
      company,
      stats: {
        activeJobs: activeJobsCount.count,
        closedJobs: closedJobsCount.count,
        draftJobs: draftJobsCount.count,
        totalApplications: totalApplications.count
      },
      recentApplications
    });
  } catch (err) {
    console.error('Lỗi dashboard công ty:', err);
    res.status(500).json({ error: 'Lỗi máy chủ khi lấy dữ liệu dashboard' });
  }
});

// Get company's own posted jobs
router.get('/jobs/my-jobs', authenticateToken, isCompany, async (req, res) => {
  try {
    const company = await db.asyncGet('SELECT id FROM company_profiles WHERE user_id = ?', [req.user.id]);

    const jobs = await db.asyncAll(
      `
      SELECT j.*, (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id) as applicants_count
      FROM jobs j
      WHERE j.company_id = ?
      ORDER BY j.created_at DESC
    `,
      [company.id]
    );

    res.json({ jobs });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi lấy danh sách việc làm đã đăng' });
  }
});

// Update Company Profile
router.put('/profile', authenticateToken, isCompany, async (req, res) => {
  try {
    const { company_name, description, industry, company_size, location, website, contact_email, contact_phone, linkedin_url, facebook_url } = req.body;

    const company = await db.asyncGet('SELECT id FROM company_profiles WHERE user_id = ?', [req.user.id]);
    if (!company) {
      return res.status(404).json({ error: 'Không tìm thấy hồ sơ doanh nghiệp' });
    }

    await db.asyncRun(
      `
      UPDATE company_profiles SET
        company_name = ?, description = ?, industry = ?, company_size = ?, location = ?,
        website = ?, contact_email = ?, contact_phone = ?, linkedin_url = ?, facebook_url = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
      [
        company_name,
        description,
        industry,
        company_size,
        location,
        website,
        contact_email,
        contact_phone,
        linkedin_url,
        facebook_url,
        company.id
      ]
    );

    res.json({ message: 'Cập nhật thông tin công ty thành công' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi cập nhật hồ sơ doanh nghiệp' });
  }
});

// Upload Company Logo
router.post('/logo', authenticateToken, isCompany, upload.single('logo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Vui lòng chọn hình ảnh logo' });
    }

    const logoUrl = `/uploads/${req.file.filename}`;
    await db.asyncRun('UPDATE company_profiles SET logo = ? WHERE user_id = ?', [logoUrl, req.user.id]);

    res.json({ message: 'Tải logo công ty thành công', logoUrl });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Lỗi khi tải logo' });
  }
});

module.exports = router;
