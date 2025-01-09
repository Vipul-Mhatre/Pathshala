const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { protect } = require("../middleware/authMiddleware");
const School = require("../models/School");
const Student = require("../models/Student");
const Bus = require("../models/Bus");
const auth = require('../middleware/auth');

const router = express.Router();

// School Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const school = await School.findOne({ email });
    if (!school) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await school.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: school._id, role: 'school' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, school: { id: school._id, name: school.name } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get School Dashboard Summary
router.get("/dashboard", protect("school"), async (req, res) => {
  try {
    const schoolId = req.user.schoolId;
    const studentCount = await Student.countDocuments({ schoolId });
    const busCount = await Bus.countDocuments({ schoolId });
    res.json({ studentCount, busCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
router.get('/profile', auth, async (req, res) => {
  try {
    const school = await School.findById(req.user.id).select('-password');
    res.json(school);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;