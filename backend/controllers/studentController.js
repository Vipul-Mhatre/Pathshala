const Student = require('../models/Student');
const authMiddleware = require('../middleware/authMiddleware');

// Get all students for a school
exports.getStudents = async (req, res) => {
  try {
    // Get the school ID from the authenticated user
    const schoolId = req.user.id;

    // Find all students for this school
    const students = await Student.find({ schoolId }).select(
      '_id name rollNo standard division email'
    );

    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ 
      message: 'Error fetching students', 
      error: error.message 
    });
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
    const { 
      email, 
      password, 
      name, 
      rollNo, 
      standard, 
      division 
    } = req.body;

    // Get the school ID from the authenticated user
    const schoolId = req.user.id;

    // Create new student
    const newStudent = new Student({
      schoolId,
      email,
      password,
      name,
      rollNo,
      standard,
      division
    });

    await newStudent.save();

    res.status(201).json({
      message: 'Student added successfully',
      student: {
        _id: newStudent._id,
        name: newStudent.name,
        rollNo: newStudent.rollNo,
        standard: newStudent.standard
      }
    });
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).json({ 
      message: 'Error adding student', 
      error: error.message 
    });
  }
};

// Update a student's information
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, name, rollNo, standard, division } = req.body;

    // Find and update the student
    const updatedStudent = await Student.findByIdAndUpdate(
      id, 
      { email, name, rollNo, standard, division },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({
      message: 'Student updated successfully',
      student: updatedStudent
    });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ 
      message: 'Error updating student', 
      error: error.message 
    });
  }
};

// Delete a student by ID
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the student
    const student = await Student.findByIdAndDelete(id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({
      message: 'Student deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ 
      message: 'Error deleting student', 
      error: error.message 
    });
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