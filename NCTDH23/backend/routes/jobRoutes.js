const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken, isCompany } = require('../middleware/auth');

// Get all jobs with filtering, search & pagination
router.get('/', async (req, res) => {
  try {
    const {
      q,
      location,
      category,
      jobType,
      experience,
      locationType,
      minSalary,
      sort = 'newest',
      page = 1,
      limit = 10
    } = req.query;

    let sql = `
      SELECT j.*, c.company_name, c.logo as company_logo, c.industry as company_industry
      FROM jobs j
      JOIN company_profiles c ON j.company_id = c.id
      WHERE j.status = 'published'
    `;
    const params = [];

    if (q) {
      sql += ` AND (j.title LIKE ? OR j.description LIKE ? OR j.requirements LIKE ? OR c.company_name LIKE ?)`;
      const term = `%${q}%`;
      params.push(term, term, term, term);
    }

    if (location) {
      sql += ` AND j.location LIKE ?`;
      params.push(`%${location}%`);
    }

    if (category) {
      sql += ` AND j.category = ?`;
      params.push(category);
    }

    if (jobType) {
      sql += ` AND j.job_type = ?`;
      params.push(jobType);
    }

    if (experience) {
      sql += ` AND j.experience_level = ?`;
      params.push(experience);
    }

    if (locationType) {
      sql += ` AND j.work_location_type = ?`;
      params.push(locationType);
    }

    if (minSalary) {
      sql += ` AND (j.salary_max >= ? OR j.salary_negotiable = 1)`;
      params.push(parseInt(minSalary));
    }

    // Sort order
    if (sort === 'salary_high') {
      sql += ` ORDER BY j.salary_max DESC, j.created_at DESC`;
    } else if (sort === 'oldest') {
      sql += ` ORDER BY j.created_at ASC`;
    } else {
      sql += ` ORDER BY j.created_at DESC`;
    }

    // Count total matches
    const countRows = await db.asyncAll(sql, params);
    const totalCount = countRows.length;

    // Apply pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    sql += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);

    const jobs = await db.asyncAll(sql, params);

    // Fetch skills for each job
    for (let job of jobs) {
      const skills = await db.asyncAll('SELECT skill_name FROM job_skills WHERE job_id = ?', [job.id]);
      job.skills = skills.map((s) => s.skill_name);
    }

    res.json({
      jobs,
      pagination: {
        total: totalCount,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalCount / parseInt(limit))
      }
    });
  } catch (err) {
    console.error('Lỗi tìm kiếm việc làm:', err);
    res.status(500).json({ error: 'Lỗi máy chủ khi lấy danh sách việc làm' });
  }
});

// Get Categories and Locations metadata for filters
router.get('/meta/options', async (req, res) => {
  try {
    const categories = await db.asyncAll(`SELECT DISTINCT category FROM jobs WHERE category IS NOT NULL`);
    const locations = await db.asyncAll(`SELECT DISTINCT location FROM jobs WHERE location IS NOT NULL`);
    const jobTypes = ['Full-time', 'Part-time', 'Internship', 'Freelance'];
    const experienceLevels = ['Thực tập sinh', 'Sinh viên mới tốt nghiệp', '1-2 năm', 'Trên 2 năm'];
    const locationTypes = ['Tại văn phòng', 'Từ xa (Remote)', 'Hybrid'];

    res.json({
      categories: categories.map((c) => c.category),
      locations: locations.map((l) => l.location),
      jobTypes,
      experienceLevels,
      locationTypes
    });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi lấy thông tin danh mục' });
  }
});

// Get job details by ID
router.get('/:id', async (req, res) => {
  try {
    const jobId = req.params.id;

    // Increment views count
    await db.asyncRun(`UPDATE jobs SET views_count = views_count + 1 WHERE id = ?`, [jobId]);

    const job = await db.asyncGet(
      `
      SELECT j.*, c.company_name, c.logo as company_logo, c.description as company_description,
             c.location as company_location, c.website as company_website, c.company_size, c.industry as company_industry
      FROM jobs j
      JOIN company_profiles c ON j.company_id = c.id
      WHERE j.id = ?
    `,
      [jobId]
    );

    if (!job) {
      return res.status(404).json({ error: 'Không tìm thấy công việc này' });
    }

    const skills = await db.asyncAll('SELECT skill_name FROM job_skills WHERE job_id = ?', [jobId]);
    job.skills = skills.map((s) => s.skill_name);

    // Fetch related jobs in same category
    const relatedJobs = await db.asyncAll(
      `
      SELECT j.id, j.title, j.location, j.salary_min, j.salary_max, j.salary_negotiable, j.job_type, c.company_name, c.logo as company_logo
      FROM jobs j
      JOIN company_profiles c ON j.company_id = c.id
      WHERE j.category = ? AND j.id != ? AND j.status = 'published'
      LIMIT 4
    `,
      [job.category, jobId]
    );

    res.json({ job, relatedJobs });
  } catch (err) {
    console.error('Lỗi xem chi tiết việc làm:', err);
    res.status(500).json({ error: 'Lỗi máy chủ' });
  }
});

