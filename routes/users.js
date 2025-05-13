// routes/users.js - User management (admin access)

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../auth");

const router = express.Router();
const SECRET = "ultraguard_secret_key";

// POST /api/users/register - Register a new user
router.post("/register", async (req, res) => {
  const { email, password, role } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const db = req.app.locals.db;
  db.run(
    "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
    [email, hashedPassword, role || "client"],
    function (err) {
      if (err) return res.status(400).json({ error: "Email already used." });
      res.json({ success: true, userId: this.lastID });
    }
  );
});

// GET /api/users/users - Get all users (admin only)
router.get("/users", auth("admin"), (req, res) => {
  const db = req.app.locals.db;
  db.all("SELECT id, email, role FROM users", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
