const express = require("express");
const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");
const XLSX = require("xlsx");

module.exports = (db, upload) => {
  const router = express.Router();

  router.post("/", upload.single("file"), (req, res) => {
    const filePath = req.file.path;
    const ext = path.extname(filePath).toLowerCase();
    if (![".xlsx", ".xls", ".csv"].includes(ext)) {
      return res.status(400).json({ error: "Unsupported file format." });
    }

    let results = [];
    try {
      const workbook = XLSX.readFile(filePath);
      const sheet = workbook.SheetNames[0];
      results = XLSX.utils.sheet_to_json(workbook.Sheets[sheet], { defval: "" });
    } catch {
      return res.status(500).json({ error: "Error reading file." });
    }

    const sample = results[0];
    const device = sample?.device || sample?.Device || "";
    const date = dayjs(sample?.date || sample?.Date).format("YYYY-MM-DD");

    db.get(`SELECT * FROM shifts WHERE device_imei = ?`, [device], (err, shift) => {
      if (err || !shift) return res.status(404).json({ error: "Shift not found" });

      const start = dayjs(`${date} ${shift.start_time}`);
      const end = dayjs(`${date} ${shift.end_time}`).add(
        shift.end_time < shift.start_time ? 1 : 0,
        "day"
      );

      const sessionData = results.filter((row) => {
        const timestamp = dayjs(row.date || row.Date);
        return timestamp.isAfter(start) && timestamp.isBefore(end);
      });

      db.all(`SELECT name FROM waypoints WHERE site_id = ?`, [shift.site_id], (err, waypoints) => {
        if (err) return res.status(500).json({ error: err.message });

        const report = waypoints.map((wp) => {
          const ins = sessionData.filter(
            (e) => e.geofenceName === wp.name && e.isInside === "Yes"
          );
          const outs = sessionData.filter(
            (e) => e.geofenceName === wp.name && e.isInside === "No"
          );

          const timeIn = ins.length ? dayjs(ins[0].date || ins[0].Date) : null;
          const timeOut = outs.find((o) => timeIn && dayjs(o.date || o.Date).isAfter(timeIn));

          return {
            waypoint: wp.name,
            timeIn: timeIn ? timeIn.format("HH:mm") : "—",
            timeOut: timeOut ? dayjs(timeOut.date || timeOut.Date).format("HH:mm") : "—",
            timeSpent:
              timeIn && timeOut
                ? `${dayjs(timeOut.date || timeOut.Date).diff(timeIn, "minute")} min`
                : "—",
            status: timeIn && timeOut ? "ok" : "missed",
          };
        });

        const completion = Math.round(
          (report.filter((r) => r.status === "ok").length / report.length) * 100
        );

        res.json({
          site: shift.site_id,
          device: shift.device_imei,
          shift: shift.type,
          date,
          completion,
          report,
        });
      });
    });
  });

  return router;
};
