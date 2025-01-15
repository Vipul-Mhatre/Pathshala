const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const attendanceSchema = new mongoose.Schema({
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Present', 'Absent'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create compound index for unique attendance records per student per day
attendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema); 