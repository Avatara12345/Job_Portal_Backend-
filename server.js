const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./router/authRoutes");
const jobsRouter = require("./router/jobsRouter");
const resumeRouter = require("./router/resumeRouter");

const app = express();

// Load env vars (Render uses Environment tab, no need for path)
dotenv.config();

app.use(express.json());
app.use(cors());

// MongoDB Connection
const mongoDbURl = process.env.MONGO_DB_URL;
const database = process.env.MONGO_DATABASE;

if (!mongoDbURl || !database) {
  console.error("❌ MongoDB URL or Database missing in env vars");
  process.exit(1);
}

mongoose
  .connect(mongoDbURl, { dbName: database })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection error:", err);
    process.exit(1);
  });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobsRouter);
app.use("/api/job", resumeRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || "Internal server error";
  res.status(status).json({ message });
});

// Server
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
