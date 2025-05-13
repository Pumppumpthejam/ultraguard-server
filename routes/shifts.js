const express = require("express");

module.exports = (db) => {
  const router = express.Router();

  router.get("/", (req, res) => {
    const site_id = req.query.site;
    db.all(
      `SELECT type, start_time, end_time FROM shifts WHERE site_id = ?`,
      [site_id],
      (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
      }
    );
  });

  router.post("/", (req, res) => {
    const { site, device, shifts } = req.body;

    const stmt = db.prepare(
      `INSERT INTO shifts (site_id, device_imei, type, start_time, end_time, duration, days) VALUES (?, ?, ?, ?, ?, ?, ?)`
    );

    shifts.forEach((s) => {
      stmt.run(
        site,
        device,
        s.type,
        s.start,
        s.end,
        s.duration,
        (s.days || []).join(",")
      );
    });

    stmt.finalize();
    res.json({ message: "Shifts saved" });
  });

  return router;
};
