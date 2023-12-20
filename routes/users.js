const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');


const userController = require('../controllers/userController');

router.post('/create', isAuthenticated, isAdmin, userController.createOrUpdateUser);
router.get('/create', isAuthenticated, isAdmin, userController.createOrUpdateUser);
router.get('/', isAuthenticated, isAdmin, userController.getUsers);

module.exports = router;
