const { Sequelize } = require('sequelize');
const Item = require('../models/Item');
const Stock = require('../models/Stock');
const Warehouse = require('../models/Warehouse');
const Supplier = require('../models/Supplier');
const Transaction =require('../models/Transaction')
const { Op } = require("sequelize");  // ⬅ Tambahkan ini
exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.findAll({
      include: [
        {
          model: Stock,
          include: [
            {
              model: Warehouse, // Menyertakan data Warehouse
              attributes: ['nama_gudang'] // Hanya ambil nama gudang
            }
          ]
        },
        {
          model: Supplier,
          attributes: ['nama_supplier'] // Ambil nama supplier juga
        }
      ]
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.createItem = async (req, res) => {
  try {
    const { nama_barang, kategori, batas_minimum, id_supplier } = req.body;

    // Cek apakah semua data yang dibutuhkan ada
    if (!nama_barang || !kategori || !id_supplier) {
      return res.status(400).json({ error: 'Nama barang, kategori, dan id_supplier wajib diisi' });
    }

    // Cek apakah kategori yang dikirim valid
    const validKategori = ['Elektronik', 'Furniture', 'Lainnya'];
    if (!validKategori.includes(kategori)) {
      return res.status(400).json({ error: `Kategori harus salah satu dari: ${validKategori.join(', ')}` });
    }

    // Cek apakah supplier dengan id_supplier ada
    const supplier = await Supplier.findByPk(id_supplier);
    if (!supplier) {
      return res.status(404).json({ error: 'Supplier tidak ditemukan' });
    }

    // Buat item baru
    const newItem = await Item.create({ nama_barang, kategori, batas_minimum, id_supplier });

    res.status(201).json({ message: 'Barang berhasil ditambahkan', newItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Hapus barang
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    await Item.destroy({ where: { id_barang: id } });
    res.json({ message: 'Barang berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Tambah stok ke gudang tertentu
exports.addStock = async (req, res) => {
  try {
    const { id_barang, id_gudang, jumlah } = req.body;

    // Cek apakah stok barang di gudang ini sudah ada
    let stock = await Stock.findOne({ where: { id_barang, id_gudang } });

    if (!stock) {
      // Jika belum ada, buat stok baru
      stock = await Stock.create({ id_barang, id_gudang, jumlah_stok: jumlah });
    } else {
      // Jika sudah ada, tambahkan jumlah stok
      await stock.update({ jumlah_stok: stock.jumlah_stok + jumlah });
    }

    res.json({ message: 'Stok berhasil ditambahkan', stock });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.findAll({
      attributes: ['id_stock', 'jumlah_stok'], // Tambahkan id_stock & jumlah_stok
      include: [
        {
          model: Item,
          attributes: ['nama_barang']
        },
        {
          model: Warehouse,
          attributes: ['nama_gudang']
        }
      ]
    });

    res.json(stocks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.deleteStock = async (req, res) => {
  try {
    const { id } = req.params;
    await Stock.destroy({ where: { id_stok: id } });
    res.json({ message: 'Stok berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.countitem = async (req, res) => {
  const count = await Item.count();
  res.json({ count });
};
exports.countstock= async (req, res) => {
  const totalStock = await Stock.sum("jumlah_stok");
  res.json({ totalStock });
}
exports.getTopSoldItems = async (req, res) => {
  try {
    // Ambil tanggal 7 hari terakhir
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const topSold = await Transaction.findAll({
      attributes: [
        "id_barang",
        [Transaction.sequelize.fn("SUM", Transaction.sequelize.col("jumlah")), "total_terjual"],
        [Transaction.sequelize.fn("MAX", Transaction.sequelize.col("tanggal")), "last_sold_date"], // Ganti createdAt dengan tanggal
      ],
      where: {
        tipe_transaksi: "Keluar", // Hanya transaksi 'Keluar'
        tanggal: { [Op.gte]: oneWeekAgo }, // Ganti createdAt dengan tanggal
      },
      include: [{ model: Item, attributes: ["nama_barang"] }], // Join ke tabel Item untuk mendapatkan nama_barang
      group: ["id_barang", "Item.id_barang"],
      order: [[Transaction.sequelize.fn("SUM", Transaction.sequelize.col("jumlah")), "DESC"]], // Urutkan dari yang paling banyak terjual
      limit: 10, // Ambil 10 barang teratas
    });

    res.json({ topSold });
  } catch (error) {
    console.error("Error fetching top sold items:", error);
    res.status(500).json({ error: "Terjadi kesalahan pada server" });
  }
};