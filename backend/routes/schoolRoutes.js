const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { protect } = require("../middleware/authMiddleware");
const School = require("../models/School");
const Student = require("../models/Student");
const Bus = require("../models/Bus");

const router = express.Router();

// School Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt for:", email);

    // Find school and handle case sensitivity
    const school = await School.findOne({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') }
    });

    if (!school) {
      console.log("No school found with email:", email);
      return res.status(401).json({ 
        message: "Invalid credentials",
        details: "No school found with this email"
      });
    }

    const isMatch = await bcrypt.compare(password, school.password);
    console.log("Password match result:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ 
        message: "Invalid credentials",
        details: "Password does not match"
      });
    }

    const token = jwt.sign(
      { 
        id: school._id, 
        role: "school",
        email: school.email,
        name: school.name
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      token,
      school: {
        id: school._id,
        email: school.email,
        name: school.name
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      message: "Server error",
      details: error.message 
    });
  }
});

// Get School Dashboard Summary
router.get("/dashboard", protect("school"), async (req, res) => {
  try {
    const school = await School.findById(req.user.id)
      .select('-password')
      .lean();

    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }

    // Get additional dashboard data
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

// Edit School Details
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

// Protected routes for schools
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

module.exports = router;