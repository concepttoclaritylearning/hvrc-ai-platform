import React, { createContext, useState, useEffect, useContext } from "react";
import { SERVERLESS_PROVIDERS, fetchLiveModels, executeServerlessChatCompletion } from "@/utils/serverlessProxy";

export const ModelContext = createContext();

export function ModelProvider({ children }) {
  const [activeProviderId, setActiveProviderId] = useState(
    localStorage.getItem("hvrc_active_provider") || "nvidia"
  );

  const [activeModel, setActiveModel] = useState(() => {
    const saved = localStorage.getItem("hvrc_active_model");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
  });

  const [apiKeys, setApiKeys] = useState(() => {
    const saved = localStorage.getItem("hvrc_api_keys");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return { openrouter: "", groq: "", nvidia: "" };
  });

  const [modelsMap, setModelsMap] = useState({
    openrouter: [],
    groq: [],
    nvidia: []
  });

  // User-selected / pinned favorite model IDs for site-wide dropdowns
  const [pinnedModelIds, setPinnedModelIds] = useState(() => {
    const saved = localStorage.getItem("hvrc_pinned_model_ids");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  const [isFetchingMap, setIsFetchingMap] = useState({
    openrouter: false,
    groq: false,
    nvidia: false
  });

  // Auto-fetch live models on mount for all providers with active keys
  useEffect(() => {
    Object.keys(SERVERLESS_PROVIDERS).forEach(async (providerId) => {
      const key = apiKeys[providerId];
      if (key && key.trim()) {
        setIsFetchingMap((prev) => ({ ...prev, [providerId]: true }));
        const live = await fetchLiveModels(providerId, key.trim());
        setModelsMap((prev) => ({ ...prev, [providerId]: live }));
        setIsFetchingMap((prev) => ({ ...prev, [providerId]: false }));

        if (!activeModel && live.length > 0) {
          handleSelectModel(providerId, live[0]);
        }
      }
    });
  }, []);

  useEffect(() => {
    localStorage.setItem("hvrc_active_provider", activeProviderId);
  }, [activeProviderId]);

  useEffect(() => {
    if (activeModel) {
      localStorage.setItem("hvrc_active_model", JSON.stringify(activeModel));
    } else {
      localStorage.removeItem("hvrc_active_model");
    }
  }, [activeModel]);

  useEffect(() => {
    localStorage.setItem("hvrc_api_keys", JSON.stringify(apiKeys));
  }, [apiKeys]);

  useEffect(() => {
    localStorage.setItem("hvrc_pinned_model_ids", JSON.stringify(pinnedModelIds));
  }, [pinnedModelIds]);

  const handleUpdateApiKey = async (providerId, apiKey) => {
    const newKeys = { ...apiKeys, [providerId]: apiKey };
    setApiKeys(newKeys);

    if (!apiKey || !apiKey.trim()) {
      setModelsMap((prev) => ({ ...prev, [providerId]: [] }));
      return;
    }

    setIsFetchingMap((prev) => ({ ...prev, [providerId]: true }));
    const fetched = await fetchLiveModels(providerId, apiKey.trim());
    setModelsMap((prev) => ({ ...prev, [providerId]: fetched }));
    setIsFetchingMap((prev) => ({ ...prev, [providerId]: false }));

    if (fetched.length > 0) {
      handleSelectModel(providerId, fetched[0]);
    }
  };

  const handleSelectModel = (providerId, modelObj) => {
    const providerName = SERVERLESS_PROVIDERS[providerId]?.name || providerId;
    setActiveProviderId(providerId);
    const selected = {
      id: modelObj.id,
      name: modelObj.name || modelObj.id,
      provider: providerName,
      providerId,
      context: modelObj.context || "128k"
    };
    setActiveModel(selected);

    // Auto-pin model if not pinned
    if (!pinnedModelIds.includes(modelObj.id)) {
      setPinnedModelIds((prev) => [...prev, modelObj.id]);
    }
  };

  const togglePinModel = (modelId) => {
    setPinnedModelIds((prev) =>
      prev.includes(modelId) ? prev.filter((id) => id !== modelId) : [...prev, modelId]
    );
  };

  // Get list of user's selected/pinned models across all providers
  const getPinnedModelsList = () => {
    const allFetched = [
      ...modelsMap.nvidia,
      ...modelsMap.openrouter,
      ...modelsMap.groq
    ];

    if (pinnedModelIds.length > 0) {
      const filtered = allFetched.filter((m) => pinnedModelIds.includes(m.id));
      if (filtered.length > 0) return filtered;
    }

    // Fallback if no specific models pinned yet: show all fetched models
    return allFetched;
  };

  const executeCompletion = async (messages, options = {}) => {
    if (!activeModel) {
      return {
        text: "[HVRC.AI LiteLLM Proxy]: No active model selected. Please enter an API Key and select a model in the Model Hub (/models)."
      };
    }

    const apiKey = apiKeys[activeProviderId] || "";
    return await executeServerlessChatCompletion({
      providerId: activeProviderId,
      apiKey,
      modelId: activeModel.id,
      messages,
      ...options
    });
  };

  return (
    <ModelContext.Provider
      value={{
        activeProviderId,
        activeModel,
        apiKeys,
        modelsMap,
        pinnedModelIds,
        isFetchingMap,
        providers: SERVERLESS_PROVIDERS,
        updateApiKey: handleUpdateApiKey,
        selectModel: handleSelectModel,
        togglePinModel,
        getPinnedModelsList,
        executeCompletion
      }}
    >
      {children}
    </ModelContext.Provider>
  );
}

export function useModel() {
  return useContext(ModelContext);
}
