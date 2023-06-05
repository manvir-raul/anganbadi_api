const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;

const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization; // Extract the token from the request headers

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    // Verify the token using your secret key
    const decoded = jwt.verify(token, config.secret);
    req.user = decoded; // Store the decoded user information in the request object
    next(); // Call the next middleware or route handler
  } catch (error) {
    return res.status(403).json({ message: "Invalid token." });
  }
};

module.exports = verifyToken;
