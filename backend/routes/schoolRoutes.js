const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { protect } = require("../middleware/authMiddleware");
const School = require("../models/School");
const Student = require("../models/Student");
const Bus = require("../models/Bus");

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find school case-insensitive
    const school = await School.findOne({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') }
    });

    if (!school) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await school.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: school._id, role: 'school' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      school: {
        id: school._id,
        name: school.name,
        email: school.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get("/dashboard", protect("school"), async (req, res) => {
  try {
    const school = await School.findById(req.user.id)
      .select('-password')
      .lean();

    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }

    const studentsCount = await Student.countDocuments({ school: school._id });
    const busesCount = await Bus.countDocuments({ school: school._id });

    res.json({
      ...school,
      stats: {
        studentsCount,
        busesCount
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put("/edit", protect("school"), async (req, res) => {
  const schoolId = req.user.schoolId;
  const { schoolName, address, contactNumber } = req.body;
  try {
    const updatedSchool = await School.findByIdAndUpdate(
      schoolId,
      { schoolName, address, contactNumber },
      { new: true }
    );
    res.json(updatedSchool);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/profile', protect("school"), async (req, res) => {
  try {
    const school = await School.findById(req.user.id)
      .select('-password');
    
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }
    
    res.json(school);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post("/logout", protect("school"), async (req, res) => {
  try {
    res.json({ message: "Successfully logged out" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ 
      message: "Server error during logout",
      details: error.message 
    });
  }
});

// Get all schools
router.get("/", protect("superuser"), async (req, res) => {
  try {
    const schools = await School.find();
    res.json(schools);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add more routes for creating, updating, and deleting schools

module.exports = router;