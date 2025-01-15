const bcrypt = require('bcryptjs');
const Student = require('../models/Student');

// Create new student
const createStudent = async (req, res) => {
  try {
    const schoolId = req.user._id;
    const {
      email,
      password,
      rollNo,
      standard,
      division,
      name,
      age,
      gender,
      dateOfBirth,
      uhfid,
      rc522id
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const student = new Student({
      schoolId,
      email,
      password: hashedPassword,
      rollNo,
      standard,
      division,
      name,
      age,
      gender,
      dateOfBirth: new Date(dateOfBirth),
      uhfid,
      rc522id,
      studentStatus: { status: 'At Home' }
    });

    await student.save();
    res.status(201).json({
      message: 'Student created successfully',
      student: {
        id: student._id,
        name: student.name,
        email: student.email
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        message: `${field} already exists`
      });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Get student details
const getStudentDetails = async (req, res) => {
  try {
    const { studentId } = req.params;
    const schoolId = req.user._id;

    const student = await Student.findOne({ _id: studentId, schoolId })
      .select('-password');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update student
const updateStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const schoolId = req.user._id;
    const {
      rollNo,
      standard,
      division,
      name,
      age,
      gender,
      dateOfBirth
    } = req.body;

    const student = await Student.findOneAndUpdate(
      { _id: studentId, schoolId },
      {
        rollNo,
        standard,
        division,
        name,
        age,
        gender,
        dateOfBirth: new Date(dateOfBirth)
      },
      { new: true }
    ).select('-password');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({
      message: 'Student updated successfully',
      student
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        message: `${field} already exists`
      });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Update student status
const updateStudentStatus = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { status, deviceID } = req.body;
    const schoolId = req.user._id;

    const student = await Student.findOneAndUpdate(
      { _id: studentId, schoolId },
      {
        'studentStatus.status': status,
        'studentStatus.deviceID': deviceID
      },
      { new: true }
    ).select('-password');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({
      message: 'Student status updated successfully',
      student
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Reset student password
const resetPassword = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { newPassword } = req.body;
    const schoolId = req.user._id;

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const student = await Student.findOneAndUpdate(
      { _id: studentId, schoolId },
      { password: hashedPassword },
      { new: true }
    ).select('-password');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Student password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete student
const deleteStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const schoolId = req.user._id;

    const student = await Student.findOneAndDelete({ _id: studentId, schoolId });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createStudent,
  getStudentDetails,
  updateStudent,
  updateStudentStatus,
  resetPassword,
  deleteStudent
}; 