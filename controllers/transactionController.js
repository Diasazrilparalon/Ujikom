const Transaction = require('../models/Transaction');
const Item = require('../models/Item');
const Supplier = require('../models/Supplier');
const User = require('../models/User');
const Stock = require('../models/Stock');
const Warehouse = require('../models/Warehouse');

exports.createTransaction = async (req, res) => {
  try {
    console.log("Data dari frontend:", req.body);

    const { id_barang, tipe_transaksi, jumlah, id_supplier, konsumen, id_gudang } = req.body;
    const id_user = req.user?.id_user;
    console.log("User dari token:", req.user);
    if (!id_user) return res.status(401).json({ error: "User tidak terautentikasi" });
    
    // Ambil id_user dari token login (JWT)


    // Validasi barang dan gudang
    const item = await Item.findByPk(id_barang);
    if (!item) return res.status(404).json({ error: 'Barang tidak ditemukan' });

    const warehouse = await Warehouse.findByPk(id_gudang);
    if (!warehouse) return res.status(404).json({ error: 'Gudang tidak ditemukan' });

    // Cek stok barang di gudang tertentu
    let stock = await Stock.findOne({ where: { id_barang, id_gudang } });

    if (tipe_transaksi === 'Masuk') {
      if (!id_supplier) return res.status(400).json({ error: 'Supplier harus diisi untuk barang masuk' });

      if (!stock) {
        console.log("Stok belum ada, membuat stok baru...");
        stock = await Stock.create({ id_barang, id_gudang, jumlah_stok: jumlah });
      } else {
        console.log("Stok ditemukan, menambahkan jumlah stok...");
        await stock.update({ jumlah_stok: stock.jumlah_stok + jumlah });
      }

      await Transaction.create({ id_barang, tipe_transaksi, jumlah, id_supplier, id_user, id_gudang });

    } else if (tipe_transaksi === 'Keluar') {
      if (!konsumen) return res.status(400).json({ error: 'Konsumen harus diisi untuk barang keluar' });

      if (!stock || stock.jumlah_stok < jumlah) {
        console.log("Stok tidak cukup atau tidak ada di gudang ini.");
        return res.status(400).json({ error: 'Stok tidak cukup di gudang yang dipilih' });
      }

      await stock.update({ jumlah_stok: stock.jumlah_stok - jumlah });
      await Transaction.create({ id_barang, tipe_transaksi, jumlah, konsumen, id_user, id_gudang });

    } else {
      return res.status(400).json({ error: 'Tipe transaksi tidak valid' });
    }

    console.log("Transaksi berhasil disimpan");
    res.json({ message: 'Transaksi berhasil' });

  } catch (error) {
    console.error("Error di backend:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      include: [
        { model: Item, attributes: ['nama_barang'] },
        { model: Supplier, attributes: ['nama_supplier'], required: false },
        { model: User, attributes: ['username'] },
        { model: Warehouse, attributes: ['nama_gudang'] }
      ],
      order: [['id_transaksi', 'DESC']]
    });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_barang, tipe_transaksi, jumlah, id_supplier, konsumen, id_user, id_gudang } = req.body;

    const transaction = await Transaction.findByPk(id);
    if (!transaction) return res.status(404).json({ error: 'Transaksi tidak ditemukan' });

    const stock = await Stock.findOne({ where: { id_barang, id_gudang } });
    if (!stock) return res.status(404).json({ error: 'Stok tidak ditemukan di gudang ini' });

    // Jika jumlah berubah, update stok
    if (transaction.jumlah !== jumlah) {
      if (transaction.tipe_transaksi === 'Masuk') {
        stock.jumlah_stok = stock.jumlah_stok - transaction.jumlah + jumlah;
      } else if (transaction.tipe_transaksi === 'Keluar') {
        stock.jumlah_stok = stock.jumlah_stok + transaction.jumlah - jumlah;
        if (stock.jumlah_stok < 0) return res.status(400).json({ error: 'Stok tidak cukup' });
      }
      await stock.save();
    }

    await transaction.update({ id_barang, tipe_transaksi, jumlah, id_supplier, konsumen, id_user, id_gudang });

    res.status(200).json({ message: 'Transaksi berhasil diperbarui', transaction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findByPk(id);
    if (!transaction) return res.status(404).json({ error: 'Transaksi tidak ditemukan' });

    const stock = await Stock.findOne({ where: { id_barang: transaction.id_barang, id_gudang: transaction.id_gudang } });

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
exports.recenttransaction = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      limit: 5,
      order: [["tanggal", "DESC"]],
      attributes: ["id_transaksi", "tipe_transaksi", "jumlah", "tanggal"], // Tambahkan tipe_transaksi
      include: {
        model: Item,
        attributes: ["nama_barang"],
      },
    });

    res.json({
      count: transactions.length,
      transactions: transactions.map((trx) => ({
        id_transaksi: trx.id_transaksi,
        nama_barang: trx.Item ? trx.Item.nama_barang : "Barang Tidak Ditemukan",
        tipe_transaksi: trx.tipe_transaksi, // Tambahkan tipe_transaksi
        jumlah: trx.jumlah,
        tanggal: trx.tanggal,
      })),
    });
  } catch (error) {
    console.error("Error fetching recent transactions:", error);
    res.status(500).json({ error: "Gagal mengambil transaksi terbaru" });
  }
};
