const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Models
const School = require('../models/School');
const Bus = require('../models/Bus');
const Student = require('../models/Student');
const User = require('../models/User');

// // Predefined data from .env.template
// const SCHOOLS = [
//   { 
//     email: 'school1@example.com', 
//     name: 'School One', 
//     password: 'changeme',
//     address: faker.location.streetAddress(),
//     contactNumber: faker.phone.number()
//   },
//   { 
//     email: 'school2@example.com', 
//     name: 'School Two', 
//     password: 'changeme',
//     address: faker.location.streetAddress(),
//     contactNumber: faker.phone.number()
//   },
//   { 
//     email: 'school3@example.com', 
//     name: 'School Three', 
//     password: 'changeme',
//     address: faker.location.streetAddress(),
//     contactNumber: faker.phone.number()
//   }
// ];

const STANDARDS = ['Nursery', 'Jr KG', 'Sr KG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];
const DIVISIONS = ['A', 'B', 'C', 'D', 'E'];
const GENDERS = ['Male', 'Female', 'Other'];

class DummyDataGenerator {
  static async generateSchools() {
    const schools = [];
    for (const schoolData of SCHOOLS) {
      const hashedPassword = await bcrypt.hash(schoolData.password, 10);
      const school = new School({
        email: schoolData.email,
        password: hashedPassword,
        schoolName: schoolData.name,
        address: schoolData.address,
        contactNumber: schoolData.contactNumber
      });
      await school.save();
      schools.push(school);
    }
    return schools;
  }

  static async generateBuses(schools) {
    const buses = [];
    for (let i = 1; i <= 10; i++) {
      const school = schools[Math.floor(Math.random() * schools.length)];
      const bus = new Bus({
        schoolId: school._id,
        busNumber: `BUS-${i}`,
        deviceID: `DEVICE-${faker.string.alphanumeric(6)}`,
        driverName: faker.person.fullName(),
        driverContactNumber: faker.phone.number(),
        currentLocation: {
          lat: faker.location.latitude(),
          lon: faker.location.longitude()
        }
      });
      await bus.save();
      buses.push(bus);
    }
    return buses;
  }

  static async generateStudents(schools) {
    const students = [];
    for (const standard of STANDARDS) {
      for (const division of DIVISIONS) {
        for (let i = 1; i <= 5; i++) { // 5 students per division
          const school = schools[Math.floor(Math.random() * schools.length)];
          const student = new Student({
            schoolId: school._id,
            email: faker.internet.email(),
            password: await bcrypt.hash('studentpassword', 10),
            uhfid: faker.string.alphanumeric(8),
            rc522id: faker.string.alphanumeric(8),
            rollNo: (i + (5 * (DIVISIONS.indexOf(division) + (STANDARDS.indexOf(standard) * DIVISIONS.length)))), // Roll number logic
            standard: standard,
            division: division,
            name: faker.person.fullName(),
            age: faker.number.int({ min: 5, max: 18 }),
            gender: faker.helpers.arrayElement(GENDERS),
            dateOfBirth: faker.date.past({ years: 18 }),
            bloodGroup: faker.helpers.arrayElement(['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-']),
            fathersName: faker.person.fullName('male'),
            fathersContactNumber: faker.phone.number(),
            mothersName: faker.person.fullName('female'),
            mothersContactNumber: faker.phone.number(),
            guardianName: faker.person.fullName(),
            guardianContactNumber: faker.phone.number(),
            address: faker.location.streetAddress()
          });
          await student.save();
          students.push(student);
        }
      }
    }
    return students;
  }

  static async generateJsonFiles(schools, buses, students) {
    // Prepare data for JSON files
    const schoolsJson = schools.map(school => ({
      _id: school._id.toString(),
      email: school.email,
      schoolName: school.schoolName,
      address: school.address,
      contactNumber: school.contactNumber
    }));

    const busesJson = buses.map(bus => ({
      _id: bus._id.toString(),
      schoolId: bus.schoolId.toString(),
      busNumber: bus.busNumber,
      deviceID: bus.deviceID,
      driverName: bus.driverName,
      driverContactNumber: bus.driverContactNumber
    }));

    const studentsJson = students.map(student => ({
      _id: student._id.toString(),
      schoolId: student.schoolId.toString(),
      email: student.email,
      rollNo: student.rollNo,
      standard: student.standard,
      division: student.division,
      name: student.name,
      gender: student.gender
    }));

    // Write JSON files
    // fs.writeFileSync(path.join(__dirname, '../data/schools.json'), JSON.stringify(schoolsJson, null, 2));
    fs.writeFileSync(path.join(__dirname, '../data/buses.json'), JSON.stringify(busesJson, null, 2));
    fs.writeFileSync(path.join(__dirname, '../data/students.json'), JSON.stringify(studentsJson, null, 2));
  }

  static async seedDatabase() {
    try {

      // Clear existing data
      await School.deleteMany({});
      await Bus.deleteMany({});
      await Student.deleteMany({});

      // Generate and save schools
      const schools = await this.generateSchools();

      // Generate and save buses
      const buses = await this.generateBuses(schools);

      // Generate and save students
      const students = await this.generateStudents(schools);

      // Generate JSON files
      await this.generateJsonFiles(schools, buses, students);

      console.log('Database seeded successfully!');
    } catch (error) {
      console.error('Detailed Error seeding database:', error);
      process.exit(1);
    }
  }
}

// Immediately invoke the seeding process
DummyDataGenerator.seedDatabase()
  .then(() => console.log('Seeding completed successfully'))
  .catch(error => {
    console.error('Seeding failed:', error);
    process.exit(1);
  }); 