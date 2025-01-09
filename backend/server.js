const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const validateEnv = require('./config/validateEnv');
const { createDefaultSuperusers } = require('./models/Superuser');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/superuser', require('./routes/superuserRoutes'));
app.use('/api/schools', require('./routes/schoolRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/buses', require('./routes/busRoutes'));

validateEnv();
createDefaultSuperusers();

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });