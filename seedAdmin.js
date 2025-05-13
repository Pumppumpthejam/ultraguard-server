const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");

const db = new sqlite3.Database("./ultraguard.db");

const email = "admin@ultraguard.com";
const password = "123456";

bcrypt.hash(password, 10, (err, hash) => {
  if (err) throw err;

  db.run(
    `INSERT INTO users (email, password, role, active) VALUES (?, ?, 'admin', 1)`,
    [email, hash],
    function (err) {
      if (err) {
        console.error("❌ Failed to insert admin user:", err.message);
      } else {
        console.log("✅ Admin user created:", email);
      }
      db.close();
    }
  );
});
