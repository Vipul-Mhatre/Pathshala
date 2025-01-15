const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Import utilities and config
const connectDB = require('./config/db');
const validateEnv = require('./config/validateEnv');
const errorHandler = require('./utils/errorHandler');
const initSuperusers = require('./utils/initSuperusers');

// Import routes
const superuserRoutes = require('./routes/superuserRoutes');
const schoolRoutes = require('./routes/schoolRoutes');
const studentRoutes = require('./routes/studentRoutes');
const busRoutes = require('./routes/busRoutes');

// Validate environment variables
validateEnv();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/superuser', superuserRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/buses', busRoutes);

// Error handling middleware
app.use(errorHandler);

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Initialize superusers
    await initSuperusers();
    
    // Start listening
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Listening on all network interfaces`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;