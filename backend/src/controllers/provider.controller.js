import { ProviderGatewayService } from "../services/provider.service.js";
import { logger } from "../utils/logger.js";

/**
 * Universal Provider Gateway Controller
 */
export class ProviderController {
  /**
   * POST /api/providers/connect
   * Validates endpoint, tests authentication, fetches live models
   */
  static async connect(req, res, next) {
    try {
      const { name, baseUrl, apiKey, providerType } = req.body;
      const result = await ProviderGatewayService.connectProvider({ name, baseUrl, apiKey, providerType });
      return res.status(200).json(result);
    } catch (err) {
      logger.error("Provider connection failed", { message: err.message, status: err.status });
      return res.status(err.status || 400).json({
        error: true,
        message: err.message || "Failed to connect to AI provider endpoint."
      });
    }
  }

  /**
   * POST /api/providers/chat
   * Standard OpenAI-compatible chat completion
   */
  static async chat(req, res, next) {
    try {
      const { name, baseUrl, apiKey, providerType, model, messages, temperature, top_p, max_tokens } = req.body;

      if (!baseUrl || !model || !messages) {
        return res.status(400).json({ error: true, message: "Missing required parameters: baseUrl, model, messages." });
      }

      const completion = await ProviderGatewayService.executeChat({
        name,
        baseUrl,
        apiKey,
        providerType,
        model,
        messages,
        temperature,
        top_p,
        max_tokens
      });

      return res.status(200).json(completion);
    } catch (err) {
      logger.error("Provider chat execution failed", { message: err.message });
      return res.status(err.status || 500).json({
        error: true,
        message: err.message || "Universal Provider Chat Execution Error"
      });
    }
  }

  /**
   * POST /api/providers/stream
   * Token-by-token SSE streaming completion
   */
  static async stream(req, res, next) {
    try {
      const { name, baseUrl, apiKey, providerType, model, messages, temperature, top_p, max_tokens } = req.body;

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const streamBody = await ProviderGatewayService.executeStream({
        name,
        baseUrl,
        apiKey,
        providerType,
        model,
        messages,
        temperature,
        top_p,
        max_tokens
      });

      // Pipe SSE stream readable to response
      if (streamBody.pipe) {
        streamBody.pipe(res);
      } else {
        const reader = streamBody.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(value);
        }
        res.end();
      }
    } catch (err) {
      logger.error("Provider stream execution failed", { message: err.message });
      if (!res.headersSent) {
        return res.status(err.status || 500).json({ error: true, message: err.message });
      }
      res.end();
    }
  }

  /**
   * POST /api/providers/models
   * Fetch live models dynamically for a provider endpoint
   */
  static async models(req, res, next) {
    try {
      const { name, baseUrl, apiKey, providerType } = req.body;
      const models = await ProviderGatewayService.fetchModels({ name, baseUrl, apiKey, providerType });
      return res.status(200).json({ models });
    } catch (err) {
      return res.status(err.status || 400).json({ error: true, message: err.message });
    }
  }

  /**
   * POST /api/providers/health
   * Probe provider availability and latency
   */
  static async health(req, res, next) {
    try {
      const { name, baseUrl, apiKey, providerType } = req.body;
      const result = await ProviderGatewayService.checkHealth({ name, baseUrl, apiKey, providerType });
      return res.status(200).json(result);
    } catch (err) {
      return res.status(200).json({ status: "offline", latencyMs: 0, reachable: false, error: err.message });
    }
  }

  /**
   * POST /api/providers/disconnect
   * Graceful disconnect acknowledgement
   */
  static async disconnect(req, res, next) {
    return res.status(200).json({ disconnected: true, timestamp: new Date().toISOString() });
  }
}
