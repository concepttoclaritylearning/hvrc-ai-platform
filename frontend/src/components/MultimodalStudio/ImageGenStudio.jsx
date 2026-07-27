import React, { useState } from "react";
import {
  PaintBrush,
  Sparkle,
  Image,
  DownloadSimple,
  Crop,
  MagicWand,
  FolderPlus,
  Check,
  Spinner
} from "@phosphor-icons/react";

export default function ImageGenStudio({ onExportImage }) {
  const [prompt, setPrompt] = useState("");
  const [assetType, setAssetType] = useState("ui-mockup");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);

  const PRESETS = [
    { id: "ui-mockup", name: "UI Mockup", icon: "📱", style: "clean modern dark mode app interface dashboard UI design" },
    { id: "icon-logo", name: "Icon / Logo", icon: "🎨", style: "minimalist futuristic 3D vector neon app icon logo" },
    { id: "concept-art", name: "Concept Art", icon: "🌌", style: "cinematic high detail futuristic cyberpunk concept art" },
    { id: "game-texture", name: "Game Texture", icon: "🎮", style: "seamless 4k PBR game texture material render" },
    { id: "diagram", name: "Architecture Diagram", icon: "📊", style: "clean technical system architecture diagram blueprint" }
  ];

  const handleGenerate = () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    const selectedPreset = PRESETS.find((p) => p.id === assetType) || PRESETS[0];

    setTimeout(() => {
      // Procedural SVG / Canvas generated image artifact URL fallback
      const encodedPrompt = encodeURIComponent(`${prompt} ${selectedPreset.style}`);
      const imageUrl = `https://pollinations.ai/p/${encodedPrompt}?width=768&height=512&seed=${Date.now()}`;

      const newImg = {
        id: `img-${Date.now()}`,
        url: imageUrl,
        prompt: prompt.trim(),
        preset: selectedPreset.name,
        date: new Date().toLocaleTimeString()
      };

      setGeneratedImages([newImg, ...generatedImages]);
      setIsGenerating(false);

      if (onExportImage) {
        onExportImage(newImg);
      }
    }, 1500);
  };

  return (
    <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
        <div className="flex items-center gap-2">
          <PaintBrush className="w-5 h-5 text-[#2F6BFF]" />
          <h3 className="font-extrabold text-sm text-stone-900">Native Multimodal Image Studio</h3>
        </div>
        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
          Flux / Pollinations AI Engine
        </span>
      </div>

      {/* Asset Preset Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => setAssetType(p.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              assetType === p.id
                ? "bg-[#2F6BFF] text-white shadow-2xs"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            <span>{p.icon}</span>
            <span>{p.name}</span>
          </button>
        ))}
      </div>

      {/* Prompt Bar */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder={`Describe the ${assetType} to generate (e.g. Futuristic dark mode AI dashboard UI)...`}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs outline-none text-stone-800 focus:border-[#2F6BFF]"
        />
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="px-5 py-2.5 bg-[#2F6BFF] hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md disabled:opacity-50 transition-all"
        >
          {isGenerating ? (
            <>
              <Spinner className="w-4 h-4 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Sparkle className="w-4 h-4" />
              <span>Generate Asset</span>
            </>
          )}
        </button>
      </div>

      {/* Generated Images Output Gallery */}
      {generatedImages.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {generatedImages.map((img) => (
            <div key={img.id} className="relative group rounded-2xl overflow-hidden border border-stone-200 bg-stone-900">
              <img src={img.url} alt={img.prompt} className="w-full h-44 object-cover" />
              <div className="absolute inset-0 bg-stone-950/70 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between text-white text-xs">
                <div className="line-clamp-2 font-medium">{img.prompt}</div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[10px] bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded-full">{img.preset}</span>
                  <button
                    onClick={() => onExportImage && onExportImage(img)}
                    className="px-2.5 py-1 bg-[#2F6BFF] text-white rounded-lg font-bold text-[10px] flex items-center gap-1 hover:bg-blue-600"
                  >
                    <FolderPlus className="w-3 h-3" /> Export to Workspace
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
