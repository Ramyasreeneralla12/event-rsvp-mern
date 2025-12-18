const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
const app = express();

/* ===== ENV CHECK ===== */
["MONGO_URI", "JWT_SECRET"].forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Missing env variable: ${key}`);
    process.exit(1);
  }
});

/* ===== MIDDLEWARE ===== */
app.use(
  cors({
    origin: "*",
    credentials:true,
  })
    
  );
app.use(express.json());

/* ===== CONNECT DB ===== */
connectDB();

/* ===== ROUTES ===== */
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/events", require("./routes/event.routes"));
app.use("/api/rsvp", require("./routes/rsvp.routes"));

/* ===== HEALTH CHECK ===== */
app.get("/", (req, res) => {
  res.json({ message: "Event RSVP Backend Running" });
});

/* ===== SERVER ===== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
