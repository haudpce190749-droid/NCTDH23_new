const path = require('path');
const fs = require('fs');

const DATABASE_URL = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
let db = {};

if (DATABASE_URL && (DATABASE_URL.startsWith('postgres://') || DATABASE_URL.startsWith('postgresql://'))) {
  const { Pool, types } = require('pg');
  // Parse BIGINT / COUNT(*) OID 20 as JavaScript integer instead of string
  types.setTypeParser(20, (val) => parseInt(val, 10));

  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  pool.on('error', (err) => {
    console.error('Lỗi kết nối PostgreSQL/Supabase bất ngờ:', err.message);
  });

  console.log('Đã kết nối thành công CSDL Supabase (PostgreSQL)');

  function preparePgQuery(sql, isRun = false) {
    let paramIndex = 1;
    let inString = false;
    let quoteChar = '';
    let result = '';

    for (let i = 0; i < sql.length; i++) {
      const char = sql[i];
      if ((char === "'" || char === '"') && (i === 0 || sql[i - 1] !== '\\')) {
        if (!inString) {
          inString = true;
          quoteChar = char;
        } else if (char === quoteChar) {
          inString = false;
        }
        result += char;
      } else if (char === '?' && !inString) {
        result += `$${paramIndex++}`;
      } else {
        result += char;
      }
    }

    // Replace LIKE with ILIKE for case-insensitive search matching SQLite
    result = result.replace(/\bLIKE\b/g, 'ILIKE');

    const trimmed = result.trim();
    const isInsert = /^\s*INSERT\s+INTO\b/i.test(trimmed);
    if (isRun && isInsert && !/\bRETURNING\b/i.test(trimmed)) {
      result += ' RETURNING id';
    }

    return { convertedSql: result, isInsert };
  }

  function sanitizeParams(params) {
    if (!Array.isArray(params)) return [];
    return params.map((p) => (p === undefined ? null : p));
  }

  db.asyncRun = async function (sql, params = []) {
    const { convertedSql, isInsert } = preparePgQuery(sql, true);
    const res = await pool.query(convertedSql, sanitizeParams(params));
    return {
      lastID: isInsert && res.rows.length > 0 ? res.rows[0].id : null,
      changes: res.rowCount || 0
    };
  };

  db.asyncGet = async function (sql, params = []) {
    const { convertedSql } = preparePgQuery(sql, false);
    const res = await pool.query(convertedSql, sanitizeParams(params));
    return res.rows[0] || null;
  };

  db.asyncAll = async function (sql, params = []) {
    const { convertedSql } = preparePgQuery(sql, false);
    const res = await pool.query(convertedSql, sanitizeParams(params));
    return res.rows;
  };

  db.initSchema = async function () {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          role TEXT NOT NULL CHECK(role IN ('student', 'company', 'admin')),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS student_profiles (
          id SERIAL PRIMARY KEY,
          user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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
          cv_updated_at TIMESTAMP WITH TIME ZONE,
          linkedin_url TEXT,
          github_url TEXT,
          website_url TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS student_education (
          id SERIAL PRIMARY KEY,
          student_id INTEGER NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
          university TEXT NOT NULL,
          major TEXT NOT NULL,
          graduation_year INTEGER,
          gpa REAL,
          degree TEXT
        );

        CREATE TABLE IF NOT EXISTS student_skills (
          id SERIAL PRIMARY KEY,
          student_id INTEGER NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
          skill_name TEXT NOT NULL,
          skill_level TEXT DEFAULT 'Trung bình'
        );

        CREATE TABLE IF NOT EXISTS student_experience (
          id SERIAL PRIMARY KEY,
          student_id INTEGER NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
          company TEXT NOT NULL,
          position TEXT NOT NULL,
          start_date TEXT,
          end_date TEXT,
          is_current INTEGER DEFAULT 0,
          description TEXT
        );

        CREATE TABLE IF NOT EXISTS student_projects (
          id SERIAL PRIMARY KEY,
          student_id INTEGER NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
          title TEXT NOT NULL,
          description TEXT,
          technologies TEXT,
          project_url TEXT
        );

        CREATE TABLE IF NOT EXISTS company_profiles (
          id SERIAL PRIMARY KEY,
          user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS jobs (
          id SERIAL PRIMARY KEY,
          company_id INTEGER NOT NULL REFERENCES company_profiles(id) ON DELETE CASCADE,
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
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS job_skills (
          id SERIAL PRIMARY KEY,
          job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
          skill_name TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS applications (
          id SERIAL PRIMARY KEY,
          job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
          student_id INTEGER NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
          cv_url TEXT,
          cv_filename TEXT,
          cover_letter TEXT,
          portfolio_url TEXT,
          contact_phone TEXT,
          contact_email TEXT,
          status TEXT NOT NULL DEFAULT 'submitted',
          applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          notes TEXT,
          UNIQUE(job_id, student_id)
        );

        CREATE TABLE IF NOT EXISTS saved_jobs (
          id SERIAL PRIMARY KEY,
          student_id INTEGER NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
          job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
          saved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(student_id, job_id)
        );

        CREATE TABLE IF NOT EXISTS email_otps (
          id SERIAL PRIMARY KEY,
          email TEXT NOT NULL,
          otp_code TEXT NOT NULL,
          purpose TEXT NOT NULL DEFAULT 'register',
          expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
          is_verified INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('Khởi tạo Schema CSDL Supabase (PostgreSQL) hoàn tất.');
    } catch (err) {
      console.error('Lỗi tạo Schema CSDL Supabase:', err);
    }
  };
} else {
  // Fallback to local SQLite when DATABASE_URL is not set
  const sqlite3 = require('sqlite3').verbose();
  const dbDir = path.join(__dirname, '../data');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const dbPath = process.env.DATABASE_PATH || path.join(dbDir, 'marketplace.sqlite');
  const sqliteDb = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Lỗi kết nối CSDL SQLite:', err.message);
    } else {
      console.log('Đã kết nối thành công CSDL SQLite cục bộ tại:', dbPath);
    }
  });

  db.asyncRun = function (sql, params = []) {
    return new Promise((resolve, reject) => {
      sqliteDb.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve(this);
      });
    });
  };

  db.asyncGet = function (sql, params = []) {
    return new Promise((resolve, reject) => {
      sqliteDb.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  };

  db.asyncAll = function (sql, params = []) {
    return new Promise((resolve, reject) => {
      sqliteDb.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  };

  db.initSchema = async function () {
    try {
      await this.asyncRun('PRAGMA foreign_keys = ON');

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

      await this.asyncRun(`
        CREATE TABLE IF NOT EXISTS student_skills (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          student_id INTEGER NOT NULL,
          skill_name TEXT NOT NULL,
          skill_level TEXT DEFAULT 'Trung bình',
          FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE
        )
      `);

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

      await this.asyncRun(`
        CREATE TABLE IF NOT EXISTS job_skills (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          job_id INTEGER NOT NULL,
          skill_name TEXT NOT NULL,
          FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
        )
      `);

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

      await this.asyncRun(`
        CREATE TABLE IF NOT EXISTS email_otps (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT NOT NULL,
          otp_code TEXT NOT NULL,
          purpose TEXT NOT NULL DEFAULT 'register',
          expires_at DATETIME NOT NULL,
          is_verified INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      console.log('Khởi tạo Schema CSDL SQLite hoàn tất.');
    } catch (err) {
      console.error('Lỗi tạo Schema CSDL SQLite:', err);
    }
  };
}

db.initPromise = db.initSchema();

module.exports = db;
