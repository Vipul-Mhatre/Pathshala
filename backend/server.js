const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const validateEnv = require('./config/validateEnv');
const errorHandler = require('./utils/errorHandler');

// Import routes
const superuserRoutes = require('./routes/superuserRoutes');
const schoolRoutes = require('./routes/schoolRoutes');
const studentRoutes = require('./routes/studentRoutes');
const busRoutes = require('./routes/busRoutes');

// Load environment variables
require('dotenv').config();
validateEnv();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/superuser', superuserRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/buses', busRoutes);

// Error handling
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;