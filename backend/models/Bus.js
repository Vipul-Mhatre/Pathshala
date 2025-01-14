const mongoose = require("mongoose");

const busSchema = new mongoose.Schema({
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true },
  busNumber: { type: String, unique: true, required: true },
  driverName: { type: String, required: true },
  driverContactNumber: { type: String, required: true },
  currentLocation: {
    lat: { type: Number },
    lon: { type: Number },
  },
}, { timestamps: true });

module.exports = mongoose.model("Bus", busSchema);