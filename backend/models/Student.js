const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School' },
    email: { type: String, unique: true },
    password: String, // Encrypted
    uhfid: String, // Unique
    rc522id: String, // Unique
    rollNo: Number,
    standard: { type: String, enum: ['Nursery', 'Jr KG', 'Sr KG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'] },
    division: { type: String, enum: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'] },
    name: String,
    age: Number,
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    dateOfBirth: Date,
    bloodGroup: String,
    fathersName: String,
    fathersContactNumber: String,
    mothersName: String,
    mothersContactNumber: String,
    guardianName: String,
    guardianContactNumber: String,
    address: String,
    studentStatus: {
        status: { type: String, enum: ['Boarded Bus', 'Departed Bus', 'In School', 'At Home'], default: 'At Home' },
        deviceID: { type: String, default: null }
    },
    tstampStatusUpdated: { type: Date, default: Date.now },
    attendance: [
        {
            date: Date, // Attendance date
            status: { type: String, enum: ['Present', 'Absent'], default: 'Absent' }
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', studentSchema);