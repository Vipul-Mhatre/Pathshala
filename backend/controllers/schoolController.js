const School = require('../models/School');
const bcrypt = require('bcryptjs');

exports.createSchool = async (req, res) => {
    const { email, password, schoolName, address, contactNumber } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newSchool = new School({
            email,
            password: hashedPassword,
            schoolName,
            address,
            contactNumber,
        });
        await newSchool.save();
        res.status(201).json({ message: 'School created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating school' });
    }
};

// Add more functions for login, update, delete, etc.