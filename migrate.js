const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./ultraguard.db");

db.serialize(() => {
  db.run("ALTER TABLE devices ADD COLUMN user_id TEXT", (err) => {
    if (err) {
      console.error("Migration error:", err.message);
    } else {
      console.log("✅ Column 'user_id' added to devices table.");
    }
    db.close();
  });
});
