const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const {
  signup,
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// @route   POST /api/auth/signup
// @desc    Register a user
// @access  Public
router.post(
  "/signup",
  [
    check("username", "Username is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  signup
);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  login
);

// @route   POST /api/auth/forgot-password
// @desc    Send reset password link
// @access  Public
router.post(
  "/forgot-password",
  [check("email", "Please include a valid email").isEmail()],
  forgotPassword
);

// @route   POST /api/auth/reset-password
// @desc    Reset user password
// @access  Public
router.post(
  "/reset-password",
  [
    check("token", "Token is required").not().isEmpty(),
    check("newPassword", "Password is required").exists(),
  ],
  resetPassword
);

// Refresh Token Route
router.post("/refresh-token", refreshToken);

// Logout Route (Requires authentication)
router.post("/logout", authMiddleware, logout);

module.exports = router;
