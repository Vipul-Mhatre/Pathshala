const mongoose = require("mongoose");

const SchoolSchema = new mongoose.Schema({
  schoolName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  address: { type: String, required: true },
  contactNumber: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("School", SchoolSchema);