const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1]; // Extract token

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded, "decoded token");

    req.user = decoded; // Attach user info to request
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message); // Log the actual error
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = auth;
