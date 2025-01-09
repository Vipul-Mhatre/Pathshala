const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const Bus = require("../models/Bus");

const router = express.Router();

// Add a Bus
router.post("/", protect("school"), async (req, res) => {
  const { busNumber, deviceID, driverName, driverContactNumber, currentLocation } = req.body;

  try {
    const newBus = new Bus({
      schoolId: req.user.schoolId,
      busNumber,
      deviceID,
      driverName,
      driverContactNumber,
      currentLocation,
    });

    const savedBus = await newBus.save();
    res.status(201).json(savedBus);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get Buses
router.get("/", protect("school"), async (req, res) => {
  try {
    const buses = await Bus.find({ schoolId: req.user.schoolId });
    res.json(buses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Bus Location
router.put("/location/:id", protect("school"), async (req, res) => {
  const { id } = req.params;
  const { lat, lon } = req.body;

  try {
    const updatedBus = await Bus.findByIdAndUpdate(
      id,
      { currentLocation: { lat, lon } },
      { new: true }
    );
    res.json(updatedBus);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;