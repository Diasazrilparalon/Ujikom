const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

router.get('/', itemController.getAllItems);
router.post('/', itemController.createItem);
router.delete('/:id', itemController.deleteItem);
router.get('/total-stock', itemController.getAllStocks);
router.post('/add-stock', itemController.addStock); // Endpoint baru untuk menambah stok
router.delete('/delete-stock', itemController.deleteStock); // Endpoint baru untuk menambah stok\
router.get('/count',itemController.countitem);
router.get('/countstok',itemController.countstock);
router.get("/top-sold", itemController.getTopSoldItems); // Endpoint untuk barang terlaris
module.exports = router;
