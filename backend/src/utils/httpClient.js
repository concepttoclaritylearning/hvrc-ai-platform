import { logger } from "./logger.js";

/**
 * HVRC.AI Stateless HTTP Client
 * Sends fetch requests to AI provider endpoints with timeouts and retry safety.
 */
export async function sendProviderRequest({ url, method = "GET", headers = {}, body = null, timeoutMs = 15000 }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const options = {
    method,
    headers: {
      ...headers
    },
    signal: controller.signal
  };

  if (body) {
    options.body = typeof body === "string" ? body : JSON.stringify(body);
  }

  const startTime = Date.now();

  try {
    const res = await fetch(url, options);
    clearTimeout(timer);
    const duration = Date.now() - startTime;

    logger.info(`Provider HTTP ${method} ${res.status}`, { url, status: res.status, duration });
    return res;
  } catch (err) {
    clearTimeout(timer);
    const duration = Date.now() - startTime;

    if (err.name === "AbortError") {
      logger.warn(`Provider HTTP request timeout after ${timeoutMs}ms`, { url, duration });
      throw new Error(`Request timed out after ${timeoutMs / 1000} seconds.`);
    }

    logger.error(`Provider HTTP connection failure: ${err.message}`, { url, duration });
    throw err;
  }
}
