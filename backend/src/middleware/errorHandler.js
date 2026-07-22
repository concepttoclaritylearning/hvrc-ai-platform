import { logger } from "../utils/logger.js";

/**
 * Unified Global Error Handler Middleware
 * Maps provider errors into standardized, security-safe response objects.
 */
export function errorHandler(err, req, res, next) {
  logger.error(`Proxy Exception: ${err.message}`, { path: req.originalUrl });

  const status = err.status || err.statusCode || 500;
  let message = err.message || "Internal Proxy Error";

  if (status === 401 || status === 403) {
    message = "Invalid or Unauthorized API Key. Please verify your credentials with the provider.";
  } else if (status === 429) {
    message = "Provider rate limit reached. Please wait before trying again.";
  } else if (status >= 500) {
    message = "Provider service error. The AI model service is temporarily unreachable.";
  }

  res.status(status).json({
    error: err.name || "ProxyError",
    message,
    status
  });
}
