const mongoose = require("mongoose");

const BusSchema = new mongoose.Schema({
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true },
  busNumber: { type: String, unique: true, required: true },
  deviceID: { type: String, unique: true, required: true },
  driverName: { type: String, required: true },
  driverContactNumber: { type: String, required: true },
  currentLocation: {
    lat: { type: Number },
    lon: { type: Number },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Bus", BusSchema);