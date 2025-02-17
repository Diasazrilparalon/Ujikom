const { Sequelize } = require('sequelize');
const Item = require('../models/Item');
const Stock = require('../models/Stock');
const Warehouse = require('../models/Warehouse');
const Supplier = require('../models/Supplier');

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


// Tambah barang baru
exports.createItem = async (req, res) => {
  try {
    const { nama_barang, kategori, batas_minimum } = req.body;
    const newItem = await Item.create({ nama_barang, kategori, batas_minimum });
    res.json(newItem);
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