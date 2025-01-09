const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
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

module.exports = mongoose.model("Student", StudentSchema);