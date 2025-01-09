const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const StudentSchema = new mongoose.Schema({
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true },
  email: { type: String, required: true, unique: true },
  password: { 
    type: String, 
    required: true,
    select: false // Hide password by default in queries
  },
  uhfid: { type: String, unique: true },
  rc522id: { type: String, unique: true },
  rollNo: { type: Number, required: true },
  standard: { type: String, enum: ["Nursery", "Jr KG", "Sr KG", ...Array.from({ length: 12 }, (_, i) => `${i + 1}th`)], required: true },
  division: { type: String, enum: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"], required: true },
  name: { type: String, required: true },
  age: { type: Number },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  dateOfBirth: { type: Date },
  bloodGroup: { type: String },
  fathersName: { type: String },
  fathersContactNumber: { type: String },
  mothersName: { type: String },
  mothersContactNumber: { type: String },
  guardianName: { type: String },
  guardianContactNumber: { type: String },
  address: { type: String },
  studentStatus: {
    status: { type: String, enum: ["Boarded Bus", "Departed Bus", "In School", "At Home"], default: "At Home" },
    deviceID: { type: String, default: null },
  },
  tstampStatusUpdated: { type: Date, default: Date.now },
  attendance: [
    {
      date: { type: Date },
      status: { type: String, enum: ["Present", "Absent"], default: "Absent" },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

// Add password comparison method
StudentSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Hash password before saving
StudentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("Student", StudentSchema);