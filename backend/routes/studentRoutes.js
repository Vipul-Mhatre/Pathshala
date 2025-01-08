const express = require('express');
const { addStudent } = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, addStudent);
// Add more routes for update, delete, attendance tracking, etc.

module.exports = router;