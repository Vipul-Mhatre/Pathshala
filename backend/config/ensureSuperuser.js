const bcrypt = require('bcryptjs');
const Superuser = require('../models/Superuser');

const ensureSuperuser = async () => {
  try {
    const superuserEmail = process.env.SUPERUSER_EMAIL;
    const superuserPassword = process.env.SUPERUSER_PASSWORD;

    const existingSuperuser = await Superuser.findOne({ email: superuserEmail });
    if (!existingSuperuser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(superuserPassword, salt);

      const superuser = new Superuser({
        email: superuserEmail,
        password: hashedPassword
      });

      await superuser.save();
      console.log('Superuser created successfully');
    }
  } catch (error) {
    console.error('Error ensuring superuser exists:', error);
  }
};

module.exports = ensureSuperuser; 