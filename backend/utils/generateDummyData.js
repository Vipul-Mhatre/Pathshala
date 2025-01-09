const { faker } = require('@faker-js/faker');
const Student = require('../models/Student');

const generateDummyStudents = async (schoolId, count = 50) => {
  const students = [];
  const standards = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'];
  const divisions = ['A', 'B', 'C'];
  const genders = ['Male', 'Female'];

  for (let i = 0; i < count; i++) {
    const student = {
      schoolId: schoolId,
      email: faker.internet.email(),
      password: 'defaultPassword123', // You should handle this more securely
      rollNo: faker.number.int({ min: 1, max: 999 }),
      name: faker.person.fullName(),
      standard: faker.helpers.arrayElement(standards),
      division: faker.helpers.arrayElement(divisions),
      gender: faker.helpers.arrayElement(genders),
      dateOfBirth: faker.date.past({ years: 15 }),
      fathersName: faker.person.fullName(),
      fathersContactNumber: faker.phone.number(),
      mothersName: faker.person.fullName(),
      mothersContactNumber: faker.phone.number(),
      address: faker.location.streetAddress(),
      studentStatus: {
        status: 'At Home',
        deviceID: null
      },
      attendance: []
    };
    students.push(student);
  }

  try {
    await Student.insertMany(students);
    console.log(`${count} dummy students created for school ${schoolId}`);
    return students;
  } catch (error) {
    console.error('Error creating dummy students:', error);
    throw error;
  }
};

module.exports = { generateDummyStudents }; 