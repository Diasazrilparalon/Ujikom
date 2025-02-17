const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.authMiddleware = (req, res, next) => {
  const token = req.cookies.token; // Ambil token dari cookies
  if (!token) return res.status(401).json({ error: 'Akses ditolak, tidak ada token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Simpan data user di request
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token tidak valid' });
  }
};

// Middleware untuk Admin
exports.adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ error: 'Hanya admin yang dapat mengakses' });
  }
  next();
};
