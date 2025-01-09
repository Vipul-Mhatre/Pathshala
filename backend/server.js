const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors"); // Import cors
const connectDB = require("./config/db");
const superuserRoutes = require("./routes/superuserRoutes");
const schoolRoutes = require("./routes/schoolRoutes");
const studentRoutes = require("./routes/studentRoutes");
const busRoutes = require("./routes/busRoutes");
const errorHandler = require("./utils/errorHandler");

dotenv.config();
connectDB();

const app = express();

// Enable CORS for frontend
app.use(
  cors({
    origin: "http://localhost:3000", // Frontend origin
    methods: ["GET", "POST", "PUT", "DELETE"], // HTTP methods to allow
    credentials: true, // If you're using cookies
  })
);

// Middleware for parsing JSON
app.use(express.json());

// Routes
app.use("/api/superuser", superuserRoutes);
app.use("/api/schools", schoolRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/buses", busRoutes);

// Error Handler Middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));