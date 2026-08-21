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
import { useCapability } from "@/context/CapabilityContext";

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

// Helper to determine Free vs Paid Pricing Model
export function getModelPricing(model, providerId = "") {
  const idLower = (model?.id || "").toLowerCase();
  const nameLower = (model?.name || "").toLowerCase();
  const pLower = (providerId || model?.providerId || "").toLowerCase();
  const pNameLower = (model?.providerName || "").toLowerCase();

  if (pLower.includes("nvidia") || pNameLower.includes("nvidia") || idLower.includes("nemotron")) {
    return { type: "FREE", label: "🎁 Free / Open NIM", color: "bg-emerald-50 text-emerald-800 border-emerald-300 font-bold" };
  }
  if (pLower.includes("openrouter") || pNameLower.includes("openrouter")) {
    if (idLower.endsWith(":free") || nameLower.includes("free") || idLower.includes("free")) {
      return { type: "FREE", label: "🎁 Free Open Tier", color: "bg-emerald-50 text-emerald-800 border-emerald-300 font-bold" };
    }
    return { type: "PAID", label: "💳 Paid / Commercial", color: "bg-amber-50 text-amber-800 border-amber-300 font-bold" };
  }
  if (pLower.includes("ollama") || pLower.includes("lmstudio") || pLower.includes("vllm") || pLower.includes("local") || pNameLower.includes("local") || pNameLower.includes("native")) {
    return { type: "FREE", label: "💻 Local / 0-Cost", color: "bg-cyan-50 text-cyan-800 border-cyan-300 font-bold" };
  }
  if (pLower.includes("openai") || pLower.includes("anthropic") || pLower.includes("azure")) {
    return { type: "PAID", label: "💳 Commercial API", color: "bg-purple-50 text-purple-800 border-purple-300 font-bold" };
  }
  return { type: "FREE", label: "🎁 Open Access", color: "bg-emerald-50 text-emerald-800 border-emerald-200 font-medium" };
}

