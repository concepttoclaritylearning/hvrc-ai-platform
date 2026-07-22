import React, { createContext, useContext, useState, useEffect } from "react";
import { encryptSecret, decryptSecret } from "@/utils/crypto";

/**
 * Pre-configured Quick Provider Templates
 * Frontend ONLY knows template metadata (Name & Default Base URL)
 */
export const PROVIDER_TEMPLATES = [
  {
    id: "nvidia",
    name: "NVIDIA NIM",
    baseUrl: "https://integrate.api.nvidia.com/v1",
    logo: "🟢",
    description: "Enterprise GPU microservices for Llama 3.3, DeepSeek R1, and Nemotron.",
    keyPlaceholder: "nvapi-...",
    requiresKey: true
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    baseUrl: "https://openrouter.ai/api/v1",
    logo: "🌐",
    description: "Unified AI gateway for Claude 3.5, GPT-4o, Llama 3, and 200+ models.",
    keyPlaceholder: "sk-or-v1-...",
    requiresKey: true
  },
  {
    id: "groq",
    name: "Groq LPU",
    baseUrl: "https://api.groq.com/openai/v1",
    logo: "🚀",
    description: "Ultra-fast LPU inference engine for Llama 3.1 & Mixtral.",
    keyPlaceholder: "gsk_...",
    requiresKey: true
  },
  {
    id: "openai",
    name: "OpenAI",
    baseUrl: "https://api.openai.com/v1",
    logo: "⚡",
    description: "Official OpenAI endpoint for GPT-4o, o1, o3-mini, and DALL-E 3.",
    keyPlaceholder: "sk-...",
    requiresKey: true
  },
  {
    id: "ollama",
    name: "Ollama Local",
    baseUrl: "http://localhost:11434/v1",
    logo: "🦙",
    description: "Run Llama 3, DeepSeek, and Qwen locally on your machine.",
    keyPlaceholder: "Not required for local Ollama",
    requiresKey: false
  },
  {
    id: "lmstudio",
    name: "LM Studio",
    baseUrl: "http://localhost:1234/v1",
    logo: "💻",
    description: "Local LLM server running GGUF models on desktop.",
    keyPlaceholder: "Not required for local LM Studio",
    requiresKey: false
  },
  {
    id: "litellm",
    name: "LiteLLM Proxy",
    baseUrl: "http://localhost:4000/v1",
    logo: "🔄",
    description: "Self-hosted LiteLLM Proxy Router.",
    keyPlaceholder: "sk-litellm-...",
    requiresKey: false
  },
  {
    id: "vllm",
    name: "vLLM Server",
    baseUrl: "http://localhost:8000/v1",
    logo: "🏎️",
    description: "High-throughput local vLLM serving engine.",
    keyPlaceholder: "Optional API Key",
    requiresKey: false
  },
  {
    id: "localai",
    name: "LocalAI",
    baseUrl: "http://localhost:8080/v1",
    logo: "🏠",
    description: "Self-hosted OpenAI alternative.",
    keyPlaceholder: "Optional API Key",
    requiresKey: false
  },
  {
    id: "custom",
    name: "Custom Endpoint",
    baseUrl: "",
    logo: "⚙️",
    description: "Connect any OpenAI-compatible API endpoint.",
    keyPlaceholder: "API Key if required",
    requiresKey: false
  }
];

const ProviderContext = createContext(null);

