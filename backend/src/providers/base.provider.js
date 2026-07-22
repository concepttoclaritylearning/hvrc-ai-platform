/**
 * HVRC.AI Universal Provider Interface (BaseProvider)
 * 
 * Defines the contract that every AI Provider implementation MUST follow.
 * Decouples provider-specific networking from the rest of the application.
 */

export class BaseProvider {
  constructor(config = {}) {
    this.name = config.name || "Universal Provider";
    this.baseUrl = config.baseUrl;
    this.apiKey = config.apiKey;
    this.timeoutMs = config.timeoutMs || 120000;
  }

  /**
   * Validate credentials and test connectivity
   */
  async validate() {
    throw new Error("BaseProvider.validate() must be implemented by subclass.");
  }

  /**
   * Discover and fetch live models from GET {baseUrl}/models
   */
  async getModels() {
    throw new Error("BaseProvider.getModels() must be implemented by subclass.");
  }

  /**
   * Execute standard non-streaming chat completion
   */
  async chat({ model, messages, temperature, top_p, max_tokens }) {
    throw new Error("BaseProvider.chat() must be implemented by subclass.");
  }

  /**
   * Execute token-by-token SSE streaming completion
   */
  async stream({ model, messages, temperature, top_p, max_tokens }) {
    throw new Error("BaseProvider.stream() must be implemented by subclass.");
  }

  /**
   * Ping provider endpoint for availability and latency probe
   */
  async health() {
    throw new Error("BaseProvider.health() must be implemented by subclass.");
  }
}