// Helper to determine OS LLM Role / Type
export function getModelOsType(modelId = "") {
  const idLower = modelId.toLowerCase();
  if (idLower.includes("r1") || idLower.includes("o1") || idLower.includes("o3") || idLower.includes("reason") || idLower.includes("math") || idLower.includes("deepseek-r1")) {
    return { type: "REASONING", label: "🧠 Reasoning & Math LLM", color: "bg-blue-50 text-blue-700 border-blue-200" };
  }
  if (idLower.includes("coder") || idLower.includes("code") || idLower.includes("starcoder") || idLower.includes("dbrx") || idLower.includes("llama-3.3") || idLower.includes("sonnet") || idLower.includes("claude-3.5")) {
    return { type: "CODING", label: "💻 Code & Co-Working LLM", color: "bg-indigo-50 text-indigo-700 border-indigo-200" };
  }
  if (idLower.includes("nemotron") || idLower.includes("mixtral") || idLower.includes("mistral-large") || idLower.includes("gpt-4") || idLower.includes("llama-3.1-405b")) {
    return { type: "FOUNDATION", label: "🏛️ Enterprise Foundation LLM", color: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  }
  if (idLower.includes("flash") || idLower.includes("mini") || idLower.includes("8b") || idLower.includes("turbo") || idLower.includes("haiku")) {
    return { type: "FAST", label: "⚡ Fast Execution LLM", color: "bg-amber-50 text-amber-700 border-amber-200" };
  }
  return { type: "GENERAL", label: "✨ General Purpose LLM", color: "bg-stone-100 text-stone-700 border-stone-200" };
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

  const { capabilityMap, assignCapability, getModelForCapability, capabilitySlots } = useCapability();

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

  // Search & Filter State in Catalog
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProviderFilter, setSelectedProviderFilter] = useState("ALL");
  const [selectedVendorFilter, setSelectedVendorFilter] = useState("ALL");
  const [selectedPricingFilter, setSelectedPricingFilter] = useState("ALL"); // "ALL" | "FREE" | "PAID"
  const [selectedOsTypeFilter, setSelectedOsTypeFilter] = useState("ALL"); // "ALL" | "REASONING" | "CODING" | "FOUNDATION" | "VISION" | "GENERAL"
  const [filterReasoning, setFilterReasoning] = useState(false);
  const [filterVision, setFilterVision] = useState(false);

  // Capability Assignment / Swapping Modal State
  const [assigningModel, setAssigningModel] = useState(null); // When user clicks "Assign Role" from Catalog
  const [swapSlotId, setSwapSlotId] = useState(null); // When user clicks "Swap Model" from Selected Hub
  const [swapSearchQuery, setSwapSearchQuery] = useState("");

  // Toast notification
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

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
      showToast(`✅ Successfully connected ${customName || selectedTemplate.name}!`);
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
      vendor: getModelVendor(m.id),
      pricing: getModelPricing(m, p.id),
      osType: getModelOsType(m.id)
    }))
  );

  // Extract unique vendors for vendor filter dropdown
  const uniqueVendors = Array.from(new Set(allDiscoveredModels.map((m) => m.vendor.name)));

  // Filter models based on search query, provider, vendor, pricing, OS type, and tags
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

    const matchesPricing =
      selectedPricingFilter === "ALL" || m.pricing.type === selectedPricingFilter;

    const matchesOsType =
      selectedOsTypeFilter === "ALL" || m.osType.type === selectedOsTypeFilter;

    const matchesReasoning = !filterReasoning || m.supportsReasoning || m.osType.type === "REASONING";
    const matchesVision = !filterVision || m.supportsVision || m.osType.type === "VISION";

    return (
      matchesSearch &&
      matchesProvider &&
      matchesVendor &&
      matchesPricing &&
      matchesOsType &&
      matchesReasoning &&
      matchesVision
    );
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

  // Group Capability Slots into 2 intuitive sections for Tab 2
  const sectionIntelligence = capabilitySlots.filter((s) => ["reasoningModel", "codingModel", "reviewingModel", "planningModel"].includes(s.id));
  const sectionEngineering = capabilitySlots.filter((s) => ["debuggingModel", "testingModel", "documentationModel", "researchModel", "backgroundModel"].includes(s.id));

  return (
    <div className="space-y-8 font-sans pb-16 relative">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-stone-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Sparkle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-extrabold">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner & Active Model Status */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white p-6 md:p-8 rounded-3xl shadow-xl border border-stone-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <span className="bg-[#2F6BFF] text-white font-extrabold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-2xs">
              ⚡ Universal AI OS Gateway v3.0
            </span>
            <span className="text-xs text-stone-400 font-mono bg-stone-800/80 px-2.5 py-0.5 rounded-md border border-stone-700">
              Multi-Provider &amp; Role Synchronizer
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">AI Models &amp; Capability Hub</h2>
          <p className="text-xs md:text-sm text-stone-300 mt-1.5 max-w-2xl leading-relaxed">
            Search across 460+ live endpoints (NVIDIA NIM, OpenRouter, Groq, Ollama) and configure specialized LLM assignments for Deep Reasoning, Pair-Programming, Code Review, Architecture, and Autonomous Supervision.
          </p>
        </div>

        {/* Active Workspace General Model Box */}
        <div className="bg-stone-800/90 border border-stone-700 p-4.5 rounded-2xl shrink-0 min-w-[270px] shadow-lg">
          <div className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span>🌐 General Workspace Active</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          {activeModel ? (
            <div className="space-y-1.5">
              <div className="font-extrabold text-sm text-emerald-400 flex items-center gap-1.5 truncate">
                <Sparkle weight="fill" className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate">{activeModel.name}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-stone-400">
                <span className="truncate">{activeModel.providerName}</span>
                <span className="text-[10px] bg-stone-700 px-2 py-0.5 rounded text-stone-300 font-mono">
                  {activeModel.context || "128k"}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-xs text-amber-400 font-medium">No general model selected</div>
          )}
        </div>
      </div>

      {/* Supported Provider Templates & Connected Providers (Top Section) */}
      <div className="space-y-8 animate-in fade-in duration-200">
          {/* Supported Provider Templates */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
                <Plugs className="w-4 h-4 text-[#2F6BFF]" />
                <span>Supported Provider Templates</span>
              </h3>
              <button
                onClick={() => handleOpenConnectModal(templates.find((t) => t.id === "custom"))}
                className="px-3.5 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
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
                        ? "bg-blue-50/70 border-blue-300 hover:border-blue-500 shadow-2xs"
                        : "bg-white border-stone-200/90 hover:border-stone-400 hover:shadow-md"
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

          {/* Connected Providers Dashboard */}
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
                          className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                          title="Refresh live models"
                        >
                          <ArrowClockwise className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => disconnectProvider(p.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
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
      </div>

      {/* SIDE-BY-SIDE MODELS HUB & SELECTED ROLES HUB */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start pt-6 border-t border-stone-200">
        {/* LEFT COLUMN: UNIVERSAL SEARCH CATALOG (7 Cols on desktop) */}
        <div className="xl:col-span-7 space-y-6">
          {/* Universal Searchable Model Selector Across ALL Providers & Vendors */}
          <div className="space-y-5">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs">
              <div>
                <h3 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
                  <Sparkle className="w-5 h-5 text-[#2F6BFF]" />
                  <span>Universal Searchable Catalog ({filteredModels.length} models)</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Filter by Free vs Paid, AI Creator (Meta, DeepSeek, NVIDIA), or OS LLM Type (Reasoning, Coding, Enterprise).
                </p>
              </div>

              {/* Multi-Dimensional Filter Bar */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Search Input */}
                <div className="relative">
                  <MagnifyingGlass className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search model, vendor, pricing..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-none focus:border-[#2F6BFF] text-stone-800 w-56 font-medium"
                  />
                </div>

                {/* Free vs Paid Filter */}
                <select
                  value={selectedPricingFilter}
                  onChange={(e) => setSelectedPricingFilter(e.target.value)}
                  className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 outline-none focus:border-[#2F6BFF] cursor-pointer"
                >
                  <option value="ALL">💰 All Pricing Tiers</option>
                  <option value="FREE">🎁 Free / Open NIM Only</option>
                  <option value="PAID">💳 Paid Commercial Only</option>
                </select>

                {/* OS LLM Type Filter */}
                <select
                  value={selectedOsTypeFilter}
                  onChange={(e) => setSelectedOsTypeFilter(e.target.value)}
                  className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 outline-none focus:border-[#2F6BFF] cursor-pointer"
                >
                  <option value="ALL">🧠 All OS LLM Types</option>
                  <option value="REASONING">🧠 Reasoning &amp; Deep Thinking</option>
                  <option value="CODING">💻 Code &amp; Co-Working Engine</option>
                  <option value="FOUNDATION">🏛️ Foundation Enterprise</option>
                  <option value="FAST">⚡ Fast Execution &amp; Speed</option>
                  <option value="GENERAL">✨ General Purpose</option>
                </select>

                {/* Provider Filter Select */}
                <select
                  value={selectedProviderFilter}
                  onChange={(e) => setSelectedProviderFilter(e.target.value)}
                  className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 outline-none focus:border-[#2F6BFF] cursor-pointer"
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
                  className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 outline-none focus:border-[#2F6BFF] cursor-pointer"
                >
                  <option value="ALL">🤖 All AI Creators</option>
                  {uniqueVendors.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Model Cards Grid */}
            {filteredModels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
                {filteredModels.map((m, idx) => {
                  const isActive = activeModel?.id === m.id && activeModel?.baseUrl === m.baseUrl;
                  return (
                    <div
                      key={`${m.id}-${idx}`}
                      className={`p-5 rounded-3xl border transition-all flex flex-col justify-between gap-4 ${
                        isActive
                          ? "bg-blue-50/70 border-[#2F6BFF] ring-2 ring-[#2F6BFF]/20 shadow-md"
                          : "bg-white border-stone-200/90 hover:border-stone-400 hover:shadow-md"
                      }`}
                    >
                      <div className="space-y-3">
                        {/* Provider, Vendor, Pricing & OS Type Badges */}
                        <div className="flex items-center justify-between gap-1 flex-wrap">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${m.vendor.color}`}>
                              <span>{m.vendor.logo}</span>
                              <span>{m.vendor.name}</span>
                            </span>
                            <span className={`text-[10px] px-2.5 py-0.5 rounded-full border ${m.pricing.color}`}>
                              {m.pricing.label}
                            </span>
                          </div>

                          {isActive && (
                            <span className="text-[10px] font-extrabold text-white bg-[#2F6BFF] px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                              <Check className="w-3 h-3" /> Active
                            </span>
                          )}
                        </div>

                        {/* Model Title and OS Type Role Badge */}
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${m.osType.color}`}>
                              {m.osType.label}
                            </span>
                            <span className="text-[10px] font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                              {m.providerName}
                            </span>
                          </div>
                          <div className="font-extrabold text-base text-stone-900 truncate" title={m.name}>
                            {m.name}
                          </div>
                          <div className="text-[11px] font-mono text-stone-400 truncate mt-0.5" title={m.id}>
                            {m.id}
                          </div>
                        </div>
                      </div>

                      {/* Card Bottom Meta & Quick Actions */}
                      <div className="pt-3.5 border-t border-stone-100 flex items-center justify-between gap-2 flex-wrap">
                        <div className="text-[10px] text-stone-500 font-medium">
                          Context: <strong className="text-stone-800">{m.context || "128k"}</strong>
                        </div>

                        <div className="flex items-center gap-1.5 flex-wrap">
                          {/* 1. Test Button */}
                          <button
                            onClick={() => {
                              setTestingModel(m);
                              setTestResult(null);
                            }}
                            className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                            title="Run live completion test"
                          >
                            <Play className="w-3 h-3 text-emerald-600" />
                            <span>Test</span>
                          </button>

                          {/* 2. Assign to Role Button */}
                          <button
                            onClick={() => setAssigningModel(m)}
                            className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#2F6BFF] border border-blue-200 rounded-xl text-[11px] font-extrabold flex items-center gap-1 transition-colors cursor-pointer"
                            title="Assign this model to an OS Capability Role (Main Reasoning, Co-Working, etc.)"
                          >
                            <span>📌</span>
                            <span>Assign Role</span>
                          </button>

                          {/* 3. Select Active Button */}
                          <button
                            onClick={() => {
                              selectActiveModel({
                                id: m.id,
                                name: m.name,
                                providerName: m.providerName,
                                baseUrl: m.baseUrl,
                                encryptedKey: m.encryptedKey
                              });
                              showToast(`✅ Set ${m.name} as General Workspace Active model!`);
                            }}
                            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                              isActive
                                ? "bg-[#2F6BFF] text-white shadow-xs"
                                : "bg-stone-900 hover:bg-stone-800 text-white"
                            }`}
                          >
                            {isActive ? "General Active" : "Set Active"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-stone-50 p-12 rounded-3xl text-center border border-dashed border-stone-200">
                <Info className="w-10 h-10 text-stone-400 mx-auto mb-2" />
                <div className="text-base font-bold text-stone-700">No models match your current filters</div>
                <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
                  Try resetting your pricing tier, OS LLM type, or provider/vendor filter selections to see all 460+ available models.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedProviderFilter("ALL");
                    setSelectedVendorFilter("ALL");
                    setSelectedPricingFilter("ALL");
                    setSelectedOsTypeFilter("ALL");
                    setFilterReasoning(false);
                    setFilterVision(false);
                  }}
                  className="mt-4 px-4 py-2 bg-[#2F6BFF] text-white text-xs font-bold rounded-xl shadow-sm hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: OS SELECTED CAPABILITY HUB (5 Cols on desktop) */}
        <div className="xl:col-span-5 space-y-8 bg-stone-50/80 p-6 rounded-3xl border border-stone-200/80 sticky top-6 max-h-[90vh] overflow-y-auto">
          <div className="bg-blue-50/70 border border-blue-200/80 p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-extrabold text-stone-900 flex items-center gap-2">
                <span>🎯</span>
                <span>OS Capability &amp; Role Synchronizer</span>
              </h3>
              <p className="text-xs md:text-sm text-stone-600 mt-1 max-w-3xl">
                Configure which exact LLM powers each of your 14 OS workflows. You can designate open Free NIM models for Background Supervision &amp; Diagnostics while reserving commercial Reasoning models for architectural planning and co-working coding!
              </p>
            </div>
            <div className="px-3.5 py-2 bg-emerald-100 text-emerald-800 rounded-xl font-extrabold text-xs flex items-center gap-1.5 shrink-0 border border-emerald-300">
              <span>← Assign from Left Catalog</span>
            </div>
          </div>

          {/* Section A: Core Intelligence & Reasoning Workflows */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
              <span className="text-lg">🧠</span>
              <h4 className="font-extrabold text-base text-stone-900">Core Intelligence &amp; Reasoning Workflows</h4>
              <span className="text-xs text-stone-400 font-mono">(Main Reasoning, Coding Co-Worker, Reviewer, Planning)</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {sectionIntelligence.map((slot) => {
                const assigned = capabilityMap[slot.id];
                const activeFallback = activeModel || { id: "meta/llama-3.3-70b-instruct", name: "Llama 3.3 70B", providerName: "NVIDIA NIM" };
                const currentModel = assigned || activeFallback;
                const pricing = getModelPricing(currentModel, currentModel.providerName);
                const osType = getModelOsType(currentModel.id);

                return (
                  <div
                    key={slot.id}
                    className={`p-6 rounded-3xl border transition-all flex flex-col justify-between gap-4 ${
                      assigned
                        ? "bg-white border-blue-200 shadow-sm ring-1 ring-blue-500/10"
                        : "bg-stone-50/70 border-stone-200/80"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl p-2 bg-stone-100 rounded-2xl">{slot.icon}</span>
                          <div>
                            <div className="font-extrabold text-base text-stone-900">{slot.name}</div>
                            <div className="text-[11px] text-stone-500 font-medium">Slot ID: <span className="font-mono text-stone-700">{slot.id}</span></div>
                          </div>
                        </div>

                        {assigned ? (
                          <span className="text-[10px] font-extrabold bg-blue-100 text-[#2F6BFF] px-2.5 py-1 rounded-full flex items-center gap-1">
                            <Check className="w-3 h-3" /> Designated Role
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full">
                            Workspace Fallback
                          </span>
                        )}
                      </div>

                      {/* Model Card Box inside Role Slot */}
                      <div className="bg-stone-50/90 border border-stone-200/80 p-4 rounded-2xl space-y-2.5">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${pricing.color}`}>
                            {pricing.label}
                          </span>
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${osType.color}`}>
                            {osType.label}
                          </span>
                        </div>

                        <div>
                          <div className="font-extrabold text-sm text-stone-900 truncate" title={currentModel.name}>
                            {currentModel.name}
                          </div>
                          <div className="text-[11px] font-mono text-stone-500 truncate mt-0.5" title={currentModel.id}>
                            {currentModel.id} • <span className="font-bold text-stone-700">{currentModel.providerName || "NVIDIA NIM"}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Slot Actions */}
                    <div className="pt-2 flex items-center justify-end gap-2 flex-wrap">
                      <button
                        onClick={() => {
                          setTestingModel(currentModel);
                          setTestResult(null);
                        }}
                        className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        title="Test completion with this designated model"
                      >
                        <Play className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Test Role</span>
                      </button>

                      <button
                        onClick={() => {
                          setSwapSlotId(slot.id);
                          setSwapSearchQuery("");
                        }}
                        className="px-3.5 py-1.5 bg-[#2F6BFF] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                        title="Swap or select a different LLM for this workflow role"
                      >
                        <span>🔄</span>
                        <span>Swap LLM Model</span>
                      </button>

                      {assigned && (
                        <button
                          onClick={() => {
                            assignCapability(slot.id, null);
                            showToast(`🔄 Reset ${slot.name} to general workspace fallback model.`);
                          }}
                          className="px-2.5 py-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                          title="Reset to workspace fallback"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section B: Engineering, Diagnostics & Supervision */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
              <span className="text-lg">🐛</span>
              <h4 className="font-extrabold text-base text-stone-900">Engineering, Diagnostics &amp; Supervision</h4>
              <span className="text-xs text-stone-400 font-mono">(Debugging, Automated Testing, Docs, Research, Background Daemon)</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {sectionEngineering.map((slot) => {
                const assigned = capabilityMap[slot.id];
                const activeFallback = activeModel || { id: "meta/llama-3.3-70b-instruct", name: "Llama 3.3 70B", providerName: "NVIDIA NIM" };
                const currentModel = assigned || activeFallback;
                const pricing = getModelPricing(currentModel, currentModel.providerName);
                const osType = getModelOsType(currentModel.id);

                return (
                  <div
                    key={slot.id}
                    className={`p-5 rounded-3xl border transition-all flex flex-col justify-between gap-4 ${
                      assigned
                        ? "bg-white border-blue-200 shadow-sm"
                        : "bg-stone-50/70 border-stone-200/80"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl p-2 bg-stone-100 rounded-2xl">{slot.icon}</span>
                          <div>
                            <div className="font-extrabold text-sm text-stone-900">{slot.name}</div>
                            <div className="text-[10px] text-stone-500 font-mono">{slot.id}</div>
                          </div>
                        </div>

                        {assigned ? (
                          <span className="text-[10px] font-extrabold bg-blue-100 text-[#2F6BFF] px-2 py-0.5 rounded-full">
                            Designated
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                            Fallback
                          </span>
                        )}
                      </div>

                      {/* Model Card Box inside Role Slot */}
                      <div className="bg-stone-50/90 border border-stone-200/80 p-3.5 rounded-2xl space-y-2">
                        <div className="flex items-center justify-between gap-1 flex-wrap">
                          <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${pricing.color}`}>
                            {pricing.label}
                          </span>
                          <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md border ${osType.color}`}>
                            {osType.label}
                          </span>
                        </div>

                        <div>
                          <div className="font-extrabold text-xs text-stone-900 truncate" title={currentModel.name}>
                            {currentModel.name}
                          </div>
                          <div className="text-[10px] font-mono text-stone-500 truncate mt-0.5" title={currentModel.id}>
                            {currentModel.id} • <span className="font-bold text-stone-700">{currentModel.providerName || "NVIDIA NIM"}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Slot Actions */}
                    <div className="pt-2 flex items-center justify-end gap-1.5 flex-wrap">
                      <button
                        onClick={() => {
                          setTestingModel(currentModel);
                          setTestResult(null);
                        }}
                        className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Play className="w-3 h-3 text-emerald-600" />
                        <span>Test</span>
                      </button>

                      <button
                        onClick={() => {
                          setSwapSlotId(slot.id);
                          setSwapSearchQuery("");
                        }}
                        className="px-3 py-1 bg-[#2F6BFF] hover:bg-blue-700 text-white rounded-xl text-[11px] font-extrabold flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
                      >
                        <span>🔄 Swap</span>
                      </button>

                      {assigned && (
                        <button
                          onClick={() => {
                            assignCapability(slot.id, null);
                            showToast(`🔄 Reset ${slot.name} to general workspace fallback model.`);
                          }}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Reset to workspace fallback"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL A: ASSIGN ROLE MODAL (When clicking "📌 Assign Role" from Catalog) */}
      {assigningModel && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-lg w-full p-6 space-y-5 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{assigningModel.vendor.logo}</span>
                <div>
                  <h3 className="font-extrabold text-base text-stone-900">
                    Assign Role: {assigningModel.name}
                  </h3>
                  <div className="text-xs text-stone-500 font-mono">
                    {assigningModel.id} • <span className="font-bold">{assigningModel.providerName}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setAssigningModel(null)}
                className="text-stone-400 hover:text-stone-800 text-base font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-stone-600 shrink-0">
              Select which of your 14 OS workflows should be powered by this LLM model:
            </div>

            <div className="overflow-y-auto space-y-2 pr-1 flex-1">
              {capabilitySlots.map((slot) => {
                const currentAssigned = capabilityMap[slot.id];
                const isThisModelAssigned = currentAssigned?.id === assigningModel.id;

                return (
                  <button
                    key={slot.id}
                    onClick={() => {
                      assignCapability(slot.id, {
                        id: assigningModel.id,
                        name: assigningModel.name,
                        providerName: assigningModel.providerName,
                        baseUrl: assigningModel.baseUrl,
                        encryptedKey: assigningModel.encryptedKey
                      });
                      showToast(`📌 Designated ${assigningModel.name} as your ${slot.name}!`);
                      setAssigningModel(null);
                    }}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isThisModelAssigned
                        ? "bg-blue-50/80 border-[#2F6BFF] ring-1 ring-[#2F6BFF]/30"
                        : "bg-stone-50 hover:bg-blue-50/40 border-stone-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl p-2 bg-white rounded-xl shadow-2xs">{slot.icon}</span>
                      <div>
                        <div className="font-extrabold text-xs text-stone-900">{slot.name}</div>
                        <div className="text-[10px] text-stone-400 font-mono">
                          Currently: {currentAssigned ? currentAssigned.name : "Workspace Fallback"}
                        </div>
                      </div>
                    </div>

                    <span className={`text-xs px-3 py-1.5 rounded-xl font-extrabold transition-colors ${
                      isThisModelAssigned
                        ? "bg-[#2F6BFF] text-white"
                        : "bg-white text-stone-700 border border-stone-200 hover:bg-[#2F6BFF] hover:text-white"
                    }`}>
                      {isThisModelAssigned ? "✅ Assigned" : "Assign Here"}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-stone-100 flex justify-end shrink-0">
              <button
                onClick={() => setAssigningModel(null)}
                className="px-5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL B: SWAP LLM MODEL MODAL (When clicking "🔄 Swap" from Selected Hub) */}
      {swapSlotId && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-2xl w-full p-6 space-y-5 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl p-2 bg-blue-50 text-[#2F6BFF] rounded-2xl">
                  {capabilitySlots.find((s) => s.id === swapSlotId)?.icon || "🔄"}
                </span>
                <div>
                  <h3 className="font-extrabold text-base text-stone-900">
                    Select Model for {capabilitySlots.find((s) => s.id === swapSlotId)?.name}
                  </h3>
                  <p className="text-xs text-stone-500">
                    Pick any discovered model from your connected providers to power this workflow role.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSwapSlotId(null)}
                className="text-stone-400 hover:text-stone-800 text-base font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Quick Live Search for Swap */}
            <div className="relative shrink-0">
              <MagnifyingGlass className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search models by name, vendor, or Free/Paid pricing..."
                value={swapSearchQuery}
                onChange={(e) => setSwapSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-none focus:border-[#2F6BFF] text-stone-800 font-medium"
              />
            </div>

            {/* Models List for Swap */}
            <div className="overflow-y-auto space-y-2 pr-1 flex-1">
              {allDiscoveredModels
                .filter((m) => {
                  if (!swapSearchQuery.trim()) return true;
                  const q = swapSearchQuery.toLowerCase();
                  return (
                    m.name.toLowerCase().includes(q) ||
                    m.id.toLowerCase().includes(q) ||
                    m.vendor.name.toLowerCase().includes(q) ||
                    m.providerName.toLowerCase().includes(q)
                  );
                })
                .slice(0, 30) // Show top 30 matches for speed
                .map((m, idx) => {
                  const currentAssigned = capabilityMap[swapSlotId];
                  const isSelected = currentAssigned?.id === m.id && currentAssigned?.baseUrl === m.baseUrl;

                  return (
                    <div
                      key={`${m.id}-swap-${idx}`}
                      onClick={() => {
                        assignCapability(swapSlotId, {
                          id: m.id,
                          name: m.name,
                          providerName: m.providerName,
                          baseUrl: m.baseUrl,
                          encryptedKey: m.encryptedKey
                        });
                        showToast(`🔄 Swapped ${capabilitySlots.find((s) => s.id === swapSlotId)?.name} to ${m.name}!`);
                        setSwapSlotId(null);
                      }}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? "bg-blue-50 border-[#2F6BFF] shadow-xs ring-1 ring-[#2F6BFF]/30"
                          : "bg-white hover:bg-stone-50 border-stone-200/90 hover:border-stone-400"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-2xl shrink-0">{m.vendor.logo}</span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-extrabold text-xs text-stone-900 truncate">{m.name}</span>
                            <span className={`text-[9px] font-extrabold px-2 py-0.2 rounded-full border ${m.pricing.color}`}>
                              {m.pricing.label}
                            </span>
                            <span className={`text-[9px] font-extrabold px-2 py-0.2 rounded-md border ${m.osType.color}`}>
                              {m.osType.label}
                            </span>
                          </div>
                          <div className="text-[10px] font-mono text-stone-400 truncate mt-0.5">
                            {m.id} • <strong className="text-stone-700">{m.providerName}</strong>
                          </div>
                        </div>
                      </div>

                      <span className={`text-xs px-3.5 py-1.5 rounded-xl font-extrabold shrink-0 transition-colors ${
                        isSelected
                          ? "bg-[#2F6BFF] text-white"
                          : "bg-stone-100 hover:bg-[#2F6BFF] hover:text-white text-stone-800"
                      }`}>
                        {isSelected ? "✅ Active Role" : "Select For Role"}
                      </span>
                    </div>
                  );
                })}
            </div>

            <div className="pt-3 border-t border-stone-100 flex justify-between items-center shrink-0">
              <button
                onClick={() => {
                  assignCapability(swapSlotId, null);
                  showToast(`🔄 Reset ${capabilitySlots.find((s) => s.id === swapSlotId)?.name} to general workspace fallback.`);
                  setSwapSlotId(null);
                }}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 cursor-pointer"
              >
                Reset to Workspace Default
              </button>
              <button
                onClick={() => setSwapSlotId(null)}
                className="px-5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Live Model Testing Modal */}
      {testingModel && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-xl w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{testingModel.vendor?.logo || "🤖"}</span>
                <div>
                  <h3 className="font-extrabold text-sm text-stone-900">
                    Live Model Test: {testingModel.name}
                  </h3>
                  <div className="text-[11px] text-stone-400 font-mono">{testingModel.id}</div>
                </div>
              </div>
              <button
                onClick={() => setTestingModel(null)}
                className="text-stone-400 hover:text-stone-800 text-sm font-bold p-1 cursor-pointer"
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
              <span className="text-[10px] text-stone-400">Model endpoint: {testingModel.providerName || "NVIDIA NIM"}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTestingModel(null)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 rounded-xl text-xs font-bold hover:bg-stone-200 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleRunModelTest}
                  disabled={isTestRunning}
                  className="px-5 py-2 bg-[#2F6BFF] hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md disabled:opacity-50 cursor-pointer"
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
                className="text-stone-400 hover:text-stone-800 text-sm font-bold p-1 cursor-pointer"
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
                  className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={connecting}
                  className="px-6 py-2.5 bg-[#2F6BFF] hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-[#2F6BFF]/20 flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
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
