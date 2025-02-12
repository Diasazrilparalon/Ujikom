const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/user', userController.getAllUsers);
router.post('/register', userController.registerUser);
router.delete('/user/:id', userController.deleteUser);
router.put('/user/:id', userController.updateUser);
module.exports = router;
