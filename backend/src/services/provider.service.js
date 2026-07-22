import { OpenAiCompatibleProvider } from "../providers/openai.provider.js";
import { AzureOpenAiProvider } from "../providers/azure.provider.js";
import { logger } from "../utils/logger.js";

/**
 * Universal Provider Gateway Service
 * Manages dynamic provider instances, model discovery, chat completion, SSE streaming, and health checks.
 */
export class ProviderGatewayService {
  /**
   * Instantiate a provider driver instance based on configuration
   */
  static getProviderInstance({ name, baseUrl, apiKey, providerType = "openai-compatible" }) {
    if (!baseUrl) {
      throw new Error("Provider Base URL is required.");
    }

    if (providerType === "azure") {
      return new AzureOpenAiProvider({ name, baseUrl, apiKey });
    }

    return new OpenAiCompatibleProvider({ name, baseUrl, apiKey });
  }

  /**
   * Validate credentials and connect to provider, discovering live models from GET /v1/models
   */
  static async connectProvider({ name, baseUrl, apiKey, providerType }) {
    logger.info(`Validating and connecting Universal Provider`, { name, baseUrl });

    const provider = this.getProviderInstance({ name, baseUrl, apiKey, providerType });
    
    // Execute validation & live model discovery
    const models = await provider.getModels();

    logger.info(`Provider connected successfully. Discovered ${models.length} live models.`, { name, modelCount: models.length });

    return {
      connected: true,
      name: name || "Universal AI Provider",
      baseUrl,
      models,
      modelCount: models.length,
      connectedAt: new Date().toISOString()
    };
  }

  /**
   * Fetch live models dynamically from GET {baseUrl}/models
   */
  static async fetchModels({ name, baseUrl, apiKey, providerType }) {
    const provider = this.getProviderInstance({ name, baseUrl, apiKey, providerType });
    return await provider.getModels();
  }

  /**
   * Execute chat completion
   */
  static async executeChat({ name, baseUrl, apiKey, providerType, model, messages, temperature, top_p, max_tokens }) {
    const provider = this.getProviderInstance({ name, baseUrl, apiKey, providerType });
    return await provider.chat({ model, messages, temperature, top_p, max_tokens });
  }

  /**
   * Execute SSE streaming chat completion
   */
  static async executeStream({ name, baseUrl, apiKey, providerType, model, messages, temperature, top_p, max_tokens }) {
    const provider = this.getProviderInstance({ name, baseUrl, apiKey, providerType });
    return await provider.stream({ model, messages, temperature, top_p, max_tokens });
  }

  /**
   * Probe provider health status and latency
   */
  static async checkHealth({ name, baseUrl, apiKey, providerType }) {
    const provider = this.getProviderInstance({ name, baseUrl, apiKey, providerType });
    return await provider.health();
  }
}
