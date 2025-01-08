const Superuser = require('../models/Superuser');
const School = require('../models/School');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const loginSuperuser = async (req, res) => {
  const { email, password } = req.body;
  const superuser = await Superuser.findOne({ email });
  if (!superuser || !(await bcrypt.compare(password, superuser.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: superuser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
};

const loginSchool = async (req, res) => {
  const { email, password } = req.body;
  const school = await School.findOne({ email });
  if (!school || !(await bcrypt.compare(password, school.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: school._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
};

module.exports = { loginSuperuser, loginSchool };