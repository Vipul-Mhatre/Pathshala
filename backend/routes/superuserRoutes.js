const express = require("express");
const jwt = require("jsonwebtoken");
const { protect } = require("../middleware/authMiddleware");
const School = require("../models/School");
const bcrypt = require('bcryptjs');
const { Superuser } = require('../models/Superuser');

const router = express.Router();

// Superuser Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find superuser by email
    const superuser = await Superuser.findOne({ email });
    if (!superuser) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, superuser.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: superuser._id, role: 'superuser' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: superuser._id,
        username: superuser.username,
        email: superuser.email,
        role: 'superuser'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get dashboard data
router.get("/dashboard", protect("superuser"), async (req, res) => {
  try {
    const schoolsCount = await School.countDocuments();
    const schools = await School.find().select('name email');

    res.json({
      stats: {
        schoolsCount,
      },
      schools
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;