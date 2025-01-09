const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const Student = require("../models/Student");

const router = express.Router();

// Add a Student
router.post("/", protect("school"), async (req, res) => {
  const { name, email, password, rollNo, standard, division, ...otherDetails } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newStudent = new Student({
      schoolId: req.user.schoolId,
      name,
      email,
      password: hashedPassword,
      rollNo,
      standard,
      division,
      ...otherDetails,
    });

    const savedStudent = await newStudent.save();
    res.status(201).json(savedStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get Students
router.get("/", protect("school"), async (req, res) => {
  try {
    const students = await Student.find({ schoolId: req.user.schoolId });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Attendance
router.put("/attendance/:id", protect("school"), async (req, res) => {
  const { id } = req.params;
  const { date, status } = req.body;

  try {
    const student = await Student.findById(id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    student.attendance.push({ date, status });
    await student.save();
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;