const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Bus = require('../models/Bus');

// Get all buses for a school
router.get('/', protect('school'), async (req, res) => {
  try {
    const buses = await Bus.find({ schoolId: req.school._id });
    res.json(buses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new bus
router.post('/', protect('school'), async (req, res) => {
  try {
    const bus = new Bus({
      ...req.body,
      schoolId: req.school._id
    });

    const savedBus = await bus.save();
    res.status(201).json(savedBus);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update bus location
router.patch('/:id/location', protect('school'), async (req, res) => {
  try {
    const { lat, lon } = req.body;
    const bus = await Bus.findOneAndUpdate(
      { _id: req.params.id, schoolId: req.school._id },
      { currentLocation: { lat, lon } },
      { new: true }
    );

    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    res.json(bus);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;