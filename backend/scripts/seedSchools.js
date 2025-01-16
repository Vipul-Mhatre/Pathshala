const bcrypt = require('bcryptjs');
const School = require('../models/School');
const connectDB = require('../config/db');
const schoolsData = require('../data/schools.json');
require('dotenv').config();

const seedSchools = async () => {
  try {
    await connectDB();
    console.log('Connected to database');

    // Clear existing schools
    await School.deleteMany({});
    console.log('Cleared existing schools');

    // Default password for all schools
    const defaultPassword = 'school123';

    // Add password to each school and hash it
    const schoolsWithPasswords = await Promise.all(
      schoolsData.map(async (school) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(defaultPassword, salt);
        
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
    console.log('Available school credentials:');
    schoolsData.forEach(school => {
      console.log(`Email: ${school.email}`);
      console.log(`Password: ${defaultPassword}`);
      console.log('---');
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding schools:', error);
    process.exit(1);
  }
};

seedSchools(); 