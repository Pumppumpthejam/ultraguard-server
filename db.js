// db.js - SQLite database connection

const sqlite3 = require("sqlite3").verbose();     // Import SQLite
const db = new sqlite3.Database("ultraguard.db"); // Connect to database file
module.exports = db;                              // Export connection for other modules
