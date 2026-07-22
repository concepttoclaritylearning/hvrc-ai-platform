import { config } from "../config/env.js";
import { sendProviderRequest } from "../utils/httpClient.js";
import { normalizeModelList, normalizeChatCompletion } from "../utils/responseNormalizer.js";

/**
 * NVIDIA NIM Service Layer
 * Interacts directly with integrate.api.nvidia.com APIs server-to-server.
 */
export class NvidiaService {
  /**
   * Fetch live models dynamically from GET /v1/models
   */
  static async fetchModels(apiKey) {
    const url = `${config.nvidiaBaseUrl}/models`;
    const res = await sendProviderRequest({
      url,
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json"
      },
      timeoutMs: 10000
    });

    if (!res.ok) {
      const errText = await res.text();
      const err = new Error(errText || "Failed to fetch NVIDIA models");
      err.status = res.status;
      throw err;
    }

    const data = await res.json();
    return normalizeModelList("nvidia", data);
  }

  /**
   * Execute chat completion via POST /v1/chat/completions
   */
  static async executeChat({ apiKey, model, messages, temperature = 0.7, top_p = 1, max_tokens = 1024, stream = false }) {
    const url = `${config.nvidiaBaseUrl}/chat/completions`;

    const payload = {
      model,
      messages: messages.map((m) => ({
        role: m.role === "assistant" ? "assistant" : m.role === "system" ? "system" : "user",
        content: typeof m.content === "string" ? m.content : String(m.content || m.text || "")
      })),
      temperature,
      top_p,
      max_tokens,
      stream
    };

    const res = await sendProviderRequest({
      url,
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: payload,
      timeoutMs: 120000
    });

    if (!res.ok) {
      const errText = await res.text();
      const err = new Error(errText || "NVIDIA Chat Completion Error");
      err.status = res.status;
      throw err;
    }

    if (stream) {
      return res.body; // Return SSE stream directly
    }

    const data = await res.json();
    return normalizeChatCompletion("nvidia", data);
  }

  /**
   * Health ping check
   */
  static async checkHealth() {
    const startTime = Date.now();
    try {
      const res = await sendProviderRequest({
        url: `${config.nvidiaBaseUrl}/models`,
        method: "GET",
        headers: { Accept: "application/json" },
        timeoutMs: 5000
      });
      const latency = Date.now() - startTime;
      return {
        status: res.ok ? "healthy" : "degraded",
        provider: "nvidia",
        reachable: res.ok,
        latency
      };
    } catch (err) {
      return {
        status: "unreachable",
        provider: "nvidia",
        reachable: false,
        latency: Date.now() - startTime
      };
    }
  }
}
