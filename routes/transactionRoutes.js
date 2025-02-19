const express = require('express');
const TransactionController = require('../controllers/TransactionController');
const {authMiddleware} = require('../middlewares/authMiddleware')
const router = express.Router();

router.get('/', TransactionController.getAllTransactions);
// router.get('/:id', TransactionController.getTransactionById);
router.post('/', authMiddleware, TransactionController.createTransaction);
router.put('/:id', TransactionController.updateTransaction);
router.delete('/:id', TransactionController.deleteTransaction);
router.get('/recent', TransactionController.recenttransaction);
module.exports = router;
