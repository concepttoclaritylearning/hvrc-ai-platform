import express from "express";
import cors from "cors";
import { config } from "./config/env.js";
import nvidiaRoutes from "./routes/nvidia.routes.js";
import providerRoutes from "./routes/provider.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { logger } from "./utils/logger.js";

const app = express();

// CORS setup allowing client connections
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (config.allowedOrigins.includes("*") || config.allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
  })
);

app.use(express.json({ limit: "10mb" }));

// Request Logging Middleware (strips API keys & credentials)
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode}`, {
      duration: Date.now() - start
    });
  });
  next();
});

// Universal Provider Gateway Routes & Legacy NVIDIA Proxy Route
app.use("/api/providers", providerRoutes);
app.use("/proxy/nvidia", nvidiaRoutes);

// Root Health Probe
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "HVRC.AI Universal Provider Gateway & Proxy Backend",
    timestamp: new Date()
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "NotFound", message: `Endpoint ${req.originalUrl} not found on server.` });
});

// Global Error Middleware
app.use(errorHandler);

// Start Server
const PORT = config.port || 3001;
app.listen(PORT, () => {
  logger.info(`⚡ HVRC.AI Universal Provider Gateway Server running on http://localhost:${PORT}`);
  logger.info(`👉 Universal Provider Connect: POST http://localhost:${PORT}/api/providers/connect`);
  logger.info(`👉 Universal Chat Completion: POST http://localhost:${PORT}/api/providers/chat`);
  logger.info(`👉 Universal Token Stream:     POST http://localhost:${PORT}/api/providers/stream`);
  logger.info(`👉 Live Model Discovery:     POST http://localhost:${PORT}/api/providers/models`);
  logger.info(`👉 Provider Health Probe:     POST http://localhost:${PORT}/api/providers/health`);
});
