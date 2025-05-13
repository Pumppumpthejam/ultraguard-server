// routes/login.js - Handles user login and token generation

const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const router = express.Router();
const SECRET = process.env.JWT_SECRET || "ultraguard-secret";

module.exports = (db) => {
  // POST /api/login
  router.post("/", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!user) return res.status(401).json({ error: "Invalid email or password." });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ error: "Invalid email or password." });

      const token = jwt.sign(
        { id: user.id, role: user.role, email: user.email },
        SECRET,
        { expiresIn: "7d" }
      );

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      });
    });
  });

  // ✅ GET /api/login/me
  router.get("/me", require("../auth")(), (req, res) => {
    res.json({ user: req.user });
  });

  return router;
};
