const Student = require('../models/Student');

exports.addStudent = async (req, res) => {
    const { schoolId, email, password, uhfid, rc522id, rollNo, standard, division, name, age, gender, dateOfBirth, bloodGroup } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newStudent = new Student({
            schoolId,
            email,
            password: hashedPassword,
            uhfid,
            rc522id,
            rollNo,
            standard,
            division,
            name,
            age,
            gender,
            dateOfBirth,
            bloodGroup,
        });
        await newStudent.save();
        res.status(201).json({ message: 'Student added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding student' });
    }
};

// Add more functions for update, delete, attendance tracking, etc.