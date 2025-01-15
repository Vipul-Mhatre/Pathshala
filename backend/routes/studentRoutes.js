const express = require('express');
const { getStudents, getAllStudents } = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Route to get students for a specific school
router.get('/', authMiddleware, getStudents);

// Route to get all students (optional, for admin or superuser)
router.get('/all', authMiddleware, getAllStudents);

module.exports = router;