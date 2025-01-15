const express = require('express');
const router = express.Router();
const { login, getDashboardStats } = require('../controllers/schoolController');
const { auth } = require('../middleware/auth');

router.post('/login', login);
router.get('/dashboard', auth, getDashboardStats);

module.exports = router; 