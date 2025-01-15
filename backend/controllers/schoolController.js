const School = require('../models/School');
const bcrypt = require('bcryptjs');

// Get all schools
exports.getSchools = async (req, res) => {
  try {
    // Fetch all schools, excluding sensitive information
    const schools = await School.find().select(
      '_id schoolName email address contactNumber'
    );
    res.json(schools);
  } catch (error) {
    console.error('Error fetching schools:', error);
    res.status(500).json({ 
      message: 'Error fetching schools', 
      error: error.message 
    });
  }
};

// Update a school's information
exports.updateSchool = async (req, res) => {
  try {
    const { id } = req.params;
    const { schoolName, email, address, contactNumber, password } = req.body;

    // Prepare update object
    const updateData = { schoolName, email, address, contactNumber };

    // If password is provided, hash it
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    // Find and update the school
    const updatedSchool = await School.findByIdAndUpdate(
      id, 
      updateData,
      { new: true, select: '_id schoolName email address contactNumber' }
    );

    if (!updatedSchool) {
      return res.status(404).json({ message: 'School not found' });
    }

    res.status(200).json({
      message: 'School updated successfully',
      school: updatedSchool
    });
  } catch (error) {
    console.error('Error updating school:', error);
    res.status(500).json({ 
      message: 'Error updating school', 
      error: error.message 
    });
  }
};

// Delete a school
exports.deleteSchool = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the school
    const school = await School.findByIdAndDelete(id);
    
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }

    res.status(200).json({
      message: 'School deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting school:', error);
    res.status(500).json({ 
      message: 'Error deleting school', 
      error: error.message 
    });
  }
};

// Create a new school
exports.createSchool = async (req, res) => {
  try {
    const { email, password, schoolName, address, contactNumber } = req.body;

    if (!email || !password || !schoolName || !address || !contactNumber) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if school already exists
    const existingSchool = await School.findOne({ email });
    if (existingSchool) {
      return res.status(400).json({ message: 'School with this email already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new school
    const newSchool = new School({
      email,
      password: hashedPassword,
      schoolName,
      address,
      contactNumber
    });

    await newSchool.save();

    res.status(201).json({
      message: 'School created successfully',
      school: {
        _id: newSchool._id,
        schoolName: newSchool.schoolName,
        email: newSchool.email,
        address: newSchool.address,
        contactNumber: newSchool.contactNumber
      }
    });
  } catch (error) {
    console.error('Error creating school:', error);
    res.status(500).json({ message: 'Error creating school', error: error.message });
  }
};