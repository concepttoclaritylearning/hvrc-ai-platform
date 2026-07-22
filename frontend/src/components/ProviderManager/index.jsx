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
  Lock,
  Play,
  Spinner,
  PaperPlane
} from "@phosphor-icons/react";
import { useProviders } from "@/context/ProviderContext";

// Helper to determine AI Creator Vendor from model ID string
export function getModelVendor(modelId = "") {
  const idLower = modelId.toLowerCase();
  if (idLower.startsWith("meta/") || idLower.includes("llama")) return { name: "Meta", logo: "🦙", color: "bg-[#2F6BFF]/10 text-[#2F6BFF] border-blue-200" };
  if (idLower.startsWith("deepseek-ai/") || idLower.includes("deepseek")) return { name: "DeepSeek", logo: "🐋", color: "bg-cyan-50 text-cyan-700 border-cyan-200" };
  if (idLower.startsWith("nvidia/") || idLower.includes("nemotron")) return { name: "NVIDIA", logo: "🟢", color: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  if (idLower.startsWith("mistralai/") || idLower.includes("mistral") || idLower.includes("mixtral")) return { name: "Mistral", logo: "🌪️", color: "bg-amber-50 text-amber-800 border-amber-200" };
  if (idLower.startsWith("google/") || idLower.includes("gemma")) return { name: "Google", logo: "💎", color: "bg-red-50 text-red-700 border-red-200" };
  if (idLower.startsWith("qwen/") || idLower.includes("qwen")) return { name: "Qwen", logo: "🔮", color: "bg-purple-50 text-purple-700 border-purple-200" };
  if (idLower.startsWith("microsoft/") || idLower.includes("phi")) return { name: "Microsoft", logo: "🪟", color: "bg-blue-50 text-blue-800 border-blue-200" };
  if (idLower.startsWith("01-ai/") || idLower.includes("yi")) return { name: "01.AI Yi", logo: "🎯", color: "bg-emerald-50 text-emerald-800 border-emerald-200" };
  if (idLower.startsWith("databricks/") || idLower.includes("dbrx")) return { name: "Databricks", logo: "🧱", color: "bg-[#1E1E1E] text-stone-200 border-stone-700" };
  if (idLower.includes("gpt") || idLower.includes("o1") || idLower.includes("o3")) return { name: "OpenAI", logo: "⚡", color: "bg-green-50 text-green-800 border-green-200" };

  return { name: "AI Creator", logo: "🤖", color: "bg-stone-100 text-stone-700 border-stone-200" };
}

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
    selectActiveModel,
    executeCompletion
  } = useProviders();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [customName, setCustomName] = useState("");
  const [baseUrlInput, setBaseUrlInput] = useState(templates[0].baseUrl);
  const [apiKeyInput, setApiKeyInput] = useState("");

  // Test Runner State
  const [testingModel, setTestingModel] = useState(null);
  const [testPrompt, setTestPrompt] = useState("Say hello and explain what AI model architecture you are in 2 sentences.");
  const [testResult, setTestResult] = useState(null);
  const [isTestRunning, setIsTestRunning] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProviderFilter, setSelectedProviderFilter] = useState("ALL");
  const [selectedVendorFilter, setSelectedVendorFilter] = useState("ALL");
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
      encryptedKey: p.encryptedKey,
      vendor: getModelVendor(m.id)
    }))
  );

  // Extract unique vendors for vendor filter dropdown
  const uniqueVendors = Array.from(new Set(allDiscoveredModels.map((m) => m.vendor.name)));

  // Filter models based on search query, provider, vendor, and tags
  const filteredModels = allDiscoveredModels.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.vendor.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesProvider =
      selectedProviderFilter === "ALL" || m.providerName === selectedProviderFilter;

    const matchesVendor =
      selectedVendorFilter === "ALL" || m.vendor.name === selectedVendorFilter;

    const matchesReasoning = !filterReasoning || m.supportsReasoning;
    const matchesVision = !filterVision || m.supportsVision;

    return matchesSearch && matchesProvider && matchesVendor && matchesReasoning && matchesVision;
  });

  // Execute live completion test for a specific model card
  const handleRunModelTest = async () => {
    if (!testingModel || !testPrompt.trim()) return;

    setIsTestRunning(true);
    setTestResult(null);

    // Temporarily make model active for test execution
    selectActiveModel(testingModel);

    try {
      const res = await executeCompletion([{ role: "user", content: testPrompt.trim() }]);
      setTestResult(res.text || "Test completion received successfully.");
    } catch (err) {
      setTestResult(`[Test Execution Error]: ${err.message || "Failed to test model."}`);
    } finally {
      setIsTestRunning(false);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Top Banner & Active Model Status */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white p-6 rounded-3xl shadow-xl border border-stone-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#2F6BFF] text-white font-extrabold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full">
              Universal OpenAI Gateway
            </span>
            <span className="text-xs text-stone-400 font-mono">Multi-Provider AI Hub</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Provider &amp; Model Hub</h2>
          <p className="text-xs text-stone-400 mt-1 max-w-xl">
            Search, filter, and test models from Meta, DeepSeek, NVIDIA, Mistral, Google, Qwen, and OpenAI endpoints through a single universal gateway.
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

      {/* 3. Universal Searchable Live Model Selector Across ALL Providers & Vendors */}
      <div className="space-y-4 pt-4 border-t border-stone-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
              <Sparkle className="w-4 h-4 text-[#2F6BFF]" />
              <span>Universal Searchable Model Hub ({filteredModels.length})</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Filter models by AI Provider (NVIDIA, OpenRouter, Groq) or AI Creator (Meta, DeepSeek, Mistral, Google).
            </p>
          </div>

          {/* Universal Search, Provider Dropdown, Vendor Dropdown, & Capability Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Search Input */}
            <div className="relative">
              <MagnifyingGlass className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search all models & creators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs outline-none focus:border-[#2F6BFF] text-stone-800 w-52 font-medium"
              />
            </div>

            {/* Provider Filter Select */}
            <select
              value={selectedProviderFilter}
              onChange={(e) => setSelectedProviderFilter(e.target.value)}
              className="px-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs font-bold text-stone-700 outline-none focus:border-[#2F6BFF]"
            >
              <option value="ALL">🌐 All Providers</option>
              {providers.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>

            {/* Vendor/Creator Filter Select */}
            <select
              value={selectedVendorFilter}
              onChange={(e) => setSelectedVendorFilter(e.target.value)}
              className="px-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs font-bold text-stone-700 outline-none focus:border-[#2F6BFF]"
            >
              <option value="ALL">🤖 All AI Creators</option>
              {uniqueVendors.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>

            {/* Reasoning & Vision Tags */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredModels.map((m, idx) => {
              const isActive = activeModel?.id === m.id && activeModel?.baseUrl === m.baseUrl;
              return (
                <div
                  key={`${m.id}-${idx}`}
                  className={`p-5 rounded-3xl border transition-all flex flex-col justify-between gap-4 ${
                    isActive
                      ? "bg-blue-50/70 border-[#2F6BFF] ring-2 ring-[#2F6BFF]/20 shadow-md"
                      : "bg-white border-stone-200 hover:border-stone-400 hover:shadow-xs"
                  }`}
                >
                  <div className="space-y-2">
                    {/* Provider & Creator Vendor Badges */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${m.vendor.color}`}>
                          <span>{m.vendor.logo}</span>
                          <span>{m.vendor.name}</span>
                        </span>
                        <span className="text-[10px] font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                          {m.providerName}
                        </span>
                      </div>

                      {isActive && (
                        <span className="text-[10px] font-extrabold text-white bg-[#2F6BFF] px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                          <Check className="w-3 h-3" /> Active
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="font-extrabold text-sm text-stone-900 truncate">{m.name}</div>
                      <div className="text-[11px] font-mono text-stone-400 truncate mt-0.5">{m.id}</div>
                    </div>
                  </div>

                  {/* Card Bottom Meta & Actions */}
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <div className="text-[10px] text-stone-500 font-medium">
                      Context: <strong className="text-stone-800">{m.context}</strong>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setTestingModel(m);
                          setTestResult(null);
                        }}
                        className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors"
                        title="Run live completion test"
                      >
                        <Play className="w-3 h-3 text-emerald-600" />
                        <span>Test Model</span>
                      </button>

                      <button
                        onClick={() =>
                          selectActiveModel({
                            id: m.id,
                            name: m.name,
                            providerName: m.providerName,
                            baseUrl: m.baseUrl,
                            encryptedKey: m.encryptedKey
                          })
                        }
                        className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                          isActive
                            ? "bg-[#2F6BFF] text-white"
                            : "bg-stone-900 hover:bg-stone-800 text-white"
                        }`}
                      >
                        {isActive ? "Selected" : "Select"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-stone-50 p-8 rounded-3xl text-center border border-dashed border-stone-200">
            <Info className="w-8 h-8 text-stone-400 mx-auto mb-2" />
            <div className="text-sm font-bold text-stone-700">No models match filters</div>
            <p className="text-xs text-stone-500 mt-1">
              Try resetting your search query or provider/vendor filter selections.
            </p>
          </div>
        )}
      </div>

      {/* 4. Live Model Testing Modal */}
      {testingModel && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-xl w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{testingModel.vendor.logo}</span>
                <div>
                  <h3 className="font-extrabold text-sm text-stone-900">
                    Live Model Test: {testingModel.name}
                  </h3>
                  <div className="text-[11px] text-stone-400 font-mono">{testingModel.id}</div>
                </div>
              </div>
              <button
                onClick={() => setTestingModel(null)}
                className="text-stone-400 hover:text-stone-800 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Test Prompt</label>
                <textarea
                  rows={3}
                  value={testPrompt}
                  onChange={(e) => setTestPrompt(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 outline-none focus:border-[#2F6BFF] text-stone-800 font-medium leading-relaxed resize-none"
                />
              </div>

              {testResult && (
                <div className="p-4 bg-stone-900 text-emerald-400 font-mono rounded-2xl text-xs leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap border border-stone-800 shadow-inner">
                  {testResult}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
              <span className="text-[10px] text-stone-400">Model endpoint: {testingModel.providerName}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTestingModel(null)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 rounded-xl text-xs font-bold hover:bg-stone-200"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleRunModelTest}
                  disabled={isTestRunning}
                  className="px-5 py-2 bg-[#2F6BFF] hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md disabled:opacity-50"
                >
                  {isTestRunning ? (
                    <>
                      <Spinner className="w-3.5 h-3.5 animate-spin" />
                      <span>Testing Endpoint...</span>
                    </>
                  ) : (
                    <>
                      <PaperPlane className="w-3.5 h-3.5" />
                      <span>Run Test Request</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Connection Modal */}
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
