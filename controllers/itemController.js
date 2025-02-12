const Item = require('../models/Item');
const Stock = require('../models/Stock');
exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.findAll({
      include: [
        {
          model: Stock,
          attributes: ['jumlah_stok', 'lokasi_gudang'] // Ambil stok & lokasi gudang
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
    const { nama_barang, kategori, stok, batas_minimum } = req.body;
    const newItem = await Item.create({ nama_barang, kategori, stok, batas_minimum });
    res.json(newItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateStock = async (req, res) => {
  try {
    const { stok } = req.body;
    const { id } = req.params;
    const item = await Item.findByPk(id);
    if (!item) return res.status(404).json({ error: 'Barang tidak ditemukan' });

    await item.update({ stok });
    res.json({ message: 'Stok berhasil diperbarui', item });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    await Item.destroy({ where: { id_barang: id } });
    res.json({ message: 'Barang berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTotalStock = async (req, res) => {
  try {
    const totalStock = await Stock.findAll({
      attributes: [
        'id_barang',
        [Sequelize.fn('SUM', Sequelize.col('jumlah_stok')), 'total_stok']
      ],
      group: ['id_barang']
    });
    res.json(totalStock);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};