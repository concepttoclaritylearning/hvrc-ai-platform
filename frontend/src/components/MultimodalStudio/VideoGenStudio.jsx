import React, { useState } from "react";
import { FilmStrip, Play, Sparkle, Spinner, Check, FolderPlus, Clock } from "@phosphor-icons/react";

export default function VideoGenStudio({ onExportVideo }) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedVideos, setGeneratedVideos] = useState([]);

  const handleGenerateVideo = () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setProgress(10);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(timer);
          return 90;
        }
        return prev + 20;
      });
    }, 400);

    setTimeout(() => {
      clearInterval(timer);
      setProgress(100);

      const newVid = {
        id: `vid-${Date.now()}`,
        title: prompt.trim(),
        duration: "0:06",
        date: new Date().toLocaleTimeString(),
        poster: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60"
      };

      setGeneratedVideos([newVid, ...generatedVideos]);
      setIsGenerating(false);

      if (onExportVideo) {
        onExportVideo(newVid);
      }
    }, 2500);
  };

  return (
    <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
        <div className="flex items-center gap-2">
          <FilmStrip className="w-5 h-5 text-purple-600" />
          <h3 className="font-extrabold text-sm text-stone-900">Async Motion Video Synthesis</h3>
        </div>
        <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">
          HVRC Motion AI Engine
        </span>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Describe video or UI animation (e.g. Smooth 60fps UI transition demo)..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleGenerateVideo()}
          className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs outline-none text-stone-800 focus:border-purple-600"
        />
        <button
          onClick={handleGenerateVideo}
          disabled={isGenerating}
          className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md disabled:opacity-50 transition-all"
        >
          {isGenerating ? (
            <>
              <Spinner className="w-4 h-4 animate-spin" />
              <span>Rendering {progress}%...</span>
            </>
          ) : (
            <>
              <Sparkle className="w-4 h-4" />
              <span>Generate Video</span>
            </>
          )}
        </button>
      </div>

      {/* Progress Bar during async generation */}
      {isGenerating && (
        <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
          <div className="bg-purple-600 h-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      )}

      {/* Generated Videos Gallery */}
      {generatedVideos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {generatedVideos.map((vid) => (
            <div key={vid.id} className="relative group rounded-2xl overflow-hidden border border-stone-200 bg-stone-950">
              <img src={vid.poster} alt={vid.title} className="w-full h-36 object-cover opacity-80" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg">
                  <Play className="w-5 h-5 ml-0.5" />
                </div>
              </div>
              <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-stone-950 to-transparent flex items-center justify-between text-white text-xs">
                <span className="truncate pr-2 font-medium">{vid.title}</span>
                <button
                  onClick={() => onExportVideo && onExportVideo(vid)}
                  className="px-2 py-1 bg-purple-600 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 hover:bg-purple-700 shrink-0"
                >
                  <FolderPlus className="w-3 h-3" /> Export
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
