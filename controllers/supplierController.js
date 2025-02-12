const Supplier = require('../models/Supplier');

exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.findAll();
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createSupplier = async (req, res) => {
  try {
    const { nama_supplier, kontak_supplier, alamat } = req.body;
    const newSupplier = await Supplier.create({ nama_supplier, kontak_supplier, alamat });
    res.json(newSupplier);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    await Supplier.destroy({ where: { id_supplier: id } });
    res.json({ message: 'Supplier berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
