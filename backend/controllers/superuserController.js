const School = require('../models/School');
const { generateDummyStudents } = require('../utils/generateDummyData');

exports.createSchool = async (req, res) => {
  try {
    const { schoolName, email, password, contactNumber, address } = req.body;

    const existingSchool = await School.findOne({ email });
    if (existingSchool) {
      return res.status(400).json({ message: 'School already exists' });
    }

    const school = await School.create({
      schoolName,
      email,
      password,
      contactNumber,
      address
    });

    await generateDummyStudents(school._id, 50); // Generate 50 dummy students

    res.status(201).json({
      message: 'School created successfully',
      school: {
        id: school._id,
        schoolName: school.schoolName,
        email: school.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating school', error: error.message });
  }
};

exports.getAllSchools = async (req, res) => {
  try {
    const schools = await School.find().select('-password');
    res.json(schools);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching schools', error: error.message });
  }
};

exports.updateSchool = async (req, res) => {
  try {
    const { id } = req.params;
    const { schoolName, email, contactNumber, address } = req.body;

    const school = await School.findByIdAndUpdate(
      id,
      {
        schoolName,
        email,
        contactNumber,
        address
      },
      { new: true }
    ).select('-password');

    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }

    res.json(school);
  } catch (error) {
    res.status(500).json({ message: 'Error updating school', error: error.message });
  }
};

exports.deleteSchool = async (req, res) => {
  try {
    const { id } = req.params;
    const school = await School.findByIdAndDelete(id);

    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }

    await Student.deleteMany({ school: id });

    res.json({ message: 'School deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting school', error: error.message });
  }
}; 