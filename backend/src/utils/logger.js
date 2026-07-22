/**
 * HVRC.AI Proxy Logger
 * STRICT SECURITY PRINCIPLE:
 * Never logs API keys, prompts, completions, or Authorization headers.
 * Logs only timestamp, endpoint, status code, and latency duration.
 */

export const logger = {
  info: (message, meta = {}) => {
    const timestamp = new Date().toISOString();
    const cleanMeta = sanitizeMeta(meta);
    console.log(`[INFO] ${timestamp} - ${message}`, Object.keys(cleanMeta).length ? cleanMeta : "");
  },
  warn: (message, meta = {}) => {
    const timestamp = new Date().toISOString();
    const cleanMeta = sanitizeMeta(meta);
    console.warn(`[WARN] ${timestamp} - ${message}`, Object.keys(cleanMeta).length ? cleanMeta : "");
  },
  error: (message, meta = {}) => {
    const timestamp = new Date().toISOString();
    const cleanMeta = sanitizeMeta(meta);
    console.error(`[ERROR] ${timestamp} - ${message}`, Object.keys(cleanMeta).length ? cleanMeta : "");
  }
};

function sanitizeMeta(meta) {
  if (!meta || typeof meta !== "object") return {};
  const sanitized = { ...meta };

  // Strip sensitive properties
  delete sanitized.apiKey;
  delete sanitized.authorization;
  delete sanitized.Authorization;
  delete sanitized.prompt;
  delete sanitized.messages;
  delete sanitized.content;
  delete sanitized.choices;

  return sanitized;
}
