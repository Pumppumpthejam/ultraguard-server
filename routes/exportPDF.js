const express = require("express");
const { jsPDF } = require("jspdf");
require("jspdf-autotable");

module.exports = () => {
  const router = express.Router();

  router.post("/", (req, res) => {
    const { site, shift, date, report, completion } = req.body;

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Ultraguard Patrol Report`, 14, 20);
    doc.setFontSize(12);
    doc.text(`Site: ${site}`, 14, 30);
    doc.text(`Shift: ${shift}`, 14, 36);
    doc.text(`Date: ${date}`, 14, 42);
    doc.text(`Completion: ${completion}%`, 14, 48);

    const tableData = report.map((row) => [
      row.waypoint,
      row.timeIn,
      row.timeOut,
      row.timeSpent,
      row.status.toUpperCase(),
    ]);

    doc.autoTable({
      head: [["Waypoint", "Time In", "Time Out", "Time Spent", "Status"]],
      body: tableData,
      startY: 54,
    });

    const pdfData = doc.output("arraybuffer");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=patrol-report-${date}.pdf`);
    res.send(Buffer.from(pdfData));
  });

  return router;
};
