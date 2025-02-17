const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Registrasi User
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Cek apakah user sudah ada
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'Email sudah digunakan' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user ke database
    const newUser = await User.create({ username, email, password: hashedPassword, role });

    res.json({ message: 'Registrasi berhasil', user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cek apakah user ada
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Email atau password salah' });

    // Bandingkan password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Email atau password salah' });

    // Buat JWT Token
    const token = jwt.sign({ id_user: user.id_user, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    // Simpan token di cookies
    res.cookie('token', token, {
      httpOnly: true, // Agar cookie tidak bisa diakses oleh JavaScript frontend
      secure: false, // Set ke `true` jika pakai HTTPS
      maxAge: 24 * 60 * 60 * 1000 // 1 hari
    });

    res.json({ message: 'Login berhasil' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.logoutUser = (req, res) => {
  res.clearCookie('token'); // Hapus cookie token
  res.json({ message: 'Logout berhasil' });
};
