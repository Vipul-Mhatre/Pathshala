const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Student Login
exports.studentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find student
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { 
        id: student._id, 
        email: student.email,
        userType: 'student'
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ 
      token, 
      user: { 
        id: student._id, 
        email: student.email,
        name: student.name,
        userType: 'student'
      } 
    });
  } catch (error) {
    console.error('Student login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Get all students for a school
exports.getStudents = async (req, res) => {
  try {
    const schoolId = req.user.id;
    const students = await Student.find({ schoolId })
      .sort({ standard: 1, division: 1, rollNo: 1 });
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Error fetching students' });
  }
};

// Get all students (admin or system-wide access)
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().select(
      '_id name rollNo standard division email schoolId'
    );
    res.json(students);
  } catch (error) {
    console.error('Error fetching all students:', error);
    res.status(500).json({ 
      message: 'Error fetching students', 
      error: error.message 
    });
  }
};

// Add a new student
exports.addStudent = async (req, res) => {
  try {
    const schoolId = req.user.id;
    const studentData = { ...req.body, schoolId };

    // Check if email already exists
    const existingStudent = await Student.findOne({ email: studentData.email });
    if (existingStudent) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Check if roll number is unique in class and division
    const existingRollNo = await Student.findOne({
      schoolId,
      standard: studentData.standard,
      division: studentData.division,
      rollNo: studentData.rollNo
    });

    if (existingRollNo) {
      return res.status(400).json({ 
        message: 'Roll number already exists in this class and division' 
      });
    }

    const student = new Student(studentData);
    await student.save();

    res.status(201).json({
      message: 'Student added successfully',
      student
    });
  } catch (error) {
    console.error('Error adding student:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Invalid student data', 
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ message: 'Error adding student' });
  }
};

// Update a student's information
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const schoolId = req.user.id;

    const student = await Student.findOneAndUpdate(
      { _id: id, schoolId },
      req.body,
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({
      message: 'Student updated successfully',
      student
    });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ message: 'Error updating student' });
  }
};

// Delete a student
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const schoolId = req.user.id;

    const student = await Student.findOneAndDelete({ _id: id, schoolId });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ message: 'Error deleting student' });
  }
};

// Track attendance for a student
exports.trackAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, status } = req.body; // Example: { date: '2025-01-15', status: 'Present' }

    // Find the student by ID
    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Add attendance record
    const attendanceRecord = {
      date,
      status
    };

    student.attendance.push(attendanceRecord); // Assuming 'attendance' is an array in the Student model

    await student.save();

    res.status(200).json({
      message: 'Attendance tracked successfully',
      attendanceRecord
    });
  } catch (error) {
    console.error('Error tracking attendance:', error);
    res.status(500).json({ 
      message: 'Error tracking attendance', 
      error: error.message 
    });
  }
};

// Get students by class and division
exports.getStudentsByClass = async (req, res) => {
  try {
    const { standard, division } = req.query;
    const schoolId = req.user.id;

    const students = await Student.find({
      schoolId,
      standard,
      division
    }).sort({ rollNo: 1 });

    res.json(students);
  } catch (error) {
    console.error('Error fetching students by class:', error);
    res.status(500).json({ message: 'Error fetching students' });
  }
};

// Bulk add students from JSON
exports.bulkAddStudents = async (req, res) => {
  try {
    const schoolId = req.user.id;
    const { students } = req.body;

    if (!Array.isArray(students)) {
      return res.status(400).json({ message: 'Invalid data format' });
    }

    // Validate each student's data
    const studentsWithSchoolId = students.map(student => ({
      ...student,
      schoolId
    }));

    // Check for duplicate emails
    const emails = studentsWithSchoolId.map(s => s.email);
    const existingEmails = await Student.find({ email: { $in: emails } })
      .select('email');

    if (existingEmails.length > 0) {
      return res.status(400).json({
        message: 'Some emails already exist',
        duplicateEmails: existingEmails.map(s => s.email)
      });
    }

    // Check for duplicate roll numbers in each class and division
    for (const student of studentsWithSchoolId) {
      const existingRollNo = await Student.findOne({
        schoolId,
        standard: student.standard,
        division: student.division,
        rollNo: student.rollNo
      });

      if (existingRollNo) {
        return res.status(400).json({
          message: `Roll number ${student.rollNo} already exists in ${student.standard} ${student.division}`
        });
      }
    }

    const insertedStudents = await Student.insertMany(studentsWithSchoolId);

    res.status(201).json({
      message: 'Students imported successfully',
      count: insertedStudents.length,
      students: insertedStudents
    });
  } catch (error) {
    console.error('Error importing students:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Invalid student data', 
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ message: 'Error importing students' });
  }
};