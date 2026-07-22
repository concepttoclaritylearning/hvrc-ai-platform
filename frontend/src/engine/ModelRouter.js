/**
 * HVRC.AI Smart Model Router Engine
 * Automatically routes prompts to optimal models based on task type, context size, and provider speed.
 */

export const TASK_TYPES = {
  CODING: "coding",
  REASONING: "reasoning",
  FAST_CHAT: "fast_chat",
  VISION: "vision"
};

export class ModelRouter {
  /**
   * Determine the best model ID based on task requirements and available keys.
   */
  static route({ taskType = TASK_TYPES.CODING, activeProviderId, activeModelId, apiKeys = {} }) {
    // If active model is set, default to user's selected active model
    if (activeModelId) {
      return {
        providerId: activeProviderId || "openrouter",
        modelId: activeModelId,
        reason: "User Explicit Active Selection"
      };
    }

    // Auto-routing logic if no active model explicitly set
    if (taskType === TASK_TYPES.CODING) {
      if (apiKeys.nvidia) {
        return { providerId: "nvidia", modelId: "meta/llama-3.3-70b-instruct", reason: "NVIDIA High-Performance Coding" };
      }
      if (apiKeys.groq) {
        return { providerId: "groq", modelId: "llama-3.3-70b-versatile", reason: "Groq Ultra-Fast Coding Inference" };
      }
      return { providerId: "openrouter", modelId: "meta-llama/llama-3.3-70b-instruct:free", reason: "OpenRouter Free Coding Model" };
    }

    if (taskType === TASK_TYPES.REASONING) {
      if (apiKeys.nvidia) {
        return { providerId: "nvidia", modelId: "deepseek-ai/deepseek-r1", reason: "NVIDIA DeepSeek R1 Reasoning" };
      }
      return { providerId: "openrouter", modelId: "deepseek/deepseek-r1:free", reason: "OpenRouter DeepSeek R1 Reasoning" };
    }

    // Default fast chat
    return {
      providerId: "openrouter",
      modelId: "google/gemini-2.5-flash:free",
      reason: "Ultra-fast Low Latency Fallback"
    };
  }
}
