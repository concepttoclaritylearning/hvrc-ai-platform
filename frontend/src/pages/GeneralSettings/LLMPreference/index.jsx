import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import System from "@/models/system";
import showToast from "@/utils/toast";
import HVRCAIIcon from "@/media/logo/hvrc-ai-icon.png";
import OpenRouterLogo from "@/media/llmprovider/openrouter.jpeg";
import GroqLogo from "@/media/llmprovider/groq.png";
import NvidiaNimLogo from "@/media/llmprovider/nvidia-nim.png";

import PreLoader from "@/components/Preloader";
import OpenRouterOptions from "@/components/LLMSelection/OpenRouterOptions";
import GroqAiOptions from "@/components/LLMSelection/GroqAiOptions";
import NvidiaNimOptions from "@/components/LLMSelection/NvidiaNimOptions";
import ModelRouterOptions from "@/components/LLMSelection/ModelRouterOptions";

import LLMItem from "@/components/LLMSelection/LLMItem";
import { CaretUpDown, MagnifyingGlass, X } from "@phosphor-icons/react";
import CTAButton from "@/components/lib/CTAButton";

export const MODEL_ROUTER_PROVIDER = {
  name: "Model Router",
  value: "hvrc-ai-router",
  logo: HVRCAIIcon,
  options: (settings) => <ModelRouterOptions settings={settings} />,
  description: "Route messages to different LLM providers based on rules you define.",
  requiredConfig: [],
};

/**
 * HVRC.AI supported LLM providers: OpenRouter, Groq, NVIDIA NIM only.
 */
export const AVAILABLE_LLM_PROVIDERS = [
  {
    name: "OpenRouter",
    value: "openrouter",
    logo: OpenRouterLogo,
    options: (settings) => <OpenRouterOptions settings={settings} />,
    description:
      "Access 200+ free & paid serverless models: Llama 3.3 70B Free, Gemini 2.5 Flash Free, DeepSeek R1 Free and more.",
    requiredConfig: ["OpenRouterApiKey"],
  },
  {
    name: "Groq",
    value: "groq",
    logo: GroqLogo,
    options: (settings) => <GroqAiOptions settings={settings} />,
    description:
      "The fastest serverless inference engine — ultra low latency for real-time AI applications.",
    requiredConfig: ["GroqApiKey"],
  },
  {
    name: "NVIDIA NIM",
    value: "nvidia-nim",
    logo: NvidiaNimLogo,
    options: (settings) => <NvidiaNimOptions settings={settings} />,
    description:
      "Cloud serverless inference for Llama 3.3, DeepSeek R1, Nemotron and NVIDIA's full model catalog.",
    requiredConfig: ["NvidiaNimLLMBasePath"],
  },
];

/**
 * All LLM providers including model router.
 */
export const ALL_LLM_PROVIDERS = [
  MODEL_ROUTER_PROVIDER,
  ...AVAILABLE_LLM_PROVIDERS,
];

export const LLM_PREFERENCE_CHANGED_EVENT = "llm-preference-changed";

