import rateLimit from "express-rate-limit";

/**
 * Rate Limiting Middleware
 * Protects proxy endpoints from abuse while allowing smooth client interaction.
 */
export const modelsLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: {
    error: "Rate Limit Exceeded",
    message: "Too many model discovery requests. Please wait a minute before retrying."
  },
  standardHeaders: true,
  legacyHeaders: false
});

export const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60,
  message: {
    error: "Rate Limit Exceeded",
    message: "Too many chat completion requests. Please wait a minute before retrying."
  },
  standardHeaders: true,
  legacyHeaders: false
});
