const express = require('express');
const router = express.Router();
const { superuserLogin, schoolLogin, studentLogin, registerUser } = require('../controllers/authController');

router.post('/superuser/login', superuserLogin);
router.post('/school/login', schoolLogin);
router.post('/student/login', studentLogin);
router.post('/register', registerUser);  

module.exports = router;