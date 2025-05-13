// routes/devices.js - Device-related endpoints

const express = require("express");
const router = express.Router();
const auth = require("../auth");

// GET /api/devices - Get devices for current user
router.get("/", auth(), (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;

  const query =
    userRole === "admin"
      ? "SELECT * FROM devices"
      : "SELECT * FROM devices WHERE user_id = ?";

  const params = userRole === "admin" ? [] : [userId];

  req.app.locals.db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST /api/devices - Add a new device (admin only)
router.post("/", auth("admin"), (req, res) => {
  const { name, imei, user_id } = req.body;

  if (!name || !imei || !user_id) {
    return res.status(400).json({ error: "Missing name, IMEI, or user ID." });
  }

  const db = req.app.locals.db;

  db.get("SELECT id FROM devices WHERE imei = ?", [imei], (err, existing) => {
    if (err) return res.status(500).json({ error: err.message });
    if (existing) return res.status(409).json({ error: "Device already exists." });

    db.run(
      "INSERT INTO devices (name, imei, user_id) VALUES (?, ?, ?)",
      [name, imei, user_id],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID });
      }
    );
  });
});

module.exports = router;
