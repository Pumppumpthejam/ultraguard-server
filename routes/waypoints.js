const express = require("express");

module.exports = (db) => {
  const router = express.Router();

  router.get("/", (req, res) => {
    const device = req.query.device;
    db.all(
      `SELECT * FROM waypoints WHERE device_imei = ?`,
      [device],
      (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
      }
    );
  });

  router.post("/", (req, res) => {
    const { name, latitude, longitude, description, device } = req.body;
    db.get(`SELECT id FROM sites WHERE device_imei = ?`, [device], (err, site) => {
      if (err || !site) return res.status(404).json({ error: "Site not found" });

      db.run(
        `INSERT INTO waypoints (site_id, name, latitude, longitude, description, device_imei) VALUES (?, ?, ?, ?, ?, ?)`,
        [site.id, name, latitude, longitude, description, device],
        function (err) {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ id: this.lastID });
        }
      );
    });
  });

  return router;
};
