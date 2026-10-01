const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbDir = path.join(__dirname, '../data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = process.env.DATABASE_PATH || path.join(dbDir, 'marketplace.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Lỗi kết nối CSDL SQLite:', err.message);
  } else {
    console.log('Đã kết nối thành công CSDL SQLite tại:', dbPath);
  }
});

// Helper promise-based query functions
db.asyncRun = function (sql, params = []) {
  return new Promise((resolve, reject) => {
    this.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

db.asyncGet = function (sql, params = []) {
  return new Promise((resolve, reject) => {
    this.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

db.asyncAll = function (sql, params = []) {
  return new Promise((resolve, reject) => {
    this.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Initialize schema tables
db.initSchema = async function () {
  try {
    await this.asyncRun('PRAGMA foreign_keys = ON');

    // Users table
    await this.asyncRun(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('student', 'company', 'admin')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Student profiles table
    await this.asyncRun(`
      CREATE TABLE IF NOT EXISTS student_profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER UNIQUE NOT NULL,
        full_name TEXT NOT NULL,
        avatar TEXT,
        phone TEXT,
        location TEXT,
        bio TEXT,
        university TEXT,
        major TEXT,
        graduation_year INTEGER,
        gpa REAL,
        cv_url TEXT,
        cv_filename TEXT,
        cv_updated_at DATETIME,
        linkedin_url TEXT,
        github_url TEXT,
        website_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Student education
    await this.asyncRun(`
      CREATE TABLE IF NOT EXISTS student_education (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        university TEXT NOT NULL,
        major TEXT NOT NULL,
        graduation_year INTEGER,
        gpa REAL,
        degree TEXT,
        FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE
      )
    `);

    // Student skills
    await this.asyncRun(`
      CREATE TABLE IF NOT EXISTS student_skills (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        skill_name TEXT NOT NULL,
        skill_level TEXT DEFAULT 'Trung bình',
        FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE
      )
    `);

    // Student experience
    await this.asyncRun(`
      CREATE TABLE IF NOT EXISTS student_experience (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        company TEXT NOT NULL,
        position TEXT NOT NULL,
        start_date TEXT,
        end_date TEXT,
        is_current INTEGER DEFAULT 0,
        description TEXT,
        FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE
      )
    `);

    // Student projects
    await this.asyncRun(`
      CREATE TABLE IF NOT EXISTS student_projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        technologies TEXT,
        project_url TEXT,
        FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE
      )
    `);

    // Company profiles
    await this.asyncRun(`
      CREATE TABLE IF NOT EXISTS company_profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER UNIQUE NOT NULL,
        company_name TEXT NOT NULL,
        logo TEXT,
        description TEXT,
        industry TEXT,
        company_size TEXT,
        location TEXT,
        website TEXT,
        contact_email TEXT,
        contact_phone TEXT,
        linkedin_url TEXT,
        facebook_url TEXT,
        is_verified INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Jobs table
    await this.asyncRun(`
      CREATE TABLE IF NOT EXISTS jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        company_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        job_type TEXT NOT NULL,
        experience_level TEXT NOT NULL,
        work_location_type TEXT NOT NULL DEFAULT 'Tại văn phòng',
        location TEXT NOT NULL,
        salary_min INTEGER,
        salary_max INTEGER,
        salary_negotiable INTEGER DEFAULT 0,
        description TEXT NOT NULL,
        responsibilities TEXT,
        requirements TEXT,
        benefits TEXT,
        deadline DATE,
        status TEXT NOT NULL DEFAULT 'published',
        views_count INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES company_profiles(id) ON DELETE CASCADE
      )
    `);

    // Job required skills
    await this.asyncRun(`
      CREATE TABLE IF NOT EXISTS job_skills (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        job_id INTEGER NOT NULL,
        skill_name TEXT NOT NULL,
        FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
      )
    `);

    // Job applications
    await this.asyncRun(`
      CREATE TABLE IF NOT EXISTS applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        job_id INTEGER NOT NULL,
        student_id INTEGER NOT NULL,
        cv_url TEXT,
        cv_filename TEXT,
        cover_letter TEXT,
        portfolio_url TEXT,
        contact_phone TEXT,
        contact_email TEXT,
        status TEXT NOT NULL DEFAULT 'submitted',
        applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        notes TEXT,
        FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
        FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE,
        UNIQUE(job_id, student_id)
      )
    `);

    // Saved jobs
    await this.asyncRun(`
      CREATE TABLE IF NOT EXISTS saved_jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        job_id INTEGER NOT NULL,
        saved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE,
        FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
        UNIQUE(student_id, job_id)
      )
    `);

    console.log('Khởi tạo Schema CSDL hoàn tất.');
  } catch (err) {
    console.error('Lỗi tạo Schema CSDL:', err);
  }
};

db.initPromise = db.initSchema();

module.exports = db;
