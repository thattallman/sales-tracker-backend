const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const User = require("./Models/userModel");

const app = express();

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to MongoDB (use env variable)
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// -------- ROUTES -------- //
const authRoutes = require("./Routes/authRoutes");
app.use("/api/auth", authRoutes);

const salesRoutes = require("./Routes/salesRoutes");
app.use("/sales", salesRoutes);

const reportRoutes = require("./Routes/reportRoutes");
app.use("/reports", reportRoutes);

// Simple test route
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// Start server (port from env)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
