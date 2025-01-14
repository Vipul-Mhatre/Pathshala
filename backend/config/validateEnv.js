const dotenv = require('dotenv');

dotenv.config();

const validateEnv = () => {
  if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
    throw new Error('Missing environment variables');
  }
};

module.exports = validateEnv; 