export default function GeneralLLMPreference() {
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLLMs, setFilteredLLMs] = useState([]);
  const [selectedLLM, setSelectedLLM] = useState(null);
  const [searchMenuOpen, setSearchMenuOpen] = useState(false);
  const searchInputRef = useRef(null);
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = { LLMProvider: selectedLLM };
    const formData = new FormData(form);
    for (var [key, value] of formData.entries()) data[key] = value;
    const { error } = await System.updateSystem(data);
    setSaving(true);
    if (error) {
      showToast(`Failed to save LLM settings: ${error}`, "error");
    } else {
      showToast("LLM preferences saved successfully.", "success");
    }
    setSaving(false);
    setHasChanges(!!error);
  };

  const updateLLMChoice = (selection) => {
    setSearchQuery("");
    setSelectedLLM(selection);
    setSearchMenuOpen(false);
    setHasChanges(true);
  };

  const handleXButton = () => {
    if (searchQuery.length > 0) {
      setSearchQuery("");
      if (searchInputRef.current) searchInputRef.current.value = "";
    } else {
      setSearchMenuOpen(!searchMenuOpen);
    }
  };

  useEffect(() => {
    async function fetchKeys() {
      const _settings = await System.keys();
      setSettings(_settings);
      setSelectedLLM(_settings?.LLMProvider);
      setLoading(false);
    }
    fetchKeys();
  }, []);

  useEffect(() => {
    function updateHasChanges() {
      setHasChanges(true);
    }
    window.addEventListener(LLM_PREFERENCE_CHANGED_EVENT, updateHasChanges);
    return () => {
      window.removeEventListener(LLM_PREFERENCE_CHANGED_EVENT, updateHasChanges);
    };
  }, []);

  useEffect(() => {
    const filtered = AVAILABLE_LLM_PROVIDERS.filter((llm) =>
      llm.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredLLMs(filtered);
  }, [searchQuery, selectedLLM]);

  const selectedLLMObject = AVAILABLE_LLM_PROVIDERS.find(
    (llm) => llm.value === selectedLLM
  );

  return (
    <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex">
      <Sidebar />
      {loading ? (
        <div
          style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
          className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-secondary w-full h-full overflow-y-scroll p-4 md:p-0"
        >
          <div className="w-full h-full flex justify-center items-center">
            <PreLoader />
          </div>
        </div>
      ) : (
        <div
          style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
          className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-secondary w-full h-full overflow-y-scroll p-4 md:p-0"
        >
          <form onSubmit={handleSubmit} className="flex w-full">
            <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16">
              {/* Header */}
              <div className="w-full flex flex-col gap-y-1 pb-6 border-white light:border-theme-sidebar-border border-b-2 border-opacity-10">
                <div className="flex gap-x-4 items-center">
                  <p className="text-lg leading-6 font-bold text-white">
                    {t("llm.title")}
                  </p>
                </div>
                <p className="text-xs leading-[18px] font-base text-white text-opacity-60">
                  Select your preferred AI provider. Paste your API key and HVRC.AI will automatically fetch all available models.
                </p>
              </div>

              {/* Save button */}
              <div className="w-full justify-end flex">
                {hasChanges && (
                  <CTAButton
                    onClick={() => handleSubmit()}
                    className="mt-3 mr-0 -mb-14 z-10"
                  >
                    {saving ? "Saving..." : "Save changes"}
                  </CTAButton>
                )}
              </div>

              {/* Provider picker label */}
              <div className="text-base font-bold text-white mt-6 mb-4">
                AI Provider
              </div>

              {/* Provider picker dropdown */}
              <div className="relative">
                {searchMenuOpen && (
                  <div
                    className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 backdrop-blur-sm z-10"
                    onClick={() => setSearchMenuOpen(false)}
                  />
                )}
                {searchMenuOpen ? (
                  <div className="absolute top-0 left-0 w-full max-w-[640px] max-h-[310px] min-h-[64px] bg-theme-settings-input-bg rounded-lg flex flex-col justify-between cursor-pointer border-2 border-primary-button z-20">
                    <div className="w-full flex flex-col gap-y-1">
                      <div className="flex items-center sticky top-0 z-10 border-b border-[#9CA3AF] mx-4 bg-theme-settings-input-bg">
                        <MagnifyingGlass
                          size={20}
                          weight="bold"
                          className="absolute left-4 z-30 text-theme-text-primary -ml-4 my-2"
                        />
                        <input
                          type="text"
                          name="llm-search"
                          autoComplete="off"
                          placeholder="Search providers..."
                          className="border-none -ml-4 my-2 bg-transparent z-20 pl-12 h-[38px] w-full px-4 py-1 text-sm outline-none text-theme-text-primary placeholder:text-theme-text-primary placeholder:font-medium"
                          onChange={(e) => setSearchQuery(e.target.value)}
                          ref={searchInputRef}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") e.preventDefault();
                          }}
                        />
                        <X
                          size={20}
                          weight="bold"
                          className="cursor-pointer text-white hover:text-x-button"
                          onClick={handleXButton}
                        />
                      </div>
                      <div className="flex-1 pl-4 pr-2 flex flex-col gap-y-1 overflow-y-auto white-scrollbar pb-4 max-h-[245px]">
                        {filteredLLMs.map((llm) => (
                          <LLMItem
                            key={llm.name}
                            name={llm.name}
                            value={llm.value}
                            image={llm.logo}
                            description={llm.description}
                            checked={selectedLLM === llm.value}
                            onClick={() => updateLLMChoice(llm.value)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    className="w-full max-w-[640px] h-[64px] bg-theme-settings-input-bg rounded-lg flex items-center p-[14px] justify-between cursor-pointer border-2 border-transparent hover:border-primary-button transition-all duration-300"
                    type="button"
                    onClick={() => setSearchMenuOpen(true)}
                  >
                    <div className="flex gap-x-4 items-center">
                      <img
                        src={selectedLLMObject?.logo || HVRCAIIcon}
                        alt={`${selectedLLMObject?.name || "HVRC.AI"} logo`}
                        className="w-10 h-10 rounded-md"
                      />
                      <div className="flex flex-col text-left">
                        <div className="text-sm font-semibold text-white">
                          {selectedLLMObject?.name || "Select a provider"}
                        </div>
                        <div className="mt-1 text-xs text-description">
                          {selectedLLMObject?.description ||
                            "Choose OpenRouter, Groq, or NVIDIA NIM"}
                        </div>
                      </div>
                    </div>
                    <CaretUpDown size={24} weight="bold" className="text-white" />
                  </button>
                )}
              </div>

              {/* Provider options panel */}
              <div
                onChange={() => setHasChanges(true)}
                className="mt-4 flex flex-col gap-y-1"
              >
                {selectedLLM &&
                  AVAILABLE_LLM_PROVIDERS.find(
                    (llm) => llm.value === selectedLLM
                  )?.options?.(settings)}
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
