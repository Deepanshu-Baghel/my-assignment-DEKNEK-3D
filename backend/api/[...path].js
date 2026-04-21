const app = require("../src/app");
const connectDB = require("../src/config/db");

let dbReadyPromise;
let dbConnected = false;

module.exports = async (req, res) => {
  try {
    const requestPath = req.url.split("?")[0];

    // Keep health checks and CORS preflight fast even if DB is temporarily unavailable.
    if (req.method === "OPTIONS" || requestPath === "/api/health" || requestPath === "/health") {
      return app(req, res);
    }

    if (!requestPath.startsWith("/api/")) {
      req.url = `/api${req.url.startsWith("/") ? "" : "/"}${req.url}`;
    }

    if (!dbConnected && !dbReadyPromise) {
      dbReadyPromise = connectDB();
    }

    if (!dbConnected) {
      await dbReadyPromise;
      dbConnected = true;
    }

    return app(req, res);
  } catch (error) {
    dbReadyPromise = null;
    return res.status(500).json({
      status: "error",
      message: "Server startup failed",
      details: error.message,
    });
  }
};
