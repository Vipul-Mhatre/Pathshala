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
    const { date, standard, division, presentStudents } = req.body;
    const schoolId = req.user.id;

    // Validate inputs
    if (!standard || !division || !date || !Array.isArray(presentStudents)) {
      return res.status(400).json({ 
        message: 'Invalid input data' 
      });
    }

    // Get all students in the class
    const allStudents = await Student.find({
      schoolId,
      standard,
      division
    });

    if (!allStudents.length) {
      return res.status(404).json({ 
        message: 'No students found in this class' 
      });
    }

    // Delete existing attendance records for this class and date
    await Attendance.deleteMany({
      schoolId,
      date: new Date(date),
      standard,
      division
    });

    // Create attendance records
    const attendanceRecords = allStudents.map(student => ({
      schoolId,
      studentId: student._id,
      date: new Date(date),
      standard,
      division,
      status: presentStudents.includes(student._id.toString()) ? 'Present' : 'Absent'
    }));

    // Insert new attendance records
    await Attendance.insertMany(attendanceRecords);

    res.status(201).json({
      message: 'Attendance recorded successfully',
      summary: {
        totalStudents: allStudents.length,
        presentCount: presentStudents.length,
        absentCount: allStudents.length - presentStudents.length
      }
    });

  } catch (error) {
    console.error('Error recording attendance:', error);
    res.status(500).json({ 
      message: 'Error recording attendance', 
      error: error.message 
    });
  }
});

// Get attendance history for a class
router.get('/history', async (req, res) => {
  try {
    const { standard, startDate, endDate } = req.query;
    const schoolId = req.user.id;

    if (!standard || !startDate || !endDate) {
      return res.status(400).json({ 
        message: 'Standard, start date, and end date are required' 
      });
    }

    const attendanceRecords = await Attendance.aggregate([
      {
        $match: {
          schoolId: new mongoose.Types.ObjectId(schoolId),
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
          'studentDetails.standard': standard
        }
      },
      {
        $group: {
          _id: { 
            date: '$date',
            division: '$studentDetails.division'
          },
          totalStudents: { $sum: 1 },
          presentCount: {
            $sum: { $cond: [{ $eq: ['$status', 'Present'] }, 1, 0] }
          }
        }
      },
      {
        $sort: { '_id.date': 1, '_id.division': 1 }
      }
    ]);

    res.json(attendanceRecords);
  } catch (error) {
    console.error('Error fetching attendance history:', error);
    res.status(500).json({ message: 'Error fetching attendance history' });
  }
});

// Get attendance analytics
router.get('/analytics', async (req, res) => {
  try {
    const { date, standard, division } = req.query;
    const schoolId = req.user.id;

    // Get all students in the class for this school
    const allStudents = await Student.find({ 
      schoolId,
      standard, 
      division 
    });
    
    // Get attendance records for the date and school
    const attendanceRecords = await Attendance.find({
      schoolId,
      date: new Date(date),
      standard,
      division
    });

    // Get present students (explicitly marked present)
    const presentStudents = [];
    const absentStudents = [];

    // Sort students into present and absent
    for (const student of allStudents) {
      const record = attendanceRecords.find(
        record => record.studentId.toString() === student._id.toString()
      );
      
      // Check for both "Present" and "present" due to case sensitivity
      if (record && (record.status === 'Present' || record.status === 'present')) {
        presentStudents.push(student);
      } else {
        absentStudents.push(student);
      }
    }

    const totalStudents = allStudents.length;
    const presentCount = presentStudents.length;
    const absentCount = totalStudents - presentCount;

    res.json({
      isAttendanceMarked: attendanceRecords.length > 0,
      totalStudents,
      presentCount,
      absentCount,
      attendanceRate: ((presentCount / totalStudents) * 100).toFixed(2),
      presentStudents,
      absentStudents
    });

  } catch (error) {
    console.error('Error fetching attendance analytics:', error);
    res.status(500).json({ message: 'Error fetching attendance analytics' });
  }
});

// Add this new endpoint for weekly attendance
router.get('/weekly', async (req, res) => {
  try {
    const { standard, division } = req.query;
    const schoolId = req.user.id;

    // Get dates for the last 7 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 6);

    // Get all attendance records for the date range
    const attendanceRecords = await Attendance.find({
      schoolId,
      standard,
      division,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    });

    // Get total number of students in the class
    const totalStudents = await Student.countDocuments({
      schoolId,
      standard,
      division
    });

    // Group attendance by date
    const weeklyData = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const currentDate = new Date(d);
      const dateStr = currentDate.toISOString().split('T')[0];
      
      const dayRecords = attendanceRecords.filter(record => 
        record.date.toISOString().split('T')[0] === dateStr
      );

      const presentCount = dayRecords.filter(record => 
        record.status === 'Present' || record.status === 'present'
      ).length;

      weeklyData.push({
        date: dateStr,
        present: presentCount,
        absent: totalStudents - presentCount,
        total: totalStudents
      });
    }

    res.json(weeklyData);

  } catch (error) {
    console.error('Error fetching weekly attendance:', error);
    res.status(500).json({ message: 'Error fetching weekly attendance data' });
  }
});

module.exports = router; 