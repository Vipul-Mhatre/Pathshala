const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Superuser = require('../models/Superuser');
const School = require('../models/School');

// Generate JWT token
const generatetoken1 = (user) => {
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

const generatetoken2 = (user) => {
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

    const token = generatetoken1(superuser);
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
  console.log("password from backend",password);
  try {
    const school = await School.findOne({ email });
    console.log("school from backend",school);
    if (!school) {
      console.log('School not found');
      return res.status(401).json({ message: 'Invalid credentials' });
      
    }

    // Debugging: Log the stored hashed password
    console.log('Stored hashed password:', school.password);

    const isMatch = await bcrypt.compare(password, school.password);
    if (!isMatch) {
      console.log('Password does not match');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generatetoken2(school);
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