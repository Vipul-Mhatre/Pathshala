const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Check attendance for a specific class and date
router.get('/', async (req, res) => {
  try {
    const { class: className, date } = req.query;
    const schoolId = req.user.id; // From auth middleware

    // Validate inputs
    if (!className || !date) {
      return res.status(400).json({ message: 'Class and date are required' });
    }

    // Find students in the specific class
    const students = await Student.find({ 
      schoolId, 
      standard: className 
    }).sort({ rollNo: 1 }); // Sort by roll number

    // Check if attendance is already recorded
    const existingAttendance = await Attendance.find({
      schoolId,
      date: new Date(date),
      studentId: { $in: students.map(s => s._id) }
    });

    if (existingAttendance.length > 0) {
      // Attendance already recorded, prepare detailed analytics
      const presentStudents = existingAttendance.filter(a => a.status === 'Present');
      
      const analytics = {
        totalStudents: students.length,
        presentStudents: presentStudents.length,
        absentStudents: students.length - presentStudents.length,
        presentStudentDetails: students
          .filter(s => presentStudents.some(a => a.studentId.equals(s._id)))
          .map(s => ({
            name: s.name,
            rollNo: s.rollNo
          })),
        absentStudentDetails: students
          .filter(s => !presentStudents.some(a => a.studentId.equals(s._id)))
          .map(s => ({
            name: s.name,
            rollNo: s.rollNo
          }))
      };

      return res.json({ 
        attendanceRecorded: true, 
        analytics 
      });
    }

    // No attendance recorded, return student list
    return res.json({ 
      attendanceRecorded: false,
      students: students.map(s => ({
        _id: s._id,
        name: s.name,
        rollNo: s.rollNo
      }))
    });
  } catch (error) {
    console.error('Attendance check error:', error);
    res.status(500).json({ 
      message: 'Error checking attendance', 
      error: error.message 
    });
  }
});

// Submit attendance
router.post('/', async (req, res) => {
  try {
    const { date, class: className, presentStudents } = req.body;
    const schoolId = req.user.id; // From auth middleware

    // Validate inputs
    if (!className || !date || !Array.isArray(presentStudents)) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    // Find all students in the class
    const allStudents = await Student.find({ 
      schoolId, 
      standard: className 
    });

    // Prepare attendance records
    const attendanceRecords = allStudents.map(student => ({
      schoolId,
      studentId: student._id,
      date: new Date(date),
      status: presentStudents.some(p => p.studentId === student._id.toString()) 
        ? 'Present' 
        : 'Absent'
    }));

    // Remove existing attendance for this date and class
    await Attendance.deleteMany({ 
      schoolId, 
      date: new Date(date),
      studentId: { $in: allStudents.map(s => s._id) }
    });

    // Insert new attendance records
    await Attendance.insertMany(attendanceRecords);

    res.status(201).json({ 
      message: 'Attendance recorded successfully',
      summary: {
        totalStudents: allStudents.length,
        presentStudents: presentStudents.length,
        absentStudents: allStudents.length - presentStudents.length
      }
    });
  } catch (error) {
    console.error('Attendance submission error:', error);
    res.status(500).json({ 
      message: 'Error recording attendance', 
      error: error.message 
    });
  }
});

// Get attendance history for a class
router.get('/history', async (req, res) => {
  try {
    const { class: className, startDate, endDate } = req.query;
    const schoolId = req.user.id;

    // Validate inputs
    if (!className || !startDate || !endDate) {
      return res.status(400).json({ message: 'Class, start date, and end date are required' });
    }

    // Find attendance records within date range
    const attendanceRecords = await Attendance.aggregate([
      {
        $match: {
          schoolId: mongoose.Types.ObjectId(schoolId),
          date: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          }
        }
      },
      {
        $lookup: {
          from: 'students',
          localField: 'studentId',
          foreignField: '_id',
          as: 'studentDetails'
        }
      },
      {
        $unwind: '$studentDetails'
      },
      {
        $match: {
          'studentDetails.standard': className
        }
      },
      {
        $group: {
          _id: '$date',
          totalStudents: { $sum: 1 },
          presentStudents: { 
            $sum: { $cond: [{ $eq: ['$status', 'Present'] }, 1, 0] } 
          },
          presentStudentNames: { 
            $push: { 
              $cond: [
                { $eq: ['$status', 'Present'] }, 
                '$studentDetails.name', 
                '$$REMOVE'
              ] 
            }
          }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json(attendanceRecords);
  } catch (error) {
    console.error('Attendance history error:', error);
    res.status(500).json({ 
      message: 'Error fetching attendance history', 
      error: error.message 
    });
  }
});

module.exports = router; 