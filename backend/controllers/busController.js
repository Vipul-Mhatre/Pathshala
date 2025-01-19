const Bus = require('../models/Bus');

// Get all buses for a school
exports.getBuses = async (req, res) => {
  try {
    const schoolId = req.user.id;
    const buses = await Bus.find({ schoolId })
      .sort({ busNumber: 1 });
    res.json(buses);
  } catch (error) {
    console.error('Error fetching buses:', error);
    res.status(500).json({ message: 'Error fetching buses' });
  }
};

// Add a new bus
exports.addBus = async (req, res) => {
  try {
    const schoolId = req.user.id;
    const busData = { ...req.body, schoolId };

    // Check if bus number already exists for this school
    const existingBus = await Bus.findOne({ 
      schoolId, 
      busNumber: busData.busNumber 
    });

    if (existingBus) {
      return res.status(400).json({ 
        message: 'Bus number already exists for this school' 
      });
    }

    // Check if device ID is unique
    const existingDevice = await Bus.findOne({ 
      deviceID: busData.deviceID 
    });

    if (existingDevice) {
      return res.status(400).json({ 
        message: 'Device ID already exists' 
      });
    }

    const bus = new Bus(busData);
    await bus.save();

    res.status(201).json({
      message: 'Bus added successfully',
      bus
    });
  } catch (error) {
    console.error('Error adding bus:', error);
    res.status(500).json({ message: 'Error adding bus' });
  }
};

// Update bus details
exports.updateBus = async (req, res) => {
  try {
    const { id } = req.params;
    const schoolId = req.user.id;
    const updates = req.body;

    const bus = await Bus.findOneAndUpdate(
      { _id: id, schoolId },
      updates,
      { new: true }
    );

    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    res.json({
      message: 'Bus updated successfully',
      bus
    });
  } catch (error) {
    console.error('Error updating bus:', error);
    res.status(500).json({ message: 'Error updating bus' });
  }
};

// Delete a bus
exports.deleteBus = async (req, res) => {
  try {
    const { id } = req.params;
    const schoolId = req.user.id;

    const bus = await Bus.findOneAndDelete({ _id: id, schoolId });

    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    res.json({ message: 'Bus deleted successfully' });
  } catch (error) {
    console.error('Error deleting bus:', error);
    res.status(500).json({ message: 'Error deleting bus' });
  }
};

// Update bus location
exports.updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { lat, lon } = req.body;
    const schoolId = req.user.id;

    const bus = await Bus.findOneAndUpdate(
      { _id: id, schoolId },
      { 
        'currentLocation.lat': lat,
        'currentLocation.lon': lon,
        'currentLocation.lastUpdated': Date.now()
      },
      { new: true }
    );

    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    res.json({
      message: 'Location updated successfully',
      bus
    });
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).json({ message: 'Error updating location' });
  }
};