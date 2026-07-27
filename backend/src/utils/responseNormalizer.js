/**
 * HVRC.AI Response Normalizer
 * Converts provider-specific responses into standardized, OpenAI-compatible JSON objects.
 * Guarantees identical output structure across NVIDIA NIM, OpenRouter, and Groq.
 */

// List of verified free public NVIDIA NIM model prefixes
const VERIFIED_FREE_NVIDIA_PREFIXES = [
  "meta/",
  "nvidia/",
  "deepseek-ai/",
  "mistralai/",
  "google/",
  "qwen/",
  "microsoft/",
  "baichuan-inc/"
];

export function normalizeModelList(providerId, rawData) {
  const rawList = rawData?.data || rawData?.models || (Array.isArray(rawData) ? rawData : []);
  let normalizedModels = rawList.map((m) => {
    const id = m.id || m.name || m;
    const name = m.name || id.split("/").pop() || id;
    const context = m.context_length || m.max_position_embeddings || 128000;

    const idLower = id.toLowerCase();
    const isEmbedding = idLower.includes("embed") || idLower.includes("rerank");
    const isSpeech = idLower.includes("parakeet") || idLower.includes("riva") || idLower.includes("tts") || idLower.includes("whisper") || idLower.includes("audio") || idLower.includes("speech");
    const isImage = idLower.includes("edify-image") || idLower.includes("sdxl") || idLower.includes("flux") || idLower.includes("dall-e") || idLower.includes("stable-diffusion") || idLower.includes("image");
    const is3D = idLower.includes("edify-3d") || idLower.includes("mesh") || idLower.includes("3d");
    const isGuardrail = idLower.includes("guard") || idLower.includes("safety");
    const isChat = !isEmbedding && !isSpeech && !isImage && !is3D && !isGuardrail;

    const type = m.type || (isEmbedding ? "embedding" : isImage ? "image" : is3D ? "3d" : isSpeech ? "speech" : "chat");

    // Check if model is a free public endpoint
    const isFreePublic = providerId === "nvidia"
      ? VERIFIED_FREE_NVIDIA_PREFIXES.some((prefix) => idLower.startsWith(prefix))
      : idLower.includes("free");

    return {
      id,
      name,
      context,
      type,
      isChat,
      isEmbedding,
      isSpeech,
      isImage,
      is3D,
      isGuardrail,
      isFree: isFreePublic,
      badge: isFreePublic ? "Free Public Endpoint" : "Account Model"
    };
  });

  // If provider is NVIDIA, filter to show FREE PUBLIC endpoints only
  if (providerId === "nvidia") {
    const freeOnly = normalizedModels.filter((m) => m.isFree);
    if (freeOnly.length > 0) {
      normalizedModels = freeOnly;
    }
  }

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
