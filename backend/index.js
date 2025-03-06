const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.FE_BASE_URL,
    credentials: true,
  })
);
app.use(express.json());

// Route imports
const expenseRoutes = require("./routes/earningExpense.routes");
const authRoutes = require("./routes/auth.routes");

// Auth routes (public)
app.use("/api/auth", authRoutes);

// Middleware to protect other routes
const auth = require("./middlewares/auth.middleware");
app.use("/api", auth); // Protect all /api routes

// Protected routes
app.use("/api", expenseRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => console.error("MongoDB connection error:", error));

module.exports = app;
