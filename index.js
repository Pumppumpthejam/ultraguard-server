// index.js - Entry point for Ultraguard backend server

const express = require("express");
const cors = require("cors");

const db = require("./db"); // SQLite or PostgreSQL instance

const devicesRouter = require("./routes/devices");
const usersRouter = require("./routes/users");
const loginRouter = require("./routes/login")(db); // ✅ make sure login.js is in /routes

const app = express();
app.use(cors());
app.use(express.json());

// Attach DB to app context
app.locals.db = db;

// Route registration
app.use("/api/devices", devicesRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter); // ✅ Now /api/login is available

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Ultraguard backend is running at http://localhost:${PORT}`);
});
