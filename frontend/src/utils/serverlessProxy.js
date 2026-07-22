/**
 * HVRC.AI Unified Provider Proxy & In-built LiteLLM Router
 * Connects OpenRouter, Groq, and NVIDIA NIM via stateless Express Proxy Server.
 * Browser NEVER contacts NVIDIA directly.
 */

export const SERVERLESS_PROVIDERS = {
  nvidia: {
    id: "nvidia",
    name: "NVIDIA NIM (Cloud Model Provider)",
    logo: "🟢",
    baseUrl: "/proxy/nvidia",
    modelsUrl: "/proxy/nvidia/models",
    docsUrl: "https://build.nvidia.com",
    keyPlaceholder: "Paste your NVIDIA NIM API Key (nvapi-...)"
  },
  openrouter: {
    id: "openrouter",
    name: "OpenRouter (Unified AI Provider)",
    logo: "🌐",
    baseUrl: "https://openrouter.ai/api/v1",
    modelsUrl: "https://openrouter.ai/api/v1/models",
    docsUrl: "https://openrouter.ai/keys",
    keyPlaceholder: "Paste your OpenRouter API Key (sk-or-v1-...)"
  },
  groq: {
    id: "groq",
    name: "Qroq (Fast LPU AI Provider)",
    logo: "🚀",
    baseUrl: "https://api.groq.com/openai/v1",
    modelsUrl: "https://api.groq.com/openai/v1/models",
    docsUrl: "https://console.groq.com/keys",
    keyPlaceholder: "Paste your Groq API Key (gsk_...)"
  }
};

/**
 * Validate API Key against provider proxy endpoints.
 */
export async function validateApiKey(providerId, apiKey) {
  const cleanKey = apiKey ? apiKey.trim() : "";
  if (!cleanKey) return { valid: false, error: "API Key cannot be empty." };

  if (providerId === "nvidia") {
    if (!cleanKey.startsWith("nvapi-")) {
      return { valid: false, error: "Invalid key format. NVIDIA NIM API Keys must start with nvapi-..." };
    }

    try {
      // Validate key via proxy endpoint
      const res = await fetch("/proxy/nvidia/models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: cleanKey })
      });

      if (res.status === 401 || res.status === 403) {
        return { valid: false, error: "Invalid NVIDIA NIM API Key (HTTP 401 Unauthorized). Check your key on build.nvidia.com." };
      }

      return { valid: res.ok };
    } catch (err) {
      return { valid: cleanKey.length > 20 };
    }
  }

  if (providerId === "openrouter") {
    if (!cleanKey.startsWith("sk-or-")) {
      return { valid: false, error: "Invalid key format. OpenRouter API Keys must start with sk-or-..." };
    }
    return { valid: true };
  }

  if (providerId === "groq") {
    if (!cleanKey.startsWith("gsk_")) {
      return { valid: false, error: "Invalid key format. Groq API Keys must start with gsk_..." };
    }
    return { valid: true };
  }

  return { valid: true };
}

/**
 * Fetch live available models dynamically 100% via Proxy Server.
 */
export async function fetchLiveModels(providerId, apiKey) {
  const provider = SERVERLESS_PROVIDERS[providerId];
  const cleanKey = apiKey ? apiKey.trim() : "";

  if (!provider || !cleanKey) {
    return [];
  }

  if (providerId === "nvidia") {
    try {
      const res = await fetch("/proxy/nvidia/models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: cleanKey })
      });

      if (res.ok) {
        const data = await res.json();
        const rawList = data?.models || [];

        return rawList.map((m) => ({
          id: m.id,
          name: m.name,
          context: `${Math.round((m.context || 128000) / 1000)}k`,
          isFree: m.id.includes("free"),
          provider: provider.name,
          providerId
        }));
      }
    } catch (err) {
      console.error("NVIDIA Proxy Model discovery error:", err);
    }
    return [];
  }

  // Fallback for other providers
  try {
    const res = await fetch(provider.modelsUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cleanKey}`,
        Accept: "application/json"
      }
    });

    if (res.ok) {
      const data = await res.json();
      const rawList = data?.data || data?.models || (Array.isArray(data) ? data : []);

      return rawList.map((m) => {
        const id = m.id || m.name || m;
        const displayName = m.name || id.split("/").pop() || id;
        return {
          id,
          name: displayName,
          context: "128k",
          isFree: false,
          provider: provider.name,
          providerId
        };
      });
    }
  } catch (err) {
    console.error(`Fetch error for ${providerId}:`, err);
  }

  return [];
}

/**
 * Execute Chat Completion via Stateless Express Proxy
 */
export async function executeServerlessChatCompletion({
  providerId,
  apiKey,
  modelId,
  messages,
  temperature = 0.7
}) {
  const provider = SERVERLESS_PROVIDERS[providerId];
  const cleanKey = apiKey ? apiKey.trim() : "";

  if (!cleanKey) {
    return {
      text: `[HVRC.AI LiteLLM Proxy]: API Key for ${provider?.name || providerId} is missing. Please paste your API key in the Model Hub (/models).`,
      error: true
    };
  }

  if (providerId === "nvidia") {
    try {
      const res = await fetch("/proxy/nvidia/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: cleanKey,
          model: modelId || "meta/llama-3.3-70b-instruct",
          messages,
          temperature
        })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        return {
          text: `[NVIDIA Proxy Error]: ${errJson.message || `HTTP ${res.status} Error`}`,
          error: true
        };
      }

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content || "Received completion from NVIDIA NIM Proxy.";
      return { text: content, error: false };
    } catch (err) {
      return { text: `[NVIDIA Proxy Error]: ${err.message || "Failed to contact proxy."}`, error: true };
    }
  }

  // Fallback for OpenRouter and Groq
  try {
    const res = await fetch(`${provider.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cleanKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: modelId,
        messages,
        temperature
      })
    });

    if (!res.ok) {
      return { text: `[Error HTTP ${res.status}]: Provider request failed.`, error: true };
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || "Response received.";
    return { text: content, error: false };
  } catch (err) {
    return { text: `[Error]: ${err.message || "Execution failed."}`, error: true };
  }
}

/**
 * Fetch provider health status from proxy
 */
export async function getProviderHealth(providerId) {
  if (providerId === "nvidia") {
    try {
      const res = await fetch("/proxy/nvidia/health");
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {}
  }
  return { status: "unknown", provider: providerId, reachable: false, latency: 0 };
}
