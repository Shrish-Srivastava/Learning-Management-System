const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const { env } = require("./config/env");
const { authRoutes } = require("./routes/authRoutes");
const { chatbotRoutes } = require("./routes/chatbotRoutes");
const { courseRoutes } = require("./routes/courseRoutes");
const { progressRoutes } = require("./routes/progressRoutes");
const { adminRoutes } = require("./routes/adminRoutes");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "SkillUp API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.json({ message: "SkillUp backend is running." });
});

app.use(errorHandler);

module.exports = { app };
