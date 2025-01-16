const express = require('express');
const router = express.Router();
const { superuserLogin, schoolLogin } = require('../controllers/authController');

// Auth routes
router.post('/superuser/login', superuserLogin);
router.post('/school/login', schoolLogin);

module.exports = router;