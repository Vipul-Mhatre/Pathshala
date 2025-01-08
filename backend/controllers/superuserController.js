const Superuser = require('../models/Superuser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const superuser = await Superuser.findOne({ email });
        if (!superuser) return res.status(404).json({ message: 'Superuser not found' });

        const isMatch = await bcrypt.compare(password, superuser.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: superuser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};