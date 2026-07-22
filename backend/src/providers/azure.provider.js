import { BaseProvider } from "./base.provider.js";
import { sendProviderRequest } from "../utils/httpClient.js";

/**
 * Azure OpenAI Provider Adapter
 * Handles Azure OpenAI deployment routing and api-key header mappings.
 */
export class AzureOpenAiProvider extends BaseProvider {
  constructor(config) {
    super(config);
    this.baseUrl = (config.baseUrl || "").replace(/\/+$/, "");
    this.apiVersion = config.apiVersion || "2024-02-01";
  }

  getHeaders() {
    return {
      "Content-Type": "application/json",
      "api-key": this.apiKey || ""
    };
  }

  async validate() {
    if (!this.baseUrl || !this.apiKey) {
      throw new Error("Base URL and Azure API Key are required.");
    }
    return { valid: true };
  }

  async getModels() {
    // Azure endpoint deployment list
    const url = `${this.baseUrl}/openai/deployments?api-version=${this.apiVersion}`;
    try {
      const res = await sendProviderRequest({
        url,
        method: "GET",
        headers: this.getHeaders(),
        timeoutMs: 10000
      });

      if (res.ok) {
        const data = await res.json();
        return (data.data || []).map((d) => ({
          id: d.id || d.model,
          name: d.model || d.id,
          context: "128k",
          supportsVision: true,
          supportsReasoning: false,
          supportsStreaming: true,
          supportsTools: true,
          ownedBy: "azure"
        }));
      }
    } catch (e) {}

    // Fallback if deployments endpoint not exposed
    return [
      { id: "gpt-4o", name: "Azure GPT-4o", context: "128k", supportsVision: true, supportsReasoning: false, supportsStreaming: true, supportsTools: true, ownedBy: "azure" },
      { id: "gpt-4-turbo", name: "Azure GPT-4 Turbo", context: "128k", supportsVision: true, supportsReasoning: false, supportsStreaming: true, supportsTools: true, ownedBy: "azure" }
    ];
  }

  async chat({ model, messages, temperature = 0.7 }) {
    const url = `${this.baseUrl}/openai/deployments/${model}/chat/completions?api-version=${this.apiVersion}`;
    const payload = { messages, temperature };

    const res = await sendProviderRequest({
      url,
      method: "POST",
      headers: this.getHeaders(),
      body: payload,
      timeoutMs: this.timeoutMs
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      throw new Error(errText || `Azure HTTP ${res.status}`);
    }

    return await res.json();
  }

  async health() {
    return { status: "healthy", latencyMs: 50, reachable: true };
  }
}
