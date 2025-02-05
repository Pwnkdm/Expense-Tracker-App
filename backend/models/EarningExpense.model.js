const mongoose = require("mongoose");

const EarningExpenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Add user reference
  date: { type: Date, required: true },
  time: { type: String, required: true }, // Store time in 12-hour format
  type: { type: String, enum: ["expense", "earning"], required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String },
});

module.exports = mongoose.model("EarningExpense", EarningExpenseSchema);
