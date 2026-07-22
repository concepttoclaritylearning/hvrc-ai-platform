import React, { useState } from "react";
import { Code, Eye, X, Copy, Check } from "@phosphor-icons/react";

export default function ArtifactCanvas({ artifact, onClose }) {
  const [activeTab, setActiveTab] = useState("preview");
  const [copied, setCopied] = useState(false);

  if (!artifact) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(artifact.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-[480px] h-full bg-white border-l border-stone-200/80 flex flex-col z-20 shadow-xl animate-fade-in">
      {/* Canvas Header */}
      <div className="p-3 border-b border-stone-200/80 flex items-center justify-between bg-stone-50">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-stone-800">{artifact.title || "Interactive Artifact Canvas"}</span>
          <span className="text-[10px] uppercase font-bold text-[#2F6BFF] bg-blue-50 px-2 py-0.5 rounded-full">
            {artifact.type || "html"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-stone-200/70 p-0.5 rounded-lg text-xs font-medium">
            <button
              onClick={() => setActiveTab("preview")}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeTab === "preview" ? "bg-white text-stone-900 shadow-2xs font-semibold" : "text-stone-600"
              }`}
            >
              <Eye className="w-3.5 h-3.5 inline mr-1" />
              Preview
            </button>
            <button
              onClick={() => setActiveTab("code")}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeTab === "code" ? "bg-white text-stone-900 shadow-2xs font-semibold" : "text-stone-600"
              }`}
            >
              <Code className="w-3.5 h-3.5 inline mr-1" />
              Code
            </button>
          </div>

          <button onClick={handleCopy} className="p-1.5 hover:bg-stone-200 rounded-lg text-stone-500">
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
          <button onClick={onClose} className="p-1.5 hover:bg-stone-200 rounded-lg text-stone-500">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Canvas Content */}
      <div className="flex-1 overflow-auto bg-[#FAF8F4] p-4">
        {activeTab === "preview" ? (
          artifact.type === "html" ? (
            <iframe
              srcDoc={artifact.content}
              title="Artifact Preview"
              className="w-full h-full min-h-[400px] border border-stone-200 rounded-2xl bg-white shadow-sm"
              sandbox="allow-scripts"
            />
          ) : (
            <div className="bg-white p-6 rounded-2xl border border-stone-200 font-sans text-xs space-y-3">
              <div className="font-bold text-stone-900">{artifact.title}</div>
              <div className="whitespace-pre-wrap text-stone-700 leading-relaxed">{artifact.content}</div>
            </div>
          )
        ) : (
          <pre className="bg-stone-900 text-emerald-400 p-4 rounded-2xl font-mono text-xs overflow-auto h-full">
            <code>{artifact.content}</code>
          </pre>
        )}
      </div>
    </div>
  );
}
