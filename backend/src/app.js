const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");
const taskRoutes = require("./routes/task.routes");
const {
  notFoundHandler,
  globalErrorHandler,
} = require("./middleware/error.middleware");

const app = express();

const allowedOrigins = Array.from(
  new Set(
    [process.env.CLIENT_URL || "", "http://localhost:5173", "http://localhost:5174"]
      .join(",")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean)
  )
);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "success", message: "API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.use(notFoundHandler);
app.use(globalErrorHandler);

module.exports = app;
