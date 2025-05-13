const express = require("express");
const router = express.Router();
const auth = require("../auth");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");

const upload = multer({ dest: "uploads/" });

module.exports = (db) => {
  router.post("/upload-devices", auth(), upload.single("file"), (req, res) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Only admins can upload devices." });
    }

    const clientId = req.body.clientId;
    const filePath = req.file.path;

    if (!clientId || !filePath) {
      return res.status(400).json({ error: "Client ID and file are required." });
    }

    const results = [];
    const errors = [];
    let count = 0;

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        const name = row["name"]?.trim();
const imei = row["imei"]?.trim();

        if (name && imei) {
          db.get("SELECT id FROM devices WHERE imei = ?", [imei], (err, existing) => {
            if (err) return errors.push({ imei, error: err.message });
            if (existing) return errors.push({ imei, error: "Already exists" });

            db.run(
              "INSERT INTO devices (name, imei, user_id) VALUES (?, ?, ?)",
              [name, imei, clientId],
              function (err) {
                if (err) {
                  errors.push({ imei, error: err.message });
                } else {
                  results.push({ id: this.lastID, name, imei });
                  count++;
                }
              }
            );
          });
        }
      })
      .on("end", () => {
        setTimeout(() => {
          fs.unlinkSync(filePath); // clean temp file
          res.json({
            message: `✅ Uploaded ${count} devices`,
            results,
            errors,
          });
        }, 1000);
      });
  });

  return router;
};
