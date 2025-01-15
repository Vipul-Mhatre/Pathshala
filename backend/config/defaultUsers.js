const defaultUsers = {
  schools: [
    {
      name: 'Demo School 1',
      email: process.env.SCHOOL1_EMAIL,
      password: process.env.SCHOOL1_PASSWORD
    },
    {
      name: 'Demo School 2',
      email: process.env.SCHOOL2_EMAIL,
      password: process.env.SCHOOL2_PASSWORD
    },
    {
      name: 'Demo School 3',
      email: process.env.SCHOOL3_EMAIL,
      password: process.env.SCHOOL3_PASSWORD
    }
  ],
  superusers: [
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
  ]
};

module.exports = defaultUsers; 