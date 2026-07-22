import { BaseProvider } from "./base.provider.js";
import { sendProviderRequest } from "../utils/httpClient.js";

/**
 * Universal OpenAI-Compatible Provider Implementation
 * Supports ANY OpenAI-compliant endpoint (NVIDIA NIM, OpenRouter, Groq, OpenAI, Ollama, LM Studio, LiteLLM, vLLM, etc.)
 */
export class OpenAiCompatibleProvider extends BaseProvider {
  constructor(config) {
    super(config);
    // Standardize URL (strip trailing slashes)
    this.baseUrl = (config.baseUrl || "").replace(/\/+$/, "");
  }

  /**
   * Helper to build full endpoint URL safely
   */
  getEndpointUrl(path) {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${this.baseUrl}${cleanPath}`;
  }

  /**
   * Helper headers
   */
  getHeaders() {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json"
    };

    if (this.apiKey) {
      headers.Authorization = `Bearer ${this.apiKey}`;
    }

    return headers;
  }

  /**
   * Validate connection and endpoint health
   */
  async validate() {
    if (!this.baseUrl) {
      throw new Error("Base URL is required to connect to provider.");
    }
    const models = await this.getModels();
    return { valid: true, modelCount: models.length };
  }

  /**
   * Fetch live models dynamically from GET {baseUrl}/models
   */
  async getModels() {
    const url = this.getEndpointUrl("/models");

    const res = await sendProviderRequest({
      url,
      method: "GET",
      headers: this.getHeaders(),
      timeoutMs: 10000
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      let message = errText;
      try {
        const json = JSON.parse(errText);
        message = json.detail || json.message || json.error?.message || errText;
      } catch (e) {}
      const err = new Error(message || `Provider returned HTTP ${res.status}`);
      err.status = res.status;
      throw err;
    }

    const data = await res.json();
    const rawList = data?.data || data?.models || (Array.isArray(data) ? data : []);

    return rawList.map((m) => {
      const id = m.id || m.name || (typeof m === "string" ? m : "unknown-model");
      const name = m.name || id.split("/").pop() || id;
      const context = m.context_length || m.max_position_embeddings || 128000;
      
      const idLower = id.toLowerCase();
      const supportsVision = idLower.includes("vision") || idLower.includes("vl") || idLower.includes("4o") || idLower.includes("claude-3");
      const supportsReasoning = idLower.includes("r1") || idLower.includes("o1") || idLower.includes("o3") || idLower.includes("reasoning") || idLower.includes("thinking");
      const supportsStreaming = true;

      return {
        id,
        name,
        context: typeof context === "number" ? `${Math.round(context / 1000)}k` : "128k",
        supportsVision,
        supportsReasoning,
        supportsStreaming,
        supportsTools: true,
        ownedBy: m.owned_by || m.permission?.[0]?.organization || "provider"
      };
    });
  }

  /**
   * Execute chat completion via POST {baseUrl}/chat/completions
   */
  async chat({ model, messages, temperature = 0.7, top_p = 1, max_tokens = 1024 }) {
    const url = this.getEndpointUrl("/chat/completions");

    const payload = {
      model,
      messages: messages.map((m) => ({
        role: m.role === "assistant" ? "assistant" : m.role === "system" ? "system" : "user",
        content: typeof m.content === "string" ? m.content : String(m.content || m.text || "")
      })),
      temperature,
      top_p,
      max_tokens
    };

    const res = await sendProviderRequest({
      url,
      method: "POST",
      headers: this.getHeaders(),
      body: payload,
      timeoutMs: this.timeoutMs
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      let errorMessage = errText;
      try {
        const errJson = JSON.parse(errText);
        errorMessage = errJson.detail || errJson.message || errJson.error?.message || errText;
      } catch (e) {}

      const err = new Error(errorMessage || `Provider HTTP ${res.status}`);
      err.status = res.status;
      throw err;
    }

    const data = await res.json();
    return {
      provider: this.name,
      id: data.id || `chatcmpl-${Date.now()}`,
      object: data.object || "chat.completion",
      created: data.created || Math.floor(Date.now() / 1000),
      model: data.model || model,
      choices: (data.choices || []).map((c) => ({
        index: c.index || 0,
        message: {
          role: c.message?.role || "assistant",
          content: c.message?.content || ""
        },
        finish_reason: c.finish_reason || "stop"
      })),
      usage: data.usage || null
    };
  }

  /**
   * SSE Stream completion via POST {baseUrl}/chat/completions (stream: true)
   */
  async stream({ model, messages, temperature = 0.7, top_p = 1, max_tokens = 1024 }) {
    const url = this.getEndpointUrl("/chat/completions");

    const payload = {
      model,
      messages: messages.map((m) => ({
        role: m.role === "assistant" ? "assistant" : m.role === "system" ? "system" : "user",
        content: typeof m.content === "string" ? m.content : String(m.content || m.text || "")
      })),
      temperature,
      top_p,
      max_tokens,
      stream: true
    };

    const res = await sendProviderRequest({
      url,
      method: "POST",
      headers: this.getHeaders(),
      body: payload,
      timeoutMs: 300000 // 5 minutes max stream
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      const err = new Error(errText || `Stream HTTP ${res.status}`);
      err.status = res.status;
      throw err;
    }

    return res.body; // Return SSE stream response readable
  }

  /**
   * Health check latency probe
   */
  async health() {
    const startTime = Date.now();
    try {
      const models = await this.getModels();
      const latency = Date.now() - startTime;
      return {
        status: "healthy",
        latencyMs: latency,
        modelCount: models.length,
        reachable: true
      };
    } catch (err) {
      return {
        status: err.status === 401 || err.status === 403 ? "warning" : "offline",
        latencyMs: Date.now() - startTime,
        error: err.message,
        reachable: false
      };
    }
  }
}
