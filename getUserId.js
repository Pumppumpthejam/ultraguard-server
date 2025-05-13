const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./ultraguard.db");

// You can change this email any time to fetch any client
const email = "jeandre@guardnet.co.za";

db.get(
  "SELECT id, email FROM users WHERE LOWER(email) = LOWER(?)",
  [email],
  (err, row) => {
    if (err) {
      console.error("❌ Error:", err.message);
    } else if (!row) {
      console.log(`❌ No user found with email: ${email}`);
    } else {
      console.log(`✅ Found user: ${row.email}`);
      console.log(`🆔 User ID: ${row.id}`);
    }
    db.close();
  }
);
