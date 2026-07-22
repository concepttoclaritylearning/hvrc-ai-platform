import rateLimit from "express-rate-limit";

/**
 * Rate Limiting Middleware
 * Protects proxy endpoints from abuse while allowing smooth client interaction.
 */
export const modelsLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: {
    error: "Rate Limit Exceeded",
    message: "Too many model discovery requests. Please wait a minute before retrying."
  },
  standardHeaders: true,
  legacyHeaders: false
});

export const connectionLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: {
    error: "Rate Limit Exceeded",
    message: "Too many connection attempts. Please wait a minute before retrying."
  },
  standardHeaders: true,
  legacyHeaders: false
});

export const healthLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 40,
  message: {
    error: "Rate Limit Exceeded",
    message: "Too many health probe requests."
  },
  standardHeaders: true,
  legacyHeaders: false
});

export const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: {
    error: "Rate Limit Exceeded",
    message: "Too many chat completion requests. Please wait a minute before retrying."
  },
  standardHeaders: true,
  legacyHeaders: false
});
