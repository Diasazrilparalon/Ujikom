const express = require('express');
const router = express.Router();
const warehouseController = require('../controllers/warehouseController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, adminMiddleware, warehouseController.createWarehouse);
router.get('/', warehouseController.getAllWarehouses);
router.get('/count', warehouseController.countgudang);

module.exports = router;
