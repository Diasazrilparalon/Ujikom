const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

router.get('/itemall', itemController.getAllItems);  // Hanya user login
router.post('/createitem', authMiddleware, adminMiddleware, itemController.createItem); // Hanya admin
router.put('/:id', authMiddleware, adminMiddleware, itemController.updateStock);
router.delete('/:id', authMiddleware, adminMiddleware, itemController.deleteItem);

module.exports = router;
