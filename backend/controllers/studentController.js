const createStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      rollNo,
      standard,
      division,
      gender,
      dateOfBirth,
      fathersName,
      fathersContactNumber,
      mothersName,
      mothersContactNumber,
      address
    } = req.body;

    // Add schoolId from the authenticated school
    const student = new Student({
      schoolId: req.school._id,
      name,
      email,
      password: 'defaultPassword123', // You should generate a random password or handle this differently
      rollNo,
      standard,
      division,
      gender,
      dateOfBirth,
      fathersName,
      fathersContactNumber,
      mothersName,
      mothersContactNumber,
      address,
      studentStatus: {
        status: 'At Home',
        deviceID: null
      }
    });

    await student.save();
    res.status(201).json(student);
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(400).json({ message: error.message });
  }
}; 