const express = require('express');
const School = require('../models/School');
const { verifySuperuser } = require('../middleware/authMiddleware');

const router = express.Router();

// Middleware to check superuser role
router.use(verifySuperuser);

// Create a school
router.post('/schools', async (req, res) => {
  const { email, password, schoolName, address, contactNumber } = req.body;

  try {
    const newSchool = new School({ email, password, schoolName, address, contactNumber });
    await newSchool.save();
    res.status(201).json(newSchool);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create school', error });
  }
});

module.exports = router;