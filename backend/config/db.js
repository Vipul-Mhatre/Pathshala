const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    // console.log('Attempting to connect to MongoDB with URI:', process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Detailed MongoDB connection error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    process.exit(1);
  }
};

module.exports = connectDB;