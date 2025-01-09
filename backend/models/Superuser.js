const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const superuserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'superuser'
  }
}, {
  timestamps: true
});

superuserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

const Superuser = mongoose.model('Superuser', superuserSchema);

// Function to create default superusers can be used if required 
const createDefaultSuperusers = async () => {
  const superusers = [
    {
      username: process.env.SUPERUSER1_USERNAME,
      email: process.env.SUPERUSER1_EMAIL,
      password: process.env.SUPERUSER1_PASSWORD,
      role: 'superuser'
    },
    {
      username: process.env.SUPERUSER2_USERNAME,
      email: process.env.SUPERUSER2_EMAIL,
      password: process.env.SUPERUSER2_PASSWORD,
      role: 'superuser'
    }
  ];

  try {
    for (const user of superusers) {
      if (!user.username || !user.email || !user.password) {
        console.error('Missing superuser credentials in environment variables');
        continue;
      }

      const exists = await Superuser.findOne({ email: user.email });
      if (!exists) {
        await Superuser.create(user);
        console.log(`Superuser created: ${user.email}`);
      }
    }
  } catch (error) {
    console.error('Error creating superusers:', error);
  }
};

module.exports = { Superuser, createDefaultSuperusers };