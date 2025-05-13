const express = require("express");
const router = express.Router();
const auth = require("../auth");

module.exports = (db) => {
  // Get all client users
  router.get("/users", auth("admin"), (req, res) => {
    db.all(
      `SELECT id, email, role, active FROM users WHERE role = 'client'`,
      [],
      (err, users) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(users);
      }
    );
  });

  // Toggle user active status
  router.patch("/users/:id/status", auth("admin"), (req, res) => {
    const userId = req.params.id;
    const { active } = req.body;

    db.run(
      `UPDATE users SET active = ? WHERE id = ?`,
      [active ? 1 : 0, userId],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, updated: this.changes });
      }
    );
  });

  // ✅ Single correct route to create client users
  router.post("/users", auth("admin"), async (req, res) => {
    const { email, password } = req.body;
    const bcrypt = require("bcrypt");
    const hash = await bcrypt.hash(password, 10);

    db.run(
      `INSERT INTO users (email, password, role, active) VALUES (?, ?, 'client', 1)`,
      [email, hash],
      function (err) {
        if (err) return res.status(400).json({ error: "Email already exists." });
        res.json({ success: true, userId: this.lastID });
      }
    );
  });

  // Seed admin (optional)
  router.post("/seed-admin", async (req, res) => {
    const bcrypt = require("bcrypt");
    const email = "admin@ultraguard.com";
    const password = "123456";
    const hash = await bcrypt.hash(password, 10);

    db.run(
      `INSERT OR IGNORE INTO users (email, password, role, active) VALUES (?, ?, 'admin', 1)`,
      [email, hash],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, email, password });
      }
    );
  });

  return router;
};
