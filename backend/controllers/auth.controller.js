const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");

exports.signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Hash the password before storing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    const payload = { user: { id: user.id } };

    // Generate Access Token
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY || "1d",
    });

    // Generate Refresh Token
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });

    // Store Refresh Token in DB
    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      success: true,
      message: "User created successfully!",
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const payload = { user: { id: user.id } };

    // Generate Access Token
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY || "1d",
    });

    // Generate Refresh Token
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });

    // Update Refresh Token in DB
    user.refreshToken = refreshToken;
    await user.save();

    // Exclude password and refreshToken before sending response
    const {
      password: _,
      refreshToken: __,
      ...userWithoutSensitiveData
    } = user.toObject();

    res.json({
      success: true,
      message: "User logged in successfully!",
      accessToken,
      user: userWithoutSensitiveData, // Send user details without password & refreshToken
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// auth.controller.js
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ msg: "No refresh token provided" });
  }

  try {
    const user = await User.findOne({ refreshToken });
    if (!user) {
      return res.status(403).json({ msg: "Invalid refresh token" });
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ msg: "Invalid token" });

      const newAccessToken = jwt.sign(
        { user: { id: decoded.user.id } },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRY || "1d",
        }
      );

      res.json({ accessToken: newAccessToken });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.logout = async (req, res) => {
  try {
    const user = await User.findById(req.user.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.refreshToken = ""; // Remove refresh token
    await user.save();

    res.json({ msg: "User logged out successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  // Check if email is provided
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });

    // If user is not found, return a 404 error
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Generate a reset token valid for 10 minutes
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });

    // Update user with reset token and expiry
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 600000; // 10 minutes
    await user.save();

    // Create a transporter for sending the email
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Set up email options
    const mailOptions = {
      from: process.env.EMAIL_USER, // Add from field
      to: user.email,
      subject: "Password Reset",
      html: fs
        .readFileSync(
          path.join(__dirname, "../email/resetPassword.html"),
          "utf-8"
        )
        .replace(
          "{{resetLink}}",
          `${process.env.FE_BASE_URL}/reset-password?token=${token}`
        ),
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response); // Log the response for debugging

    // Respond to the client
    res.json({ message: "Reset link sent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) {
      return res.status(400).json({ message: "Invalid token" });
    }

    // Find user by ID and check resetToken
    const user = await User.findOne({ _id: decoded.id });

    console.log(user, "user in resetPass controller!");

    if (!user || user.resetToken !== token) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Check token expiry
    if (user.resetTokenExpiry < Date.now()) {
      return res.status(400).json({ message: "Token has expired" });
    }

    // Hash new password
    user.password = bcrypt.hashSync(newPassword, 10);

    // Clear token fields
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Error in resetPassword:", err);
    res.status(400).json({ message: "Invalid token or error in processing" });
  }
};
