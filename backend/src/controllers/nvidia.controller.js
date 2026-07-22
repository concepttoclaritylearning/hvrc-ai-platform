import { NvidiaService } from "../services/nvidia.service.js";

/**
 * NVIDIA NIM Proxy Controller
 * Receives proxy requests, delegates to service, and returns normalized responses.
 */
export async function getModelsController(req, res, next) {
  try {
    const apiKey = req.apiKey;
    const result = await NvidiaService.fetchModels(apiKey);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function chatCompletionController(req, res, next) {
  try {
    const apiKey = req.apiKey;
    const { model, messages, temperature, top_p, max_tokens, stream } = req.body;

    if (stream) {
      // Set SSE headers for streaming
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const streamBody = await NvidiaService.executeChat({
        apiKey,
        model,
        messages,
        temperature,
        top_p,
        max_tokens,
        stream: true
      });

      // Stream chunks directly to client
      for await (const chunk of streamBody) {
        res.write(chunk);
      }
      return res.end();
    }

    const result = await NvidiaService.executeChat({
      apiKey,
      model,
      messages,
      temperature,
      top_p,
      max_tokens,
      stream: false
    });

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function healthCheckController(req, res, next) {
  try {
    const health = await NvidiaService.checkHealth();
    return res.status(health.reachable ? 200 : 503).json(health);
  } catch (err) {
    next(err);
  }
}
