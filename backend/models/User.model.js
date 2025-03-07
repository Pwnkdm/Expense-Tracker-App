const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: true },
  refreshToken: { type: String }, // Store refresh token here
  resetToken: { type: String, default: null },
  resetTokenExpiry: { type: Date, default: null },
});

module.exports = mongoose.model("User", UserSchema);
