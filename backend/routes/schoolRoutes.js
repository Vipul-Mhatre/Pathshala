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

// Check if user is superuser
const checkSuperuser = (req, res, next) => {
  if (req.user.userType !== 'superuser') {
    return res.status(403).json({ message: 'Access denied. Superuser only.' });
  }
  next();
};

// Get all schools (for superuser)
router.get('/', authMiddleware, checkSuperuser, getSchools);

// Create a new school (for superuser)
router.post(
  '/', 
  authMiddleware, 
  checkSuperuser,
  validateSchoolCreation,
  handleValidationErrors,
  createSchool
);

// Update a school
router.put('/:id', authMiddleware, checkSuperuser, updateSchool);

// Delete a school
router.delete('/:id', authMiddleware, checkSuperuser, deleteSchool);

module.exports = router;