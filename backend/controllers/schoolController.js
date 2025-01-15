const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const School = require('../models/School');
const Student = require('../models/Student');
const Bus = require('../models/Bus');

// School login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('School Login Attempt:', { email, password }); // Log full credentials for debugging

    // Log all existing schools for verification
    const allSchools = await School.find({});
    console.log('All Schools:', allSchools.map(s => s.email));

    const school = await School.findOne({ email });

    if (!school) {
      console.log('School not found'); 
      return res.status(401).json({ 
        message: 'Invalid credentials',
        details: 'School not found',
        existingEmails: allSchools.map(s => s.email)
      });
    }

    const isMatch = await bcrypt.compare(password, school.password);
    if (!isMatch) {
      console.log('Password does not match'); 
      return res.status(401).json({ 
        message: 'Invalid credentials',
        details: 'Incorrect password' 
      });
    }

    const token = jwt.sign(
      { id: school._id, role: 'school' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      school: {
        id: school._id,
        schoolName: school.schoolName,
        email: school.email,
      },
      token,
    });
  } catch (error) {
    console.error('School Login Error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Get dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const schoolId = req.user._id;
    const totalStudents = await Student.countDocuments({ schoolId });
    const totalBuses = await Bus.countDocuments({ schoolId });
    const recentStudents = await Student.find({ schoolId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name standard division');

    res.json({
      totalStudents,
      totalBuses,
      recentStudents,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  login,
  getDashboardStats,
}; 