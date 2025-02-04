const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const router = express.Router();

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

// Routes in use
app.use("/api/auth", authRoutes);
app.use("/api", expenseRoutes);

//use of middleware to protect the routes...
const auth = require("./middlewares/auth.middleware");

router.get("/protected", auth, (req, res) => {
  try {
    res.json({ msg: "This is a protected route", user: req.user });
  } catch (error) {
    console.log(error, "error in protected route");
  }
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => console.error("MongoDB connection error:", error));
