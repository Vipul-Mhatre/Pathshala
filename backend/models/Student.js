const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rollNo: { type: Number, required: true },
  standard: { type: String, enum: ["Nursery", "Jr KG", "Sr KG", ...Array.from({ length: 12 }, (_, i) => `${i + 1}th`)], required: true },
  division: { type: String, enum: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"], required: true },
  name: { type: String, required: true },
  age: { type: Number },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  dateOfBirth: { type: Date },
  studentStatus: {
    status: { type: String, enum: ["Boarded Bus", "Departed Bus", "In School", "At Home"], default: "At Home" },
    deviceID: { type: String, default: null },
  },
  attendance: [
    {
      date: { type: Date },
      status: { type: String, enum: ["Present", "Absent"], default: "Absent" },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);