// CREATE Job posting (Company only)
router.post('/', authenticateToken, isCompany, async (req, res) => {
  try {
    const company = await db.asyncGet('SELECT id FROM company_profiles WHERE user_id = ?', [req.user.id]);
    if (!company) {
      return res.status(400).json({ error: 'Vui lòng hoàn thiện hồ sơ doanh nghiệp trước khi đăng tin' });
    }

    const {
      title,
      category,
      jobType,
      experienceLevel,
      workLocationType,
      location,
      salaryMin,
      salaryMax,
      salaryNegotiable,
      description,
      responsibilities,
      requirements,
      benefits,
      deadline,
      status = 'published',
      skills = []
    } = req.body;

    if (!title || !category || !jobType || !location || !description) {
      return res.status(400).json({ error: 'Vui lòng điền đầy đủ các thông tin bắt buộc' });
    }

    const jobRes = await db.asyncRun(
      `
      INSERT INTO jobs (company_id, title, category, job_type, experience_level, work_location_type, location,
                        salary_min, salary_max, salary_negotiable, description, responsibilities, requirements, benefits, deadline, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        company.id,
        title,
        category,
        jobType,
        experienceLevel || 'Sinh viên mới tốt nghiệp',
        workLocationType || 'Tại văn phòng',
        location,
        salaryMin || 0,
        salaryMax || 0,
        salaryNegotiable ? 1 : 0,
        description,
        responsibilities || '',
        requirements || '',
        benefits || '',
        deadline || null,
        status
      ]
    );

    const jobId = jobRes.lastID;

    if (Array.isArray(skills)) {
      for (const sk of skills) {
        if (sk && sk.trim()) {
          await db.asyncRun('INSERT INTO job_skills (job_id, skill_name) VALUES (?, ?)', [jobId, sk.trim()]);
        }
      }
    }

    res.status(201).json({ message: 'Tạo tin tuyển dụng thành công', jobId });
  } catch (err) {
    console.error('Lỗi đăng tin:', err);
    res.status(500).json({ error: 'Lỗi máy chủ khi đăng tin tuyển dụng' });
  }
});

// UPDATE Job posting (Company only)
router.put('/:id', authenticateToken, isCompany, async (req, res) => {
  try {
    const jobId = req.params.id;
    const company = await db.asyncGet('SELECT id FROM company_profiles WHERE user_id = ?', [req.user.id]);

    const existingJob = await db.asyncGet('SELECT * FROM jobs WHERE id = ? AND company_id = ?', [jobId, company.id]);
    if (!existingJob) {
      return res.status(404).json({ error: 'Không tìm thấy việc làm hoặc bạn không có quyền chỉnh sửa' });
    }

    const {
      title,
      category,
      jobType,
      experienceLevel,
      workLocationType,
      location,
      salaryMin,
      salaryMax,
      salaryNegotiable,
      description,
      responsibilities,
      requirements,
      benefits,
      deadline,
      status,
      skills
    } = req.body;

    await db.asyncRun(
      `
      UPDATE jobs SET
        title = ?, category = ?, job_type = ?, experience_level = ?, work_location_type = ?, location = ?,
        salary_min = ?, salary_max = ?, salary_negotiable = ?, description = ?, responsibilities = ?,
        requirements = ?, benefits = ?, deadline = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
      [
        title || existingJob.title,
        category || existingJob.category,
        jobType || existingJob.job_type,
        experienceLevel || existingJob.experience_level,
        workLocationType || existingJob.work_location_type,
        location || existingJob.location,
        salaryMin !== undefined ? salaryMin : existingJob.salary_min,
        salaryMax !== undefined ? salaryMax : existingJob.salary_max,
        salaryNegotiable !== undefined ? (salaryNegotiable ? 1 : 0) : existingJob.salary_negotiable,
        description || existingJob.description,
        responsibilities !== undefined ? responsibilities : existingJob.responsibilities,
        requirements !== undefined ? requirements : existingJob.requirements,
        benefits !== undefined ? benefits : existingJob.benefits,
        deadline !== undefined ? deadline : existingJob.deadline,
        status || existingJob.status,
        jobId
      ]
    );

    if (Array.isArray(skills)) {
      await db.asyncRun('DELETE FROM job_skills WHERE job_id = ?', [jobId]);
      for (const sk of skills) {
        if (sk && sk.trim()) {
          await db.asyncRun('INSERT INTO job_skills (job_id, skill_name) VALUES (?, ?)', [jobId, sk.trim()]);
        }
      }
    }

    res.json({ message: 'Cập nhật tin tuyển dụng thành công' });
  } catch (err) {
    console.error('Lỗi sửa tin tuyển dụng:', err);
    res.status(500).json({ error: 'Lỗi máy chủ khi cập nhật tin' });
  }
});

// DELETE Job (Company only)
router.delete('/:id', authenticateToken, isCompany, async (req, res) => {
  try {
    const jobId = req.params.id;
    const company = await db.asyncGet('SELECT id FROM company_profiles WHERE user_id = ?', [req.user.id]);

    const existingJob = await db.asyncGet('SELECT id FROM jobs WHERE id = ? AND company_id = ?', [jobId, company.id]);
    if (!existingJob) {
      return res.status(404).json({ error: 'Không tìm thấy tin tuyển dụng hoặc bạn không có quyền xóa' });
    }

    await db.asyncRun('DELETE FROM jobs WHERE id = ?', [jobId]);
    res.json({ message: 'Xóa tin tuyển dụng thành công' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi máy chủ khi xóa tin tuyển dụng' });
  }
});

module.exports = router;
