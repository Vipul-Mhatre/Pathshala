const Bus = require('../models/Bus');

exports.addBus = async (req, res) => {
    const { schoolId, busNumber, deviceID, driverName, driverContactNumber } = req.body;
    try {
        const newBus = new Bus({
            schoolId,
            busNumber,
            deviceID,
            driverName,
            driverContactNumber,
        });
        await newBus.save();
        res.status(201).json({ message: 'Bus added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding bus' });
    }
};

// Add more functions for update, delete, etc.