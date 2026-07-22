import { MagnifyingGlass } from "@phosphor-icons/react";
import { useEffect, useState, useRef } from "react";
import OpenRouterLogo from "@/media/llmprovider/openrouter.jpeg";
import GroqLogo from "@/media/llmprovider/groq.png";
import NvidiaNimLogo from "@/media/llmprovider/nvidia-nim.png";

import OpenRouterOptions from "@/components/LLMSelection/OpenRouterOptions";
import GroqAiOptions from "@/components/LLMSelection/GroqAiOptions";
import NvidiaNimOptions from "@/components/LLMSelection/NvidiaNimOptions";

import LLMItem from "@/components/LLMSelection/LLMItem";
import System from "@/models/system";
import paths from "@/utils/paths";
import showToast from "@/utils/toast";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const LLMS = [
  {
    name: "OpenRouter",
    value: "openrouter",
    logo: OpenRouterLogo,
    options: (settings) => <OpenRouterOptions settings={settings} />,
    description:
      "Access 200+ free & paid serverless models — Llama 3.3 70B Free, Gemini 2.5 Flash Free, DeepSeek R1 Free and more.",
  },
  {
    name: "Groq",
    value: "groq",
    logo: GroqLogo,
    options: (settings) => <GroqAiOptions settings={settings} />,
    description:
      "The fastest serverless inference engine — ultra low latency for real-time AI.",
  },
  {
    name: "NVIDIA NIM",
    value: "nvidia-nim",
    logo: NvidiaNimLogo,
    options: (settings) => <NvidiaNimOptions settings={settings} />,
    description:
      "Cloud serverless inference for Llama 3.3, DeepSeek R1, Nemotron and NVIDIA's full model catalog.",
  },
];

export default function LLMPreference({
  setHeader,
  setForwardBtn,
  setBackBtn,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLLM, setSelectedLLM] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const searchInputRef = useRef(null);

  const filteredLLMs = LLMS.filter((llm) =>
    llm.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function handleForward() {
    if (!selectedLLM) {
      showToast("Please select an LLM provider to continue.", "error");
      return;
    }
    navigate(paths.onboarding.embeddingPreference());
  }

  function handleBack() {
    navigate(paths.onboarding.home());
  }

  useEffect(() => {
    setHeader({
      title: "Choose your AI Provider",
      description:
        "Paste your API key and HVRC.AI will auto-fetch all available models. Only OpenRouter, Groq, and NVIDIA NIM are supported — all free serverless options.",
    });
    setForwardBtn({ showing: true, disabled: false, onClick: handleForward });
    setBackBtn({ showing: true, disabled: false, onClick: handleBack });
  }, [selectedLLM]);

  useEffect(() => {
    async function fetchKeys() {
      const _settings = await System.keys();
      setSettings(_settings);
      setSelectedLLM(_settings?.LLMProvider);
      setLoading(false);
    }
    fetchKeys();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!selectedLLM) return;

    const form = e.target;
    const formData = new FormData(form);
    const data = { LLMProvider: selectedLLM };
    for (const [key, value] of formData.entries()) data[key] = value;
    const { error } = await System.updateSystem(data);
    if (error) {
      showToast(`Failed to save LLM settings: ${error}`, "error");
      return;
    }
    navigate(paths.onboarding.embeddingPreference());
  }

  return (
    <div className="w-full flex flex-col gap-y-4">
      {loading ? (
        <div className="w-full h-40 flex justify-center items-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-y-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlass
              size={16}
              weight="bold"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-text-secondary"
            />
            <input
              type="text"
              placeholder="Search providers..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-theme-settings-input-bg text-theme-text-primary border border-transparent focus:border-primary-button outline-none"
              onChange={(e) => setSearchQuery(e.target.value)}
              ref={searchInputRef}
            />
          </div>

          {/* Provider list */}
          <div className="flex flex-col gap-y-2 max-h-[360px] overflow-y-auto pr-1 white-scrollbar">
            {filteredLLMs.map((llm) => (
              <LLMItem
                key={llm.name}
                name={llm.name}
                value={llm.value}
                image={llm.logo}
                description={llm.description}
                checked={selectedLLM === llm.value}
                onClick={() => setSelectedLLM(llm.value)}
              />
            ))}
          </div>

          {/* Options panel for selected provider */}
          {selectedLLM && (
            <div className="mt-2 flex flex-col gap-y-1 border-t border-white/10 pt-4">
              <p className="text-xs text-white/60 mb-2">
                Paste your API key below — models will be fetched automatically.
              </p>
              {LLMS.find((llm) => llm.value === selectedLLM)?.options(settings)}
            </div>
          )}
        </form>
      )}
    </div>
  );
}
