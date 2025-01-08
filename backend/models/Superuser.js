const mongoose = require('mongoose');

const superuserSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  password: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Superuser', superuserSchema);