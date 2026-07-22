import React, { useState, useEffect } from "react";
import {
  Cpu,
  Sparkle,
  Check,
  MagnifyingGlass,
  Spinner,
  Key,
  WarningCircle,
  Star
} from "@phosphor-icons/react";
import { useModel } from "@/ModelContext";

export default function ModelHubPage() {
  const {
    providers,
    modelsMap,
    isFetchingMap,
    apiKeys,
    updateApiKey,
    activeModel,
    selectModel,
    pinnedModelIds,
    togglePinModel,
    getPinnedModelsList
  } = useModel();

  const [selectedProviderId, setSelectedProviderId] = useState("nvidia");
  const [modelSearchQuery, setModelSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState("all"); // 'all' or 'pinned'

  const selectedProvider = providers[selectedProviderId];
  const currentKey = apiKeys[selectedProviderId] || "";
  const [keyInput, setKeyInput] = useState(currentKey);

  // Sync keyInput when provider selection changes
  useEffect(() => {
    setKeyInput(apiKeys[selectedProviderId] || "");
  }, [selectedProviderId, apiKeys]);

  const providerList = [providers.nvidia, providers.openrouter, providers.groq];

  const handleKeySave = async (e) => {
    if (e) e.preventDefault();
    if (!keyInput.trim()) return;
    await updateApiKey(selectedProviderId, keyInput.trim());
  };

  const fetchedModels = modelsMap[selectedProviderId] || [];
  const isLoading = isFetchingMap[selectedProviderId];
  const hasKey = !!apiKeys[selectedProviderId] && apiKeys[selectedProviderId].trim() !== "";

  // Filter models based on search query & pinned mode
  const baseList = filterMode === "pinned" ? fetchedModels.filter(m => pinnedModelIds.includes(m.id)) : fetchedModels;
  const filteredModels = baseList.filter(
    (m) =>
      (m.name || m.id).toLowerCase().includes(modelSearchQuery.toLowerCase()) ||
      m.id.toLowerCase().includes(modelSearchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#2F6BFF] text-xs font-semibold mb-2">
            <Cpu className="w-3.5 h-3.5" />
            <span>BYOK Model Hub &amp; Live Model Selector</span>
          </div>
          <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">NVIDIA NIM • OpenRouter • Groq</h1>
          <p className="text-stone-600 text-xs mt-1 max-w-2xl">
            Paste your API key to fetch models live from the provider API. Select favorite models to pin them for site-wide use in Workspace and AI Chat.
          </p>
        </div>

        {/* Selected Active Model Card */}
        <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs flex items-center gap-3">
          <div>
            <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Active Selected Model</div>
            <div className="text-xs font-extrabold text-stone-900 flex items-center gap-1.5 mt-0.5">
              <Sparkle weight="fill" className="w-3.5 h-3.5 text-[#2F6BFF]" />
              <span className="truncate max-w-[200px]">{activeModel?.name || "No Model Selected"}</span>
            </div>
          </div>
          {activeModel && (
            <span className="text-xs font-bold text-[#2F6BFF] bg-blue-50 px-3 py-1 rounded-xl shrink-0">
              {activeModel.provider}
            </span>
          )}
        </div>
      </div>

      {/* 3 Core Provider Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {providerList.map((p) => {
          const pModels = modelsMap[p.id] || [];
          const isSelected = selectedProviderId === p.id;
          const isKeyActive = !!apiKeys[p.id] && apiKeys[p.id].trim() !== "" && pModels.length > 0;

          return (
            <div
              key={p.id}
              onClick={() => {
                setSelectedProviderId(p.id);
                setKeyInput(apiKeys[p.id] || "");
                setModelSearchQuery("");
              }}
              className={`p-6 bg-white rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "border-[#2F6BFF] ring-2 ring-[#2F6BFF]/20 shadow-md"
                  : "border-stone-200/80 shadow-2xs hover:border-stone-300"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{p.logo}</span>
                    <div>
                      <h3 className="text-base font-extrabold text-stone-900">{p.name}</h3>
                      <span className="text-[11px] text-stone-500 font-bold">
                        {pModels.length > 0 ? `${pModels.length} Live Models Fetched` : "Paste API key to fetch"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-500">API Key Status:</span>
                    <span
                      className={`font-bold text-[11px] px-2.5 py-0.5 rounded-full ${
                        isKeyActive
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                          : "bg-amber-50 text-amber-600 border border-amber-200"
                      }`}
                    >
                      {isKeyActive ? "Key Verified & Active" : "Key Needed / Invalid"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-[#2F6BFF] font-bold">
                <span>Configure &amp; Select Models →</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Key Input & Live Model Selection Panel */}
      {selectedProvider && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-stone-100 pb-4 gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{selectedProvider.logo}</span>
              <div>
                <h2 className="text-lg font-bold text-stone-900">{selectedProvider.name} Models &amp; Key Config</h2>
                <p className="text-xs text-stone-500">
                  Paste your API key below. HVRC.AI validates authentication and fetches all models directly from the provider API.
                </p>
              </div>
            </div>

            <a
              href={selectedProvider.docsUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold shrink-0"
            >
              Get API Key ↗
            </a>
          </div>

          {/* Key Input Form */}
          <form onSubmit={handleKeySave} className="space-y-3 max-w-xl">
            <label className="block text-xs font-bold text-stone-700">Paste {selectedProvider.name} API Key</label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Key className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  placeholder={selectedProvider.keyPlaceholder}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs font-mono outline-none text-stone-800 focus:border-[#2F6BFF]"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2.5 bg-[#2F6BFF] text-white text-xs font-bold rounded-xl hover:bg-blue-700 shadow-md flex items-center gap-2 disabled:opacity-50 shrink-0"
              >
                {isLoading && <Spinner className="w-4 h-4 animate-spin" />}
                <span>Validate &amp; Fetch Models</span>
              </button>
            </div>
          </form>

          {/* Validated Status Banners */}
          {hasKey && fetchedModels.length > 0 && !isLoading && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex items-center justify-between text-xs text-emerald-800 font-bold">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>🟢 API Key Authenticated! Successfully fetched {fetchedModels.length} live models from {selectedProvider.name} API.</span>
              </div>
              <span className="text-[11px] text-emerald-700 font-mono">100% Real API Models</span>
            </div>
          )}

          {hasKey && fetchedModels.length === 0 && !isLoading && (
            <div className="p-4 bg-rose-50 border border-rose-200/80 rounded-2xl flex items-center gap-3 text-xs text-rose-800 font-bold">
              <WarningCircle className="w-5 h-5 text-rose-500 shrink-0" />
              <div>
                <span>🔴 API Key Authentication Failed or 0 models returned.</span>
                <div className="text-[11px] text-rose-600 font-normal mt-0.5">
                  Please verify your API key on <code className="font-mono bg-rose-100 px-1 py-0.5 rounded">{selectedProvider.docsUrl}</code> and click Validate &amp; Fetch Models again.
                </div>
              </div>
            </div>
          )}

          {/* Model Selection & Search Bar */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              {/* Filter Tabs */}
              <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-xl">
                <button
                  onClick={() => setFilterMode("all")}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    filterMode === "all" ? "bg-white text-stone-900 shadow-2xs" : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  All Fetched Models ({fetchedModels.length})
                </button>
                <button
                  onClick={() => setFilterMode("pinned")}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                    filterMode === "pinned" ? "bg-white text-[#2F6BFF] shadow-2xs" : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  <Star weight="fill" className="w-3.5 h-3.5 text-amber-500" />
                  <span>Selected Favorites ({pinnedModelIds.length})</span>
                </button>
              </div>

              {/* Model Search Input Bar */}
              <div className="relative w-full md:w-80">
                <MagnifyingGlass className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={modelSearchQuery}
                  onChange={(e) => setModelSearchQuery(e.target.value)}
                  placeholder={`Search ${filteredModels.length} models by name or ID...`}
                  className="w-full pl-9 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-none focus:border-[#2F6BFF]"
                />
              </div>
            </div>

            {/* Loading Spinner State */}
            {isLoading && (
              <div className="p-12 bg-stone-50 rounded-2xl text-center space-y-3 border border-stone-200/80">
                <Spinner className="w-8 h-8 text-[#2F6BFF] animate-spin mx-auto" />
                <p className="text-xs font-bold text-stone-700">Validating key &amp; auto-fetching models from {selectedProvider.name}...</p>
              </div>
            )}

            {/* Models Scrollable Grid Box */}
            {!isLoading && (
              <div className="bg-stone-50/50 p-3 rounded-2xl border border-stone-200/80 max-h-[550px] overflow-y-auto space-y-2">
                {fetchedModels.length === 0 ? (
                  <div className="p-8 text-center text-xs text-stone-500">
                    Paste a valid {selectedProvider.name} API key above and click <strong>Validate &amp; Fetch Models</strong>.
                  </div>
                ) : filteredModels.length === 0 ? (
                  <div className="p-8 text-center text-xs text-stone-500">
                    No models match search query <strong>"{modelSearchQuery}"</strong> or filter.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredModels.map((m) => {
                      const isSelected = activeModel?.id === m.id;
                      const isPinned = pinnedModelIds.includes(m.id);

                      return (
                        <div
                          key={m.id}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                            isSelected
                              ? "bg-blue-50/90 border-[#2F6BFF] text-[#2F6BFF] font-bold shadow-sm"
                              : "bg-white border-stone-200/80 text-stone-800 hover:border-stone-300 hover:shadow-2xs"
                          }`}
                        >
                          <div
                            onClick={() => selectModel(selectedProviderId, m)}
                            className="pr-2 truncate flex-1"
                          >
                            <div className="text-xs font-bold truncate flex items-center gap-1.5">
                              <span>{m.name || m.id}</span>
                              {isSelected && <span className="text-[10px] bg-[#2F6BFF] text-white px-2 py-0.2 rounded-full font-bold">Active</span>}
                            </div>
                            <div className="text-[10px] text-stone-400 font-mono truncate mt-0.5">{m.id}</div>
                          </div>

                          {/* Pin / Select Favorite Star Toggle */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePinModel(m.id);
                            }}
                            className={`p-2 rounded-xl transition-colors ${
                              isPinned ? "bg-amber-50 text-amber-500" : "text-stone-300 hover:text-amber-400 hover:bg-stone-100"
                            }`}
                            title={isPinned ? "Pinned for site-wide use" : "Pin model to favorites"}
                          >
                            <Star weight={isPinned ? "fill" : "regular"} className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
