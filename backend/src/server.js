import express from "express";
import cors from "cors";
import { config } from "./config/env.js";
import nvidiaRoutes from "./routes/nvidia.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { logger } from "./utils/logger.js";

const app = express();

// CORS setup allowing client connections
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (config.allowedOrigins.includes("*") || config.allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Fallback allow for local dev
    },
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
  })
);

app.use(express.json({ limit: "5mb" }));

// Request Logging Middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode}`, {
      duration: Date.now() - start
    });
  });
  next();
});

// Proxy Routes Registration
app.use("/proxy/nvidia", nvidiaRoutes);

// Root Health Probe
app.get("/health", (req, res) => {
  res.json({ status: "healthy", service: "HVRC.AI Express NIM Proxy Server", timestamp: new Date() });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "NotFound", message: `Endpoint ${req.originalUrl} not found on proxy server.` });
});

// Global Error Middleware
app.use(errorHandler);

// Start Express Proxy Server
const PORT = config.port;
app.listen(PORT, () => {
  logger.info(`⚡ HVRC.AI NVIDIA NIM Proxy Server listening on http://localhost:${PORT}`);
  logger.info(`👉 Proxy Model Discovery: POST http://localhost:${PORT}/proxy/nvidia/models`);
  logger.info(`👉 Proxy Chat Completion: POST http://localhost:${PORT}/proxy/nvidia/chat`);
  logger.info(`👉 Proxy Provider Health: GET  http://localhost:${PORT}/proxy/nvidia/health`);
});
