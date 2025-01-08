const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const superuserRoutes = require("./routes/superuserRoutes");
const schoolRoutes = require("./routes/schoolRoutes");
const studentRoutes = require("./routes/studentRoutes");
const busRoutes = require("./routes/busRoutes");

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use("/api/superusers", superuserRoutes);
app.use("/api/schools", schoolRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/buses", busRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));