/**
 * HVRC.AI Response Normalizer
 * Converts provider-specific responses into standardized, OpenAI-compatible JSON objects.
 * Guarantees identical output structure across NVIDIA NIM, OpenRouter, and Groq.
 */

export function normalizeModelList(providerId, rawData) {
  const rawList = rawData?.data || rawData?.models || (Array.isArray(rawData) ? rawData : []);

  const normalizedModels = rawList.map((m) => {
    const id = m.id || m.name || m;
    const name = m.name || id.split("/").pop() || id;
    const context = m.context_length || m.max_position_embeddings || 128000;
    const type = m.type || (id.includes("embed") ? "embedding" : "chat");

    return {
      id,
      name,
      context,
      type
    };
  });

  return {
    provider: providerId,
    models: normalizedModels
  };
}

export function normalizeChatCompletion(providerId, rawData) {
  return {
    provider: providerId,
    id: rawData.id || `chatcmpl-${Date.now()}`,
    object: rawData.object || "chat.completion",
    created: rawData.created || Math.floor(Date.now() / 1000),
    model: rawData.model,
    choices: (rawData.choices || []).map((c) => ({
      index: c.index || 0,
      message: {
        role: c.message?.role || "assistant",
        content: c.message?.content || ""
      },
      finish_reason: c.finish_reason || "stop"
    })),
    usage: rawData.usage || null
  };
}
