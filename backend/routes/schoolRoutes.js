const express = require('express');
const router = express.Router();
const { 
  createSchool, 
  getSchools, 
  updateSchool, 
  deleteSchool 
} = require('../controllers/schoolController');
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');

// Validation middleware
const validateSchoolCreation = [
  body('email').isEmail().withMessage('Must be a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('schoolName').notEmpty().withMessage('School name is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('contactNumber').notEmpty().withMessage('Contact number is required'),
];

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Get all schools (for superuser)
router.get('/', authMiddleware, getSchools);

// Create a new school (for superuser)
router.post(
  '/', 
  authMiddleware, 
  validateSchoolCreation,
  handleValidationErrors,
  createSchool
);

// Update a school
router.put('/:id', authMiddleware, updateSchool);

// Delete a school
router.delete('/:id', authMiddleware, deleteSchool);

module.exports = router;