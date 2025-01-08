const express = require('express');
const { createSchool } = require('../controllers/schoolController');
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post(
    '/',
    authMiddleware,
    [
        body('email').isEmail().withMessage('Must be a valid email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('schoolName').notEmpty().withMessage('School name is required'),
        body('address').notEmpty().withMessage('Address is required'),
        body('contactNumber').notEmpty().withMessage('Contact number is required'),
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    createSchool
);

module.exports = router;