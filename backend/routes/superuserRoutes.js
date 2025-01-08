const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { protect } = require("../middleware/authMiddleware");
const Superuser = require("../models/Superuser");
const School = require("../models/School");

const router = express.Router();

// Hardcoded Superuser Authentication
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const hardcodedUsers = [
    { email: process.env.SUPERUSER_1_EMAIL, password: process.env.SUPERUSER_1_PASSWORD },
    { email: process.env.SUPERUSER_2_EMAIL, password: process.env.SUPERUSER_2_PASSWORD },
  ];

  const user = hardcodedUsers.find((user) => user.email === email && user.password === password);

  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ role: "superuser", email }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// Get All Schools
router.get("/schools", protect("superuser"), async (req, res) => {
  const schools = await School.find();
  res.json(schools);
});

// Add a School
router.post("/schools", protect("superuser"), async (req, res) => {
  const { schoolName, email, password, address, contactNumber } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const school = new School({ schoolName, email, password: hashedPassword, address, contactNumber });

  try {
    const savedSchool = await school.save();
    res.status(201).json(savedSchool);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;