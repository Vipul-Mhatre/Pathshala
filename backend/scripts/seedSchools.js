const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const School = require('../models/School');
const path = require('path');
const fs = require('fs');

const envPath = path.resolve(__dirname, '../.env');

if (!fs.existsSync(envPath)) {
    console.error(`.env file not found at path: ${envPath}`);
    process.exit(1);
}

require('dotenv').config({ path: envPath });

// Debug: Print environment variables (be careful not to log sensitive data in production)
console.log('Environment variables loaded from:', envPath);
console.log('Available environment variables:', Object.keys(process.env));

const seedSchools = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error(`MONGO_URI not found in environment variables. 
                Available vars: ${Object.keys(process.env).join(', ')}`);
        }

        console.log('Attempting to connect to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Successfully connected to MongoDB');

        await School.deleteMany({});
        console.log('Cleared existing schools');

        if (!process.env.SCHOOL1_EMAIL || !process.env.SCHOOL1_PASSWORD) {
            throw new Error('School credentials not found in environment variables');
        }

        // Create schools
        const salt = await bcrypt.genSalt(10);
        const schools = [
            {
                email: process.env.SCHOOL1_EMAIL,
                password: await bcrypt.hash(process.env.SCHOOL1_PASSWORD, salt),
                name: 'School 1'
            },
            {
                email: process.env.SCHOOL2_EMAIL,
                password: await bcrypt.hash(process.env.SCHOOL2_PASSWORD, salt),
                name: 'School 2'
            },
            {
                email: process.env.SCHOOL3_EMAIL,
                password: await bcrypt.hash(process.env.SCHOOL3_PASSWORD, salt),
                name: 'School 3'
            }
        ];

        const createdSchools = await School.create(schools);
        console.log('Schools created:', createdSchools.map(s => ({ email: s.email, name: s.name })));

        await mongoose.disconnect();
        console.log('Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error.message);
        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
        }
        process.exit(1);
    }
};

seedSchools(); 