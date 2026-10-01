const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const db = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const studentRoutes = require('./routes/studentRoutes');
const companyRoutes = require('./routes/companyRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const savedJobRoutes = require('./routes/savedJobRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded files (CVs, Company logos, Avatars)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/saved-jobs', savedJobRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date(), message: 'Hệ thống Cổng Việc Làm Sinh Viên đang hoạt động bình thường.' });
});

// Auto-seed database if empty on startup
require('./config/seed');

// Start Express server listening on 0.0.0.0 for LAN/Wi-Fi access
app.listen(PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(`Backend Server đang chạy tại: http://localhost:${PORT}`);
  console.log(`Tệp CSDL SQLite: backend/data/marketplace.sqlite`);
  console.log(`=======================================================`);
});
