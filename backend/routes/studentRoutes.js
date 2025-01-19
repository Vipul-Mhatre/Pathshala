const express = require('express');
const router = express.Router();
const { 
  getStudents, 
  getStudentsByClass,
  addStudent,
  bulkAddStudents,
  updateStudent,
  deleteStudent 
} = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all students for a school
router.get('/', getStudents);

// Get students by class and division
router.get('/class', getStudentsByClass);

// Add a single student
router.post('/', addStudent);

// Bulk add students from JSON
router.post('/bulk', bulkAddStudents);

// Update a student
router.put('/:id', updateStudent);

// Delete a student
router.delete('/:id', deleteStudent);

module.exports = router;