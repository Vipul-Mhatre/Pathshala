const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  schoolId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'School',
    required: true 
  },
  email: { 
    type: String, 
    required: true,
    unique: true 
  },
  rollNo: { 
    type: Number, 
    required: true 
  },
  standard: { 
    type: String, 
    required: true,
    enum: ['Nursery', 'Jr KG', 'Sr KG', '1st', '2nd', '3rd', '4th', '5th', 
           '6th', '7th', '8th', '9th', '10th', '11th', '12th'] 
  },
  division: { 
    type: String, 
    required: true,
    enum: ['A', 'B', 'C', 'D', 'E'] 
  },
  name: { 
    type: String, 
    required: true 
  },
  gender: { 
    type: String, 
    required: true,
    enum: ['Male', 'Female', 'Other'] 
  },
  dateOfBirth: Date,
  bloodGroup: String,
  contactNumber: String,
  address: String,
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Add compound index for unique roll number within a class and division
studentSchema.index(
  { schoolId: 1, standard: 1, division: 1, rollNo: 1 }, 
  { unique: true }
);

module.exports = mongoose.model('Student', studentSchema);