const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Superuser = require('../models/Superuser');
const School = require('../models/School');

// Superuser login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Superuser Login Attempt:', { email, password }); // Log full credentials for debugging

    // Log all existing superusers for verification
    const allSuperusers = await Superuser.find({});
    console.log('All Superusers:', allSuperusers.map(u => u.email));

    const user = await Superuser.findOne({ email });

    if (!user) {
      console.log('Superuser not found'); 
      return res.status(401).json({ 
        message: 'Invalid credentials',
        details: 'User not found',
        existingEmails: allSuperusers.map(u => u.email)
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password does not match'); 
      return res.status(401).json({ 
        message: 'Invalid credentials',
        details: 'Incorrect password' 
      });
    }

    const token = jwt.sign(
      { id: user._id, role: 'superuser' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error('Superuser Login Error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Get dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const totalSchools = await School.countDocuments();
    const recentSchools = await School.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('schoolName email contactNumber status');

    res.json({
      totalSchools,
      recentSchools,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  login,
  getDashboardStats,
}; 