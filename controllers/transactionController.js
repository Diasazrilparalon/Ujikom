const Transaction = require('../models/Transaction');
const Item = require('../models/Item');
const Supplier = require('../models/Supplier');
const User = require('../models/User');
const Stock = require('../models/Stock');

exports.createTransaction = async (req, res) => {exports.createTransaction = async (req, res) => {
  try {
    console.log("Data yang diterima dari frontend:", req.body);

    const { id_barang, tipe_transaksi, jumlah, id_supplier, konsumen, id_user, lokasi_gudang } = req.body;

    const item = await Item.findByPk(id_barang);
    const user = await User.findByPk(id_user);
    
    if (!item) {
      console.log("Barang tidak ditemukan");
      return res.status(404).json({ error: 'Barang tidak ditemukan' });
    }
    if (!user) {
      console.log("User tidak ditemukan");
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }

    let stock = await Stock.findOne({ where: { id_barang, lokasi_gudang } });

    if (!stock) {
      console.log("Stok tidak ditemukan, membuat stok baru...");
      stock = await Stock.create({ id_barang, jumlah_stok: 0, lokasi_gudang });
    }

    if (tipe_transaksi === 'Masuk') {
      if (!id_supplier) {
        console.log("Supplier tidak diisi");
        return res.status(400).json({ error: 'Supplier harus diisi untuk barang masuk' });
      }
      await Transaction.create({ id_barang, tipe_transaksi, jumlah, id_supplier, id_user });
      await stock.update({ jumlah_stok: stock.jumlah_stok + jumlah });

    } else if (tipe_transaksi === 'Keluar') {
      if (!konsumen) {
        console.log("Konsumen tidak diisi");
        return res.status(400).json({ error: 'Konsumen harus diisi untuk barang keluar' });
      }
      if (stock.jumlah_stok < jumlah) {
        console.log("Stok tidak cukup");
        return res.status(400).json({ error: 'Stok tidak cukup' });
      }
      await Transaction.create({ id_barang, tipe_transaksi, jumlah, konsumen, id_user });
      await stock.update({ jumlah_stok: stock.jumlah_stok - jumlah });

    } else {
      console.log("Tipe transaksi tidak valid");
      return res.status(400).json({ error: 'Tipe transaksi tidak valid' });
    }

    console.log("Transaksi berhasil disimpan");
    res.json({ message: 'Transaksi berhasil' });

  } catch (error) {
    console.error("Error di backend:", error);
    res.status(500).json({ error: error.message });
  }
};

  try {
    const { id_barang, tipe_transaksi, jumlah, id_supplier, konsumen, id_user, lokasi_gudang } = req.body;

    const item = await Item.findByPk(id_barang);
    const user = await User.findByPk(id_user);
    if (!item) return res.status(404).json({ error: 'Barang tidak ditemukan' });
    if (!user) return res.status(404).json({ error: 'User tidak ditemukan' });

    let stock = await Stock.findOne({ where: { id_barang, lokasi_gudang } });

    if (!stock) {
      stock = await Stock.create({ id_barang, jumlah_stok: 0, lokasi_gudang });
    }

    if (tipe_transaksi === 'Masuk') {
      if (!id_supplier) return res.status(400).json({ error: 'Supplier harus diisi untuk barang masuk' });
      await Transaction.create({ id_barang, tipe_transaksi, jumlah, id_supplier, id_user });
      await stock.update({ jumlah_stok: stock.jumlah_stok + jumlah });

    } else if (tipe_transaksi === 'Keluar') {
      if (!konsumen) return res.status(400).json({ error: 'Konsumen harus diisi untuk barang keluar' });
      if (stock.jumlah_stok < jumlah) return res.status(400).json({ error: 'Stok tidak cukup' });
      await Transaction.create({ id_barang, tipe_transaksi, jumlah, konsumen, id_user });
      await stock.update({ jumlah_stok: stock.jumlah_stok - jumlah });

    } else {
      return res.status(400).json({ error: 'Tipe transaksi tidak valid' });
    }

    res.json({ message: 'Transaksi berhasil' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// **1. Get All Transactions**
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      include: [
        { model: Item, attributes: ['nama_barang'] },
        { model: Supplier, attributes: ['nama_supplier'] },
        { model: User, attributes: ['username'] }
      ],
      order: [['id_transaksi', 'DESC']]
    });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// **2. Get Transaction By ID**
exports.getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findByPk(id, {
      include: [
        { model: Item, attributes: ['nama_barang'] },
        { model: Supplier, attributes: ['nama_supplier'] },
        { model: User, attributes: ['username'] }
      ]
    });

    if (!transaction) return res.status(404).json({ error: 'Transaksi tidak ditemukan' });

    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// **3. Update Transaction**
exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_barang, tipe_transaksi, jumlah, id_supplier, konsumen, id_user, lokasi_gudang } = req.body;

    const transaction = await Transaction.findByPk(id);
    if (!transaction) return res.status(404).json({ error: 'Transaksi tidak ditemukan' });

    const item = await Item.findByPk(id_barang);
    const user = await User.findByPk(id_user);
    if (!item) return res.status(404).json({ error: 'Barang tidak ditemukan' });
    if (!user) return res.status(404).json({ error: 'User tidak ditemukan' });

    let stock = await Stock.findOne({ where: { id_barang, lokasi_gudang } });
    if (!stock) {
      stock = await Stock.create({ id_barang, jumlah_stok: 0, lokasi_gudang });
    }

    // Logika update stok jika jumlah berubah
    if (transaction.jumlah !== jumlah) {
      if (transaction.tipe_transaksi === 'Masuk') {
        stock.jumlah_stok -= transaction.jumlah; // Kurangi stok lama
        stock.jumlah_stok += jumlah; // Tambahkan stok baru
      } else if (transaction.tipe_transaksi === 'Keluar') {
        stock.jumlah_stok += transaction.jumlah;
        if (stock.jumlah_stok < jumlah) return res.status(400).json({ error: 'Stok tidak cukup' });
        stock.jumlah_stok -= jumlah;
      }
      await stock.save();
    }

    await transaction.update({ id_barang, tipe_transaksi, jumlah, id_supplier, konsumen, id_user });

    res.status(200).json({ message: 'Transaksi berhasil diperbarui', transaction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// **4. Delete Transaction**
exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findByPk(id);
    if (!transaction) return res.status(404).json({ error: 'Transaksi tidak ditemukan' });

    let stock = await Stock.findOne({ where: { id_barang: transaction.id_barang } });

    if (transaction.tipe_transaksi === 'Masuk') {
      stock.jumlah_stok -= transaction.jumlah;
    } else if (transaction.tipe_transaksi === 'Keluar') {
      stock.jumlah_stok += transaction.jumlah;
    }

    await stock.save();
    await transaction.destroy();

    res.status(200).json({ message: 'Transaksi berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
