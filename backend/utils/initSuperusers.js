const bcrypt = require('bcryptjs');
const Superuser = require('../models/Superuser');
const School = require('../models/School');

const initSuperusers = async () => {
  try {
    // Superuser initialization
    const superuserData = [
      {
        username: process.env.SUPERUSER1_USERNAME,
        email: process.env.SUPERUSER1_EMAIL,
        password: process.env.SUPERUSER1_PASSWORD
      },
      {
        username: process.env.SUPERUSER2_USERNAME,
        email: process.env.SUPERUSER2_EMAIL,
        password: process.env.SUPERUSER2_PASSWORD
      }
    ];

    console.log('Initializing Superusers:');
    for (const userData of superuserData) {
      const existingUser = await Superuser.findOne({ email: userData.email });
      
      if (!existingUser) {
        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        const newUser = new Superuser({
          username: userData.username,
          email: userData.email,
          password: hashedPassword
        });

        await newUser.save();
        console.log(`Superuser created - Email: ${userData.email}, Username: ${userData.username}`);
      } else {
        console.log(`Superuser already exists - Email: ${userData.email}`);
      }
    }

    // Initialize a default school for testing
    console.log('Initializing Default School:');
    const existingSchool = await School.findOne({ email: process.env.SCHOOL1_EMAIL });
    if (!existingSchool) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(process.env.SCHOOL1_PASSWORD, salt);

      const newSchool = new School({
        schoolName: process.env.SCHOOL1_NAME,
        email: process.env.SCHOOL1_EMAIL,
        password: hashedPassword,
        address: '123 School St',
        contactNumber: '1234567890'
      });

      await newSchool.save();
      console.log(`School created - Name: ${process.env.SCHOOL1_NAME}, Email: ${process.env.SCHOOL1_EMAIL}`);
    } else {
      console.log(`School already exists - Email: ${process.env.SCHOOL1_EMAIL}`);
    }

    // Verify created users and schools
    console.log('\nVerifying Created Users:');
    const superusers = await Superuser.find({});
    console.log('Superusers:', superusers.map(u => ({ email: u.email, username: u.username })));

    const schools = await School.find({});
    console.log('Schools:', schools.map(s => ({ email: s.email, name: s.schoolName })));
  } catch (error) {
    console.error('Error initializing superusers and schools:', error);
    process.exit(1);
  }
};

module.exports = initSuperusers; 