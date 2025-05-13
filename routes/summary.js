const express = require("express");

module.exports = () => {
  const router = express.Router();

  router.post("/", (req, res) => {
    const { site, shift, date, report, completion } = req.body;

    const missed = report.filter((r) => r.status !== "ok");
    const summary = `
On ${date}, the guard on the ${shift} shift at ${site} completed ${completion}% of the required patrol.

${missed.length > 0
      ? `Missed or incomplete checkpoints: ${missed.map((m) => m.waypoint).join(", ")}.`
      : "All checkpoints were completed successfully."
    }
`;

    res.json({ summary: summary.trim() });
  });

  return router;
};
