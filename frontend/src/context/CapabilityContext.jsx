import React, { createContext, useContext, useState, useEffect } from "react";
import { useProviders } from "@/context/ProviderContext";

export const CAPABILITY_SLOTS = [
  { id: "reasoningModel", name: "Reasoning & Deep Thinking", icon: "🧠", defaultKeyword: "r1" },
  { id: "codingModel", name: "Code Generation & Refactoring", icon: "⚡", defaultKeyword: "llama-3.3" },
  { id: "reviewingModel", name: "Code Review & QA", icon: "🔍", defaultKeyword: "nemotron" },
  { id: "planningModel", name: "Architecture & Planning", icon: "📐", defaultKeyword: "claude" },
  { id: "researchModel", name: "Research & Web Analysis", icon: "🌐", defaultKeyword: "gpt-4o" },
  { id: "debuggingModel", name: "Debugging & Diagnostics", icon: "🐛", defaultKeyword: "coder" },
  { id: "documentationModel", name: "Docs & Technical Writing", icon: "📝", defaultKeyword: "mistral" },
  { id: "testingModel", name: "Test Generation & Assertion", icon: "🧪", defaultKeyword: "deepseek" },
  { id: "backgroundModel", name: "Autonomous Background Supervision", icon: "🤖", defaultKeyword: "llama-3.3" },
  { id: "imageGenModel", name: "Native Image Generation", icon: "🎨", defaultKeyword: "flux" },
  { id: "videoGenModel", name: "Video Synthesis Engine", icon: "🎬", defaultKeyword: "video" },
  { id: "threeDGenModel", name: "3D Asset WebGL Generator", icon: "📦", defaultKeyword: "shap-e" },
  { id: "speechModel", name: "Speech & Audio Engine", icon: "🎙️", defaultKeyword: "whisper" },
  { id: "visionModel", name: "Vision & Visual Analysis", icon: "👁️", defaultKeyword: "vision" }
];

const CapabilityContext = createContext(null);

export function CapabilityProvider({ children }) {
  const { providers, activeModel } = useProviders();

  // Multi-model capability assignments state stored in localStorage per project
  const [capabilityMap, setCapabilityMap] = useState(() => {
    const saved = localStorage.getItem("hvrc_project_capabilities");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      reasoningModel: null,
      codingModel: null,
      reviewingModel: null,
      planningModel: null,
      researchModel: null,
      debuggingModel: null,
      documentationModel: null,
      testingModel: null,
      backgroundModel: null,
      imageGenModel: { id: "hvrc-image-flux", name: "HVRC Flux Image Engine", providerName: "Native Multimodal" },
      videoGenModel: { id: "hvrc-video-engine", name: "HVRC Motion Video Engine", providerName: "Native Multimodal" },
      threeDGenModel: { id: "hvrc-3d-webgl", name: "HVRC WebGL 3D Studio", providerName: "Native Multimodal" },
      speechModel: { id: "hvrc-[#2F6BFF]-speech", name: "HVRC Audio Studio", providerName: "Native Multimodal" },
      visionModel: null
    };
  });

  // Sync activeModel to coding & reasoning if unassigned
  useEffect(() => {
    if (activeModel && !capabilityMap.codingModel) {
      assignCapability("codingModel", activeModel);
    }
  }, [activeModel]);

  // Persist capabilityMap to localStorage
  useEffect(() => {
    localStorage.setItem("hvrc_project_capabilities", JSON.stringify(capabilityMap));
  }, [capabilityMap]);

  // Assign a model to a capability slot
  const assignCapability = (slotId, modelObj) => {
    setCapabilityMap((prev) => ({
      ...prev,
      [slotId]: modelObj
    }));
  };

  // Helper to get active model for a specific capability with fallback to activeModel
  const getModelForCapability = (slotId) => {
    return capabilityMap[slotId] || activeModel || { id: "meta/llama-3.3-70b-instruct", name: "Llama 3.3 70B", providerName: "NVIDIA NIM" };
  };

  return (
    <CapabilityContext.Provider
      value={{
        capabilityMap,
        assignCapability,
        getModelForCapability,
        capabilitySlots: CAPABILITY_SLOTS
      }}
    >
      {children}
    </CapabilityContext.Provider>
  );
}

export function useCapability() {
  const context = useContext(CapabilityContext);
  if (!context) {
    throw new Error("useCapability must be used within a CapabilityProvider");
  }
  return context;
}
