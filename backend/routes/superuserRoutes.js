const express = require("express");
const jwt = require("jsonwebtoken");
const { protect } = require("../middleware/authMiddleware");
const School = require("../models/School");

const router = express.Router();

// Superuser Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check against environment variables
    if (
      (email === process.env.SUPERUSER_EMAIL && 
       password === process.env.SUPERUSER_PASSWORD)
    ) {
      const token = jwt.sign(
        { 
          role: "superuser",
          email: email
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.json({
        success: true,
        token,
        user: {
          email,
          role: 'superuser'
        }
      });
    } else {
      res.status(401).json({ 
        message: "Invalid superuser credentials" 
      });
    }
  } catch (error) {
    console.error('Superuser login error:', error);
    res.status(500).json({ message: "Server error" });
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