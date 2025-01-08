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
  const { email, password } = req.body;
  try {
    const school = await School.findOne({ email });
    if (!school) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, school.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ role: "school", schoolId: school._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
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

module.exports = router;