const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Superuser = require('../models/Superuser');
const School = require('../models/School');
const Student = require('../models/Student');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      email: user.email, 
      userType: user.userType || 'school' 
    }, 
    process.env.JWT_SECRET, 
    { expiresIn: '1d' }
  );
};

// Superuser Login
const superuserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find superuser
    const superuser = await Superuser.findOne({ email });
    if (!superuser) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, superuser.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken({
      _id: superuser._id, 
      email: superuser.email, 
      userType: 'superuser'
    });

    res.json({ 
      token, 
      user: { 
        id: superuser._id, 
        email: superuser.email 
      } 
    });
  } catch (error) {
    console.error('Superuser login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// School Login
const schoolLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find school
    const school = await School.findOne({ email });
    if (!school) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, school.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken({
      _id: school._id, 
      email: school.email, 
      userType: 'school'
    });

    res.json({ 
      token, 
      user: { 
        id: school._id, 
        email: school.email,
        schoolName: school.schoolName 
      } 
    });
  } catch (error) {
    console.error('School login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Student Login
const studentLogin = async (req, res) => {
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
    const token = generateToken({
      _id: student._id, 
      email: student.email, 
      userType: 'student'
    });

    res.json({ 
      token, 
      user: { 
        id: student._id, 
        email: student.email,
        name: student.name 
      } 
    });
  } catch (error) {
    console.error('Student login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

module.exports = { superuserLogin, schoolLogin, studentLogin };