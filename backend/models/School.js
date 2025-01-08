const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  schoolName: String,
  address: String,
  contactNumber: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('School', schoolSchema);