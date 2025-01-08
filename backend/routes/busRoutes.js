const express = require('express');
const { addBus } = require('../controllers/busController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, addBus);
// Add more routes for update, delete, etc.

module.exports = router;