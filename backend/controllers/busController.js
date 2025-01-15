const Bus = require('../models/Bus');

// Add a new bus
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
        res.status(500).json({ message: 'Error adding bus', error });
    }
};

// Get all buses
exports.getAllBuses = async (req, res) => {
    try {
        const buses = await Bus.find();
        res.status(200).json(buses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching buses', error });
    }
};

// Get a bus by ID
exports.getBusById = async (req, res) => {
    const { id } = req.params;
    try {
        const bus = await Bus.findById(id);
        if (!bus) {
            return res.status(404).json({ message: 'Bus not found' });
        }
        res.status(200).json(bus);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bus', error });
    }
};

// Update a bus by ID
exports.updateBus = async (req, res) => {
    const { id } = req.params;
    const { schoolId, busNumber, deviceID, driverName, driverContactNumber } = req.body;
    try {
        const updatedBus = await Bus.findByIdAndUpdate(id, {
            schoolId,
            busNumber,
            deviceID,
            driverName,
            driverContactNumber,
        }, { new: true });

        if (!updatedBus) {
            return res.status(404).json({ message: 'Bus not found' });
        }

        res.status(200).json({ message: 'Bus updated successfully', updatedBus });
    } catch (error) {
        res.status(500).json({ message: 'Error updating bus', error });
    }
};

// Delete a bus by ID
exports.deleteBus = async (req, res) => {
    const { id } = req.params;
    try {
        const bus = await Bus.findByIdAndDelete(id);
        if (!bus) {
            return res.status(404).json({ message: 'Bus not found' });
        }
        res.status(200).json({ message: 'Bus deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting bus', error });
    }
};