export function ProviderProvider({ children }) {
  // Array of connected provider objects stored encrypted in localStorage
  const [providers, setProviders] = useState([]);
  const [activeModel, setActiveModel] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);

  // Load connected providers on mount
  useEffect(() => {
    async function loadSavedProviders() {
      const savedRaw = localStorage.getItem("hvrc_universal_providers");
      if (savedRaw) {
        try {
          const parsed = JSON.parse(savedRaw);
          setProviders(parsed);

          // Restore saved active model
          const savedActive = localStorage.getItem("hvrc_active_model");
          if (savedActive) {
            setActiveModel(JSON.parse(savedActive));
          } else if (parsed.length > 0 && parsed[0].models?.length > 0) {
            const firstM = parsed[0].models[0];
            setActiveModel({
              id: firstM.id,
              name: firstM.name,
              providerName: parsed[0].name,
              baseUrl: parsed[0].baseUrl,
              encryptedKey: parsed[0].encryptedKey
            });
          }
        } catch (e) {
          console.error("Error loading saved providers:", e);
        }
      }
    }
    loadSavedProviders();
  }, []);

  // Save providers list to localStorage
  const persistProviders = (updatedList) => {
    setProviders(updatedList);
    localStorage.setItem("hvrc_universal_providers", JSON.stringify(updatedList));
  };

  // Save active model selection
  const selectActiveModel = (modelObj) => {
    setActiveModel(modelObj);
    localStorage.setItem("hvrc_active_model", JSON.stringify(modelObj));
  };

  /**
   * Connect to an OpenAI-compatible endpoint
   */
  const connectProvider = async ({ templateId, name, baseUrl, apiKey }) => {
    setConnecting(true);
    setError(null);

    try {
      const cleanBaseUrl = (baseUrl || "").trim().replace(/\/+$/, "");
      const cleanKey = (apiKey || "").trim();

      if (!cleanBaseUrl) {
        throw new Error("Base URL is required to connect to provider.");
      }

      // Encrypt API key on client side before transmitting/storing
      const encryptedKey = cleanKey ? await encryptSecret(cleanKey) : "";

      // Send to Universal Backend Gateway endpoint POST /api/providers/connect
      const response = await fetch("/api/providers/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || templateId || "Universal AI Provider",
          baseUrl: cleanBaseUrl,
          apiKey: cleanKey
        })
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.message || "Failed to validate and connect provider.");
      }

      const newProvider = {
        id: `prov-${Date.now()}`,
        templateId: templateId || "custom",
        name: name || data.name || "Universal Provider",
        baseUrl: cleanBaseUrl,
        encryptedKey,
        models: data.models || [],
        modelCount: data.modelCount || 0,
        status: "healthy",
        lastConnected: new Date().toISOString()
      };

      // Filter out duplicate connections to same baseUrl
      const updated = [newProvider, ...providers.filter((p) => p.baseUrl !== cleanBaseUrl)];
      persistProviders(updated);

      // Auto-select first discovered model if no model is active
      if (newProvider.models.length > 0) {
        const firstM = newProvider.models[0];
        selectActiveModel({
          id: firstM.id,
          name: firstM.name,
          providerName: newProvider.name,
          baseUrl: newProvider.baseUrl,
          encryptedKey: newProvider.encryptedKey
        });
      }

      setConnecting(false);
      return { success: true, provider: newProvider };
    } catch (err) {
      setConnecting(false);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  /**
   * Disconnect a provider
   */
  const disconnectProvider = (providerId) => {
    const updated = providers.filter((p) => p.id !== providerId);
    persistProviders(updated);

    if (activeModel?.providerId === providerId) {
      if (updated.length > 0 && updated[0].models?.length > 0) {
        const firstM = updated[0].models[0];
        selectActiveModel({
          id: firstM.id,
          name: firstM.name,
          providerName: updated[0].name,
          baseUrl: updated[0].baseUrl,
          encryptedKey: updated[0].encryptedKey
        });
      } else {
        setActiveModel(null);
        localStorage.removeItem("hvrc_active_model");
      }
    }
  };

  /**
   * Refresh live models for a connected provider
   */
  const refreshModels = async (providerId) => {
    const target = providers.find((p) => p.id === providerId);
    if (!target) return;

    try {
      const plaintextKey = target.encryptedKey ? await decryptSecret(target.encryptedKey) : "";

      const res = await fetch("/api/providers/models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: target.name,
          baseUrl: target.baseUrl,
          apiKey: plaintextKey
        })
      });

      const data = await res.json();
      if (res.ok && data.models) {
        const updated = providers.map((p) =>
          p.id === providerId
            ? { ...p, models: data.models, modelCount: data.models.length, status: "healthy" }
            : p
        );
        persistProviders(updated);
      }
    } catch (err) {
      console.error("Failed to refresh models:", err);
    }
  };

  /**
   * Execute Chat Completion via Universal Gateway
   */
  const executeCompletion = async (messages, options = {}) => {
    if (!activeModel) {
      return {
        text: "No active model selected. Please open the Model Hub (/models) and connect a provider.",
        error: true
      };
    }

    const plaintextKey = activeModel.encryptedKey
      ? await decryptSecret(activeModel.encryptedKey)
      : "";

    try {
      const response = await fetch("/api/providers/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          baseUrl: activeModel.baseUrl,
          apiKey: plaintextKey,
          model: activeModel.id,
          messages,
          temperature: options.temperature || 0.7,
          top_p: options.top_p || 1
        })
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        return {
          text: `[Provider Error]: ${data.message || `HTTP ${response.status} Error`}`,
          error: true
        };
      }

      const content = data.choices?.[0]?.message?.content || "Completion received.";
      return { text: content, error: false };
    } catch (err) {
      return {
        text: `[Gateway Error]: ${err.message || "Failed to reach Universal Gateway."}`,
        error: true
      };
    }
  };

  return (
    <ProviderContext.Provider
      value={{
        providers,
        activeModel,
        connecting,
        error,
        templates: PROVIDER_TEMPLATES,
        connectProvider,
        disconnectProvider,
        refreshModels,
        selectActiveModel,
        executeCompletion
      }}
    >
      {children}
    </ProviderContext.Provider>
  );
}

export function useProviders() {
  const context = useContext(ProviderContext);
  if (!context) {
    throw new Error("useProviders must be used within a ProviderProvider");
  }
  return context;
}
