const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');

router.get('/suplier', supplierController.getAllSuppliers);
router.post('/createsupplier', supplierController.createSupplier);
router.delete('/:id', supplierController.deleteSupplier);

module.exports = router;
