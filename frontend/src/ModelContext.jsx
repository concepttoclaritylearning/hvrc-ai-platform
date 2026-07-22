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

  // Compatibility helper methods for legacy views
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

  const contextValue = {
    activeProviderId: activeModel?.providerName || "universal",
    activeModel,
    selectModel: (model) => selectActiveModel(model),
    handleSelectModel,
    executeCompletion,
    providers,
    refreshModels
  };

  return <ModelContext.Provider value={contextValue}>{children}</ModelContext.Provider>;
}

export function useModel() {
  const context = useContext(ModelContext);
  if (!context) {
    // Fallback to useProviders if wrapped inside ProviderProvider
    return useProviders();
  }
  return context;
}
