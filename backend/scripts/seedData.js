const bcrypt = require('bcryptjs');
const School = require('../models/School');
const connectDB = require('../config/db');
const schoolsData = require('../data/schools.json');

const seedSchools = async () => {
  try {
    await connectDB();
    console.log('Connected to database');

    // Clear existing schools
    await School.deleteMany({});
    console.log('Cleared existing schools');

    // Add password to each school and hash it
    const schoolsWithPasswords = await Promise.all(
      schoolsData.map(async (school) => {
        const salt = await bcrypt.genSalt(10);
        // Use email password from .env or default to 'school123'
        const password = process.env[`${school.email.split('@')[0].toUpperCase()}_PASSWORD`] || 'school123';
        const hashedPassword = await bcrypt.hash(password, salt);
        
        return {
          ...school,
          password: hashedPassword
        };
      })
    );

    // Insert schools
    const insertedSchools = await School.insertMany(schoolsWithPasswords);
    console.log('Schools seeded successfully:', insertedSchools.length);
    
    // Log the emails for testing
    console.log('Available school emails:');
    insertedSchools.forEach(school => {
      console.log(`Email: ${school.email}, Password: school123`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding schools:', error);
    process.exit(1);
  }
};

seedSchools(); 