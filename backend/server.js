const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/superuser', require('./routes/superuserRoutes'));
app.use('/api/schools', require('./routes/schoolRoutes'));
app.use('/api /schools/students', require('./routes/studentRoutes'));
app.use('/api/schools/buses', require ('./routes/busRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));