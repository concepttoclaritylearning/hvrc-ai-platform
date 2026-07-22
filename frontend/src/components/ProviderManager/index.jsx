import React, { useState } from "react";
import {
  Sparkle,
  Plus,
  Check,
  Trash,
  ArrowClockwise,
  MagnifyingGlass,
  CheckCircle,
  WarningCircle,
  XCircle,
  Plugs,
  Gear,
  Lightning,
  Funnel,
  BracketsCurly,
  Info,
  ShieldCheck,
  Lock
} from "@phosphor-icons/react";
import { useProviders } from "@/context/ProviderContext";

export default function ProviderManager() {
  const {
    providers,
    activeModel,
    connecting,
    error,
    templates,
    connectProvider,
    disconnectProvider,
    refreshModels,
    selectActiveModel
  } = useProviders();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [customName, setCustomName] = useState("");
  const [baseUrlInput, setBaseUrlInput] = useState(templates[0].baseUrl);
  const [apiKeyInput, setApiKeyInput] = useState("");

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterReasoning, setFilterReasoning] = useState(false);
  const [filterVision, setFilterVision] = useState(false);

  const handleSelectTemplate = (tpl) => {
    setSelectedTemplate(tpl);
    setCustomName(tpl.name);
    setBaseUrlInput(tpl.baseUrl);
    setApiKeyInput("");
  };

  const handleOpenConnectModal = (tpl) => {
    handleSelectTemplate(tpl || templates[0]);
    setIsModalOpen(true);
  };

  const handleConnectSubmit = async (e) => {
    e.preventDefault();
    const result = await connectProvider({
      templateId: selectedTemplate.id,
      name: customName || selectedTemplate.name,
      baseUrl: baseUrlInput,
      apiKey: apiKeyInput
    });

    if (result.success) {
      setIsModalOpen(false);
      setApiKeyInput("");
    }
  };

  // Consolidate all discovered models from all connected providers
  const allDiscoveredModels = providers.flatMap((p) =>
    (p.models || []).map((m) => ({
      ...m,
      providerId: p.id,
      providerName: p.name,
      baseUrl: p.baseUrl,
      encryptedKey: p.encryptedKey
    }))
  );

  // Filter models based on search query & tags
  const filteredModels = allDiscoveredModels.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.providerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesReasoning = !filterReasoning || m.supportsReasoning;
    const matchesVision = !filterVision || m.supportsVision;
    return matchesSearch && matchesReasoning && matchesVision;
  });

  return (
    <div className="space-y-8 font-sans">
      {/* Top Banner & Active Model Status */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white p-6 rounded-3xl shadow-xl border border-stone-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#2F6BFF] text-white font-extrabold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full">
              Universal OpenAI Gateway
            </span>
            <span className="text-xs text-stone-400 font-mono">Stateless API Engine</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Provider & Model Hub</h2>
          <p className="text-xs text-stone-400 mt-1 max-w-xl">
            Connect any OpenAI-compatible API endpoint. Models are fetched dynamically via live <code className="text-emerald-400">GET /v1/models</code> requests. API Keys are AES-GCM encrypted in browser local storage.
          </p>
        </div>

        {/* Active Selected Model Box */}
        <div className="bg-stone-800/80 border border-stone-700 p-4 rounded-2xl shrink-0 min-w-[260px]">
          <div className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider mb-1">
            Active Selected Model
          </div>
          {activeModel ? (
            <div className="space-y-1">
              <div className="font-extrabold text-sm text-emerald-400 flex items-center gap-1.5 truncate">
                <Sparkle weight="fill" className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate">{activeModel.name}</span>
              </div>
              <div className="text-[11px] text-stone-400 truncate">{activeModel.providerName}</div>
            </div>
          ) : (
            <div className="text-xs text-amber-400 font-medium">No active model selected</div>
          )}
        </div>
      </div>

      {/* 1. Quick Setup Provider Templates */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
            <Plugs className="w-4 h-4 text-[#2F6BFF]" />
            <span>Supported Provider Templates</span>
          </h3>
          <button
            onClick={() => handleOpenConnectModal(templates.find((t) => t.id === "custom"))}
            className="px-3 py-1.5 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800 flex items-center gap-1.5 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Connect Custom Endpoint</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {templates.map((tpl) => {
            const isConnected = providers.some((p) => p.templateId === tpl.id || p.baseUrl === tpl.baseUrl);
            return (
              <div
                key={tpl.id}
                onClick={() => handleOpenConnectModal(tpl)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-36 ${
                  isConnected
                    ? "bg-blue-50/60 border-blue-200 hover:border-blue-400"
                    : "bg-white border-stone-200/80 hover:border-stone-400 hover:shadow-md"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{tpl.logo}</span>
                    {isConnected ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Connected
                      </span>
                    ) : (
                      <span className="text-[10px] text-stone-400 font-medium">Click to setup</span>
                    )}
                  </div>
                  <div className="font-extrabold text-xs text-stone-900">{tpl.name}</div>
                  <div className="text-[11px] text-stone-500 line-clamp-2 mt-1 leading-snug">
                    {tpl.description}
                  </div>
                </div>

                <div className="text-[10px] font-mono text-stone-400 truncate mt-2">
                  {tpl.baseUrl || "Custom Base URL"}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Connected Providers Dashboard */}
      {providers.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-stone-200">
          <h3 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Connected AI Providers ({providers.length})</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {providers.map((p) => (
              <div key={p.id} className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-2xs space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-stone-900">{p.name}</h4>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        ● Healthy
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-stone-400 truncate max-w-[200px] mt-0.5">
                      {p.baseUrl}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => refreshModels(p.id)}
                      className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                      title="Refresh live models"
                    >
                      <ArrowClockwise className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => disconnectProvider(p.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Disconnect provider"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-100 text-stone-600">
                  <span>Discovered Models: <strong className="text-stone-900 font-bold">{p.modelCount}</strong></span>
                  <span className="flex items-center gap-1 text-[11px] text-stone-400">
                    <Lock className="w-3 h-3 text-emerald-600" /> AES-GCM Encrypted
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Universal Searchable Live Model Selector */}
      <div className="space-y-4 pt-4 border-t border-stone-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
              <Sparkle className="w-4 h-4 text-[#2F6BFF]" />
              <span>Live Discovered Models ({filteredModels.length})</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Select an active model for code workspace generation and chat completions.
            </p>
          </div>

          {/* Search & Tag Filter Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <MagnifyingGlass className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs outline-none focus:border-[#2F6BFF] text-stone-800 w-48"
              />
            </div>

            <button
              onClick={() => setFilterReasoning(!filterReasoning)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                filterReasoning
                  ? "bg-amber-50 text-amber-800 border-amber-300"
                  : "bg-white text-stone-600 border-stone-200"
              }`}
            >
              🧠 Reasoning
            </button>

            <button
              onClick={() => setFilterVision(!filterVision)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                filterVision
                  ? "bg-purple-50 text-purple-800 border-purple-300"
                  : "bg-white text-stone-600 border-stone-200"
              }`}
            >
              👁️ Vision
            </button>
          </div>
        </div>

        {/* Model Cards Grid */}
        {filteredModels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredModels.map((m, idx) => {
              const isActive = activeModel?.id === m.id && activeModel?.baseUrl === m.baseUrl;
              return (
                <div
                  key={`${m.id}-${idx}`}
                  onClick={() =>
                    selectActiveModel({
                      id: m.id,
                      name: m.name,
                      providerName: m.providerName,
                      baseUrl: m.baseUrl,
                      encryptedKey: m.encryptedKey
                    })
                  }
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                    isActive
                      ? "bg-blue-50/70 border-[#2F6BFF] ring-2 ring-[#2F6BFF]/20 shadow-sm"
                      : "bg-white border-stone-200 hover:border-stone-400 hover:shadow-xs"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold text-[#2F6BFF] bg-blue-100/60 px-2 py-0.5 rounded-full truncate max-w-[140px]">
                        {m.providerName}
                      </span>
                      {isActive && (
                        <span className="text-[10px] font-extrabold text-white bg-[#2F6BFF] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                          <Check className="w-3 h-3" /> Active
                        </span>
                      )}
                    </div>
                    <div className="font-extrabold text-xs text-stone-900 truncate">{m.name}</div>
                    <div className="text-[10px] font-mono text-stone-400 truncate mt-0.5">{m.id}</div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-[10px] text-stone-500 font-medium">
                    <span>Context: <strong>{m.context}</strong></span>
                    <div className="flex items-center gap-1">
                      {m.supportsReasoning && <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">Reasoning</span>}
                      {m.supportsVision && <span className="bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-bold">Vision</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-stone-50 p-8 rounded-3xl text-center border border-dashed border-stone-200">
            <Info className="w-8 h-8 text-stone-400 mx-auto mb-2" />
            <div className="text-sm font-bold text-stone-700">No models discovered</div>
            <p className="text-xs text-stone-500 mt-1">
              Connect a provider above (NVIDIA, OpenRouter, Groq, OpenAI, or Ollama) to discover live endpoints.
            </p>
          </div>
        )}
      </div>

      {/* 4. Connection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-lg w-full p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedTemplate.logo}</span>
                <div>
                  <h3 className="font-extrabold text-base text-stone-900">
                    Connect {selectedTemplate.name}
                  </h3>
                  <p className="text-xs text-stone-500">Universal OpenAI-Compatible API Connection</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-800 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConnectSubmit} className="space-y-4 text-xs">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-medium flex items-center gap-2">
                  <WarningCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block font-bold text-stone-700 mb-1">Provider Display Name</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. NVIDIA NIM or Local Ollama"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#2F6BFF] text-stone-800 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  API Base URL <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={baseUrlInput}
                  onChange={(e) => setBaseUrlInput(e.target.value)}
                  placeholder="https://integrate.api.nvidia.com/v1"
                  required
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#2F6BFF] text-stone-800 font-mono text-xs"
                />
                <p className="text-[10px] text-stone-400 mt-1">Must end in /v1 or OpenAI-compatible path.</p>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  API Key {selectedTemplate.requiresKey && <span className="text-rose-500">*</span>}
                </label>
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder={selectedTemplate.keyPlaceholder}
                  required={selectedTemplate.requiresKey}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#2F6BFF] text-stone-800 font-mono text-xs"
                />
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 mt-1 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Client-side AES-GCM Encrypted before saving</span>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={connecting}
                  className="px-6 py-2.5 bg-[#2F6BFF] hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-[#2F6BFF]/20 flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {connecting ? (
                    <>
                      <ArrowClockwise className="w-4 h-4 animate-spin" />
                      <span>Discovering Models...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Validate &amp; Connect</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
