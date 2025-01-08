const express = require('express');
const { createSchool } = require('../controllers/schoolController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, createSchool);
// Add more routes for login, update, delete, etc.

module.exports = router;