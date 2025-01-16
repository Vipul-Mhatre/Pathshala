const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Superuser = require('../models/Superuser');
const School = require('../models/School');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      email: user.email, 
      userType: user.userType || 'superuser' 
    }, 
    process.env.JWT_SECRET, 
    { expiresIn: '1d' }
  );
};

//  Login
const superuserLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const superuser = await Superuser.findOne({ email });
    if (!superuser) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, superuser.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(superuser);
    res.json({
      token,
      user: {
        id: superuser._id,
        email: superuser.email,
        userType: 'superuser'
      }
    });
  } catch (error) {
    console.error('Superuser login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

const schoolLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const school = await School.findOne({ email });
    if (!school) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, school.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(school);
    res.json({
      token,
      user: {
        id: school._id,
        email: school.email,
        schoolName: school.schoolName,
        userType: 'school'
      }
    });
  } catch (error) {
    console.error('School login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

module.exports = { superuserLogin, schoolLogin };