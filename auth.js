// auth.js - Middleware to verify JWT and optionally restrict by user role

const jwt = require("jsonwebtoken");              // Import JSON Web Token
const SECRET = "ultraguard_secret_key";           // JWT secret key (store in env in production)

function auth(requiredRole = null) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization; // Get token from Authorization header
    if (!authHeader) return res.status(401).json({ error: "No token provided." });

    const token = authHeader.split(" ")[1];       // Extract token from "Bearer <token>"
    jwt.verify(token, SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ error: "Invalid token." });

      if (requiredRole && decoded.role !== requiredRole)
        return res.status(403).json({ error: "Access denied." });

      req.user = decoded;                         // Attach decoded token to request
      next();                                     // Proceed to next middleware
    });
  };
}

module.exports = auth;                     // Export the auth middleware
// This middleware function checks for a valid JWT in the request headers.      