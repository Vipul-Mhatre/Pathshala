const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const validateEnv = require('./config/validateEnv');
const errorHandler = require('./middleware/errorMiddleware');
const ensureSuperuser = require('./config/ensureSuperuser');

const studentRoutes = require('./routes/studentRoutes');
const schoolRoutes = require('./routes/schoolRoutes');
const busRoutes = require('./routes/busRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

validateEnv();

connectDB().then(() => {
  ensureSuperuser();
});

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));