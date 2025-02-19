const Warehouse = require('../models/Warehouse');

exports.createWarehouse = async (req, res) => {
  try {
    const { nama_gudang, lokasi } = req.body;
    const warehouse = await Warehouse.create({ nama_gudang, lokasi });
    res.json({ message: 'Gudang berhasil ditambahkan', warehouse });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllWarehouses = async (req, res) => {
  try {
    const warehouses = await Warehouse.findAll();
    res.json(warehouses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.countgudang = async (req, res) => {
  const count = await Warehouse.count();
  res.json({ count });
};
