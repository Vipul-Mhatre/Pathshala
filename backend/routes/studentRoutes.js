const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const Student = require("../models/Student");

const router = express.Router();

// Get all students for a school
router.get("/", protect("school"), async (req, res) => {
  try {
    const filters = {};
    const { standard, division, search } = req.query;

    filters.schoolId = req.school._id;

    if (standard) filters.standard = standard;
    if (division) filters.division = division;
    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: "i" } },
        { rollNo: search }
      ];
    }

    const students = await Student.find(filters)
      .sort({ standard: 1, division: 1, rollNo: 1 });

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new student
router.post("/", protect("school"), async (req, res) => {
  try {
    const student = new Student({
      ...req.body,
      schoolId: req.school._id
    });

    const savedStudent = await student.save();
    res.status(201).json(savedStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update student attendance
router.patch("/:id/attendance", protect("school"), async (req, res) => {
  try {
    const { date, status } = req.body;
    const student = await Student.findOne({
      _id: req.params.id,
      schoolId: req.school._id
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const attendanceDate = new Date(date);
    const existingAttendance = student.attendance.find(
      a => a.date.toDateString() === attendanceDate.toDateString()
    );

    if (existingAttendance) {
      existingAttendance.status = status;
    } else {
      student.attendance.push({ date: attendanceDate, status });
    }

    await student.save();
    res.json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update student status
router.patch("/:id/status", protect("school"), async (req, res) => {
  try {
    const { status, deviceID } = req.body;
    const student = await Student.findOneAndUpdate(
      { _id: req.params.id, schoolId: req.school._id },
      { 
        "studentStatus.status": status,
        "studentStatus.deviceID": deviceID,
        tstampStatusUpdated: new Date()
      },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get attendance report
router.get("/attendance-report", protect("school"), async (req, res) => {
  try {
    const { startDate, endDate, standard, division } = req.query;
    const filters = { schoolId: req.school._id };

    if (standard) filters.standard = standard;
    if (division) filters.division = division;

    const students = await Student.find(filters);
    const report = students.map(student => {
      const attendanceInRange = student.attendance.filter(a => {
        const date = new Date(a.date);
        return date >= new Date(startDate) && date <= new Date(endDate);
      });

      const presentDays = attendanceInRange.filter(a => a.status === "Present").length;
      const totalDays = attendanceInRange.length;

      return {
        name: student.name,
        rollNo: student.rollNo,
        standard: student.standard,
        division: student.division,
        presentDays,
        totalDays,
        percentage: totalDays ? (presentDays / totalDays) * 100 : 0
      };
    });

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;