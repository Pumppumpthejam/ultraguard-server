// ✅ FIXED init_db.js
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("ultraguard.db");

db.serialize(() => {
  // USERS
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    active INTEGER DEFAULT 1
  )`);

  // DEVICES
  db.run(`CREATE TABLE IF NOT EXISTS devices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    imei TEXT UNIQUE,
    user_id TEXT
  )`);

  // SITES
  db.run(`CREATE TABLE IF NOT EXISTS sites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    device_imei TEXT
  )`);

  // SHIFTS
  db.run(`CREATE TABLE IF NOT EXISTS shifts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    site_id INTEGER,
    device_imei TEXT,
    type TEXT,
    start_time TEXT,
    end_time TEXT,
    duration TEXT,
    days TEXT
  )`);

  // WAYPOINTS
  db.run(`CREATE TABLE IF NOT EXISTS waypoints (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    site_id INTEGER,
    name TEXT,
    latitude TEXT,
    longitude TEXT,
    description TEXT,
    device_imei TEXT
  )`);

  console.log("✅ Database initialized");
});

db.close();
