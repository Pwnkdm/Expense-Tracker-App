const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

// Improve MongoDB connection with pooling
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  const client = await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    maxPoolSize: 10, // Maintain up to 10 socket connections
  });

  cachedDb = client;
  return client;
}

// Middleware
app.use(
  cors({
    origin: process.env.FE_BASE_URL || "*", // Fallback to allow all in case env var is missing
    credentials: true,
  })
);
app.use(express.json());

// Route imports
const expenseRoutes = require("./routes/earningExpense.routes");
const authRoutes = require("./routes/auth.routes");
const auth = require("./middlewares/auth.middleware");

// Routes in use
app.use("/api/auth", authRoutes);
app.use("/api", expenseRoutes);

// Protected route
app.get("/api/protected", auth, (req, res) => {
  try {
    res.json({ msg: "This is a protected route", user: req.user });
  } catch (error) {
    console.log(error, "error in protected route");
    res.status(500).json({ error: "Server error" });
  }
});

// Health check endpoint - important for testing
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Connect to database for each request
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error("Database connection error:", error);
    return res.status(500).json({ error: "Database connection failed" });
  }
});

// Only start the server in development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export for Vercel
module.exports = app;
