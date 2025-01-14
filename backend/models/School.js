const mongoose = require("mongoose");

const schoolSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  schoolName: { type: String, required: true },
  address: { type: String },
  contactNumber: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("School", schoolSchema);