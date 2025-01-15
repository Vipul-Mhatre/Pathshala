const jwt = require('jsonwebtoken');
const Superuser = require('../models/Superuser');
const School = require('../models/School');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.id || !decoded.role) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    let user;
    if (decoded.role === 'superuser') {
      user = await Superuser.findById(decoded.id);
    } else if (decoded.role === 'school') {
      user = await School.findById(decoded.id);
    }

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid authentication token' });
  }
};

const isSuperuser = (req, res, next) => {
  if (req.userRole !== 'superuser') {
    return res.status(403).json({ message: 'Access denied. Superuser only.' });
  }
  next();
};

const isSchool = (req, res, next) => {
  if (req.userRole !== 'school') {
    return res.status(403).json({ message: 'Access denied. School only.' });
  }
  next();
};

module.exports = { auth, isSuperuser, isSchool }; 