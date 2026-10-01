const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'nctdh23_super_secret_jwt_key_2026';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Không tìm thấy mã xác thực (Token missing)' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Mã xác thực không hợp lệ hoặc đã hết hạn' });
    }
    req.user = user;
    next();
  });
};

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Bạn không có quyền thực hiện thao tác này' });
    }
    next();
  };
};

module.exports = {
  JWT_SECRET,
  authenticateToken,
  requireRole,
  isStudent: requireRole('student'),
  isCompany: requireRole('company'),
  isAdmin: requireRole('admin')
};
