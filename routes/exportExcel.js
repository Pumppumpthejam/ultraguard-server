const express = require("express");
const ExcelJS = require("exceljs");

module.exports = () => {
  const router = express.Router();

  router.post("/", async (req, res) => {
    const { site, shift, date, report, completion } = req.body;

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Patrol Report");

    sheet.addRow(["Ultraguard Patrol Report"]);
    sheet.addRow([`Site: ${site}`]);
    sheet.addRow([`Shift: ${shift}`]);
    sheet.addRow([`Date: ${date}`]);
    sheet.addRow([`Completion: ${completion}%`]);
    sheet.addRow([]);

    sheet.addRow(["Waypoint", "Time In", "Time Out", "Time Spent", "Status"]);
    report.forEach((row) => {
      sheet.addRow([
        row.waypoint,
        row.timeIn,
        row.timeOut,
        row.timeSpent,
        row.status.toUpperCase(),
      ]);
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=patrol-report-${date}.xlsx`);
    await workbook.xlsx.write(res);
    res.end();
  });

  return router;
};
