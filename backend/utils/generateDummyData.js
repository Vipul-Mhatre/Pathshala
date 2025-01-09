const { faker } = require('@faker-js/faker');
const Student = require('../models/Student');

const generateDummyStudents = async (schoolId, count = 50) => {
  const students = [];
  const standards = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'];
  const divisions = ['A', 'B', 'C'];
  const statuses = ['At Home', 'In School', 'On Bus'];

  for (let i = 0; i < count; i++) {
    const student = {
      name: faker.person.fullName(),
      rollNo: faker.number.int({ min: 1, max: 999 }).toString(),
      standard: faker.helpers.arrayElement(standards),
      division: faker.helpers.arrayElement(divisions),
      address: faker.location.streetAddress(),
      parentName: faker.person.fullName(),
      parentContact: faker.phone.number(),
      school: schoolId,
      status: faker.helpers.arrayElement(statuses),
      busRoute: faker.helpers.arrayElement(['Route A', 'Route B', 'Route C', null]),
      attendance: {
        present: faker.number.int({ min: 0, max: 200 }),
        absent: faker.number.int({ min: 0, max: 50 })
      }
    };
    students.push(student);
  }

  try {
    await Student.insertMany(students);
    console.log(`${count} dummy students created for school ${schoolId}`);
  } catch (error) {
    console.error('Error creating dummy students:', error);
  }
};

module.exports = { generateDummyStudents }; 