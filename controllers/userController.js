const User = require('../models/User');
const bcrypt = require('bcrypt');

// Ambil semua user
exports.getAllUsers = async (req, res) => {
  try {
      const users = await User.findAll({
          attributes: ['id_user', 'username', 'email', 'role', 'password'] // Pastikan password dimasukkan
      });
      res.json(users);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};


// Edit User
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password, role } = req.body;

    // Cari user berdasarkan ID
    const user = await User.findOne({ where: { id_user: id } });
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    // Jika password diubah, hash ulang
    let hashedPassword = user.password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Update user
    await User.update(
      { username, email, password: hashedPassword, role },
      { where: { id_user: id } }
    );

    res.json({ message: 'User berhasil diperbarui' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Registrasi User
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, password: hashedPassword, role });
    res.json({ message: 'Registrasi berhasil', user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Hapus User
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.destroy({ where: { id_user: id } });
    res.json({ message: 'User berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
