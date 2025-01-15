const express = require('express');
const router = express.Router();
const { superuserLogin, schoolLogin, studentLogin } = require('../controllers/authController');

router.post('/superuser/login', superuserLogin);
router.post('/school/login', schoolLogin);
router.post('/student/login', studentLogin);

module.exports = router;