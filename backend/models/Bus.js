const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  schoolId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'School',
    required: true 
  },
  busNumber: { 
    type: String, 
    required: true,
    unique: true 
  },
  deviceID: { 
    type: String, 
    required: true,
    unique: true 
  },
  driverName: { 
    type: String, 
    required: true 
  },
  driverContactNumber: { 
    type: String, 
    required: true 
  },
  currentLocation: {
    lat: { type: Number, default: null },
    lon: { type: Number, default: null },
    lastUpdated: { type: Date, default: Date.now }
  },
  status: {
    type: String,
    enum: ['Active', 'In Transit', 'Maintenance', 'Inactive'],
    default: 'Active'
  },
  route: {
    name: String,
    stops: [{
      name: String,
      lat: Number,
      lon: Number,
      scheduledTime: String
    }]
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Add compound index for unique bus number within a school
busSchema.index({ schoolId: 1, busNumber: 1 }, { unique: true });

module.exports = mongoose.model('Bus', busSchema);