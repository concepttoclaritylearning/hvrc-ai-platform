import React, { createContext, useContext } from "react";
import { ProviderProvider, useProviders } from "@/context/ProviderContext";

export const ModelContext = createContext();

export function ModelProvider({ children }) {
  return (
    <ProviderProvider>
      <ModelContextBridge>{children}</ModelContextBridge>
    </ProviderProvider>
  );
}

function ModelContextBridge({ children }) {
  const {
    providers,
    activeModel,
    selectActiveModel,
    executeCompletion,
    refreshModels
  } = useProviders();

  // Compatibility helper methods for legacy views and Navbar
  const handleSelectModel = (providerId, modelObj) => {
    if (!modelObj) return;
    const provider = providers.find((p) => p.id === providerId) || providers[0];
    selectActiveModel({
      id: modelObj.id,
      name: modelObj.name || modelObj.id,
      providerName: provider?.name || "AI Provider",
      baseUrl: provider?.baseUrl || "",
      encryptedKey: provider?.encryptedKey || ""
    });
  };

  // Helper to return all discovered models for Navbar model dropdown
  const getPinnedModelsList = () => {
    const all = providers.flatMap((p) =>
      (p.models || []).map((m) => ({
        ...m,
        providerId: p.id,
        providerName: p.name
      }))
    );
    if (all.length > 0) return all;
    // Default fallback models if no provider connected yet
    return [
      { id: "meta/llama-3.3-70b-instruct", name: "Llama 3.3 70B", providerName: "NVIDIA NIM" },
      { id: "deepseek-ai/deepseek-r1", name: "DeepSeek R1", providerName: "NVIDIA NIM" },
      { id: "gpt-4o", name: "GPT-4o", providerName: "OpenAI" }
    ];
  };

  const contextValue = {
    activeProviderId: activeModel?.providerName || "universal",
    activeModel,
    selectModel: (model) => selectActiveModel(model),
    handleSelectModel,
    executeCompletion,
    providers,
    modelsMap: {},
    refreshModels,
    getPinnedModelsList
  };

  return <ModelContext.Provider value={contextValue}>{children}</ModelContext.Provider>;
}

export function useModel() {
  const context = useContext(ModelContext);
  if (!context) {
    return useProviders();
  }
  return context;
}
