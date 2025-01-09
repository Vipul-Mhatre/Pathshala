const jwt = require("jsonwebtoken");
const School = require('../models/School');
const Superuser = require('../models/Superuser');

exports.protect = (role) => async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== role) {
      return res.status(403).json({ message: 'Not authorized for this role' });
    }

    if (role === 'school') {
      const school = await School.findById(decoded.id).select('-password');
      if (!school) {
        return res.status(401).json({ message: 'School not found' });
      }
      req.school = school;
    }

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = { protect };