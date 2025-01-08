const express = require('express');
const { login } = require('../controllers/superuserController');
const router = express.Router();

router.post('/login', login);

module.exports = router;