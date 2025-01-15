const Superuser = require('../models/Superuser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find superuser by email
        const superuser = await Superuser.findOne({ email });
        if (!superuser) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, superuser.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: superuser._id, role: 'superuser' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Send response
        res.json({
            token,
            user: {
                id: superuser._id,
                email: superuser.email,
                role: 'superuser'
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};