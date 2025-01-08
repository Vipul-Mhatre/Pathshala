const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School' },
    busNumber: { type: String, unique: true },
    deviceID: { type: String, unique: true },
    driverName: String,
    driverContactNumber: String,
    currentLocation: {
        lat: Number,
        lon: Number
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bus', busSchema);