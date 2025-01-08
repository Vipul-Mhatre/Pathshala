const express = require('express');
const { loginSuperuser, loginSchool } = require('../controllers/authController');
const router = express.Router();

router.post('/superuser/login', loginSuperuser);
router.post('/school/login', loginSchool);

module.exports = router;