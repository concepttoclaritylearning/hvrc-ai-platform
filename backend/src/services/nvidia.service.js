import { config } from "../config/env.js";
import { sendProviderRequest } from "../utils/httpClient.js";
import { normalizeModelList, normalizeChatCompletion } from "../utils/responseNormalizer.js";

/**
 * Common Model Alias Map
 * Automatically maps short model identifiers to full NVIDIA NIM model strings.
 */
const MODEL_ALIAS_MAP = {
  "llama-3.3-70b": "meta/llama-3.3-70b-instruct",
  "llama-3.1-8b": "meta/llama-3.1-8b-instruct",
  "llama-3.1-70b": "meta/llama-3.1-70b-instruct",
  "llama-3.1-405b": "meta/llama-3.1-405b-instruct",
  "deepseek-r1": "deepseek-ai/deepseek-r1",
  "deepseek-v3": "deepseek-ai/deepseek-r1",
  "nemotron-4-340b": "nvidia/nemotron-4-340b-instruct",
  "nemotron-mini-4b": "nvidia/nemotron-mini-4b-instruct",
  "mistral-large-2": "mistralai/mistral-large-2-instruct",
  "mixtral-8x22b": "mistralai/mixtral-8x22b-instruct-v0.1",
  "gemma-2-27b": "google/gemma-2-27b-it",
  "qwen2.5-72b": "qwen/qwen2.5-72b-instruct",
  "yi-large": "01-ai/yi-large"
};

/**
 * Universal Stateless NVIDIA NIM & Cloud Model Proxy Service
 * Supports 100% of all models returned by GET /v1/models without hardcoding or restriction.
 */
export class NvidiaService {
  /**
   * Resolve model identifier string (supports exact model strings & short aliases)
   */
  static resolveModelId(modelInput) {
    if (!modelInput || typeof modelInput !== "string") return "meta/llama-3.3-70b-instruct";
    const clean = modelInput.trim().toLowerCase();
    return MODEL_ALIAS_MAP[clean] || modelInput.trim();
  }

  /**
   * Fetch live available models dynamically from GET /v1/models
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
      let parsedMessage = errText;
      try {
        const json = JSON.parse(errText);
        parsedMessage = json.detail || json.message || json.error?.message || errText;
      } catch (e) {}

      const err = new Error(parsedMessage || `NVIDIA HTTP ${res.status} Error`);
      err.status = res.status;
      throw err;
    }

    const data = await res.json();
    return normalizeModelList("nvidia", data);
  }

  /**
   * Execute chat completion for ANY model string via POST /v1/chat/completions
   */
  static async executeChat({ apiKey, model, messages, temperature = 0.7, top_p = 1, max_tokens = 1024, stream = false }) {
    const url = `${config.nvidiaBaseUrl}/chat/completions`;
    const resolvedModel = this.resolveModelId(model);

    const payload = {
      model: resolvedModel,
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
      let errorMessage = errText;
      try {
        const errJson = JSON.parse(errText);
        errorMessage = errJson.detail || errJson.message || errJson.error?.message || errText;
      } catch (e) {}

      // Handle account function permission errors on NVIDIA NIM
      if (errorMessage.includes("Not found for account") || res.status === 404) {
        errorMessage = `Model "${resolvedModel}" is restricted or not enabled on your NVIDIA developer account tier. Please select a public NIM model like "meta/llama-3.3-70b-instruct" or "deepseek-ai/deepseek-r1" in the Model Hub.`;
      }

      // Clean error normalization for client UI
      return {
        provider: "nvidia",
        id: `chatcmpl-err-${Date.now()}`,
        object: "chat.completion",
        created: Math.floor(Date.now() / 1000),
        model: resolvedModel,
        choices: [
          {
            index: 0,
            message: {
              role: "assistant",
              content: `[NVIDIA NIM Error (HTTP ${res.status})]: ${errorMessage}`
            },
            finish_reason: "error"
          }
        ]
      };
    }

    if (stream) {
      return res.body; // Stream SSE directly to client
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
