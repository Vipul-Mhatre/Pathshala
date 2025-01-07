const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const superuserRoutes = require('./routes/superuserRoutes');
const schoolRoutes = require('./routes/schoolRoutes');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB')).catch(err => console.log(err));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/superuser', superuserRoutes);
app.use('/api/v1/school', schoolRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));