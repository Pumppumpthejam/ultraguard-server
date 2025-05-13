const express = require("express");

module.exports = (db) => {
  const router = express.Router();

  router.get("/", (req, res) => {
    db.all(`SELECT * FROM sites`, (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  });

  router.post("/", (req, res) => {
    const { name, deviceId } = req.body;
    db.run(
      `INSERT INTO sites (name, device_imei) VALUES (?, ?)`,
      [name, deviceId],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID });
      }
    );
  });

  return router;
};
