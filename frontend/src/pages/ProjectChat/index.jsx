import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Sparkle,
  PaperPlane,
  Plus,
  PushPin,
  Trash,
  Copy,
  Check,
  Lightning,
  Brain,
  CodeBlock,
  FolderOpen,
  ArrowClockwise,
  PencilSimple,
  ShareNetwork,
  DownloadSimple
} from "@phosphor-icons/react";
import ArtifactCanvas from "@/components/ArtifactCanvas";
import { useModel } from "@/ModelContext";

export default function ProjectChat() {
  const { slug } = useParams();
  const { activeModel, selectModel, executeCompletion } = useModel();

  // Dynamic user chat threads stored in localStorage
  const [threads, setThreads] = useState(() => {
    const saved = localStorage.getItem("hvrc_chat_threads");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [
      {
        id: "t-1",
        title: "New Conversation",
        date: "Just now",
        messages: [
          {
            id: "m-1",
            role: "assistant",
            text: `Hello! I am ready to assist with workspace **${slug || "default"}**. Ask me anything, write code, or explain concepts.`
          }
        ]
      }
    ];
  });

  const [activeThreadId, setActiveThreadId] = useState(() => threads[0]?.id || "t-1");

  useEffect(() => {
    localStorage.setItem("hvrc_chat_threads", JSON.stringify(threads));
  }, [threads]);

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];
  const messages = activeThread?.messages || [];

  const [prompt, setPrompt] = useState("");
  const [activeArtifact, setActiveArtifact] = useState(null);
  const [isReasoningEnabled, setIsReasoningEnabled] = useState(true);
  const [loadingResponse, setLoadingResponse] = useState(false);

  const handleNewThread = () => {
    const newId = `t-${Date.now()}`;
    const newT = {
      id: newId,
      title: "New Conversation",
      date: "Just now",
      messages: [
        {
          id: `m-${Date.now()}`,
          role: "assistant",
          text: `Started a new thread for workspace **${slug || "default"}**. How can I help you?`
        }
      ]
    };
    setThreads([newT, ...threads]);
    setActiveThreadId(newId);
    setActiveArtifact(null);
  };

  // Delete specific thread (always allowed)
  const handleDeleteThread = (e, threadId) => {
    e.stopPropagation();
    const remaining = threads.filter((t) => t.id !== threadId);

    if (remaining.length === 0) {
      // Re-initialize with a fresh conversation if all threads are deleted
      const freshId = `t-${Date.now()}`;
      const freshThread = {
        id: freshId,
        title: "New Conversation",
        date: "Just now",
        messages: [
          {
            id: `m-${Date.now()}`,
            role: "assistant",
            text: `Started a new conversation for workspace **${slug || "default"}**.`
          }
        ]
      };
      setThreads([freshThread]);
      setActiveThreadId(freshId);
    } else {
      setThreads(remaining);
      if (activeThreadId === threadId) {
        setActiveThreadId(remaining[0].id);
      }
    }
  };

  // Clear messages inside current active thread
  const handleClearCurrentMessages = () => {
    if (!activeThreadId) return;
    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThreadId
          ? {
              ...t,
              messages: [
                {
                  id: `m-${Date.now()}`,
                  role: "assistant",
                  text: "Cleared chat message history. Ready for new questions!"
                }
              ]
            }
          : t
      )
    );
  };

  const handleSend = async () => {
    if (!prompt.trim() || loadingResponse || !activeThread) return;

    const userText = prompt.trim();
    const userMsg = { id: Date.now().toString(), role: "user", text: userText };
    const updatedMessages = [...messages, userMsg];

    // Auto-update thread title from first user prompt
    const newTitle = messages.length <= 1 ? (userText.slice(0, 32) + (userText.length > 32 ? "..." : "")) : activeThread.title;

    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThreadId ? { ...t, title: newTitle, messages: updatedMessages } : t
      )
    );

    setPrompt("");
    setLoadingResponse(true);

    const apiFormatted = updatedMessages.map((m) => ({
      role: m.role,
      content: m.text
    }));

    try {
      const result = await executeCompletion(apiFormatted);

      const assistantMsg = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        reasoning: isReasoningEnabled ? `Evaluated via ${activeModel?.name || "Serverless LiteLLM Proxy"}...` : null,
        text: result.text || "Received response from model provider."
      };

      setThreads((prev) =>
        prev.map((t) =>
          t.id === activeThreadId ? { ...t, messages: [...t.messages, assistantMsg] } : t
        )
      );
    } catch (err) {
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: `[Error]: ${err.message || "Failed to execute completion."}`
      };

      setThreads((prev) =>
        prev.map((t) =>
          t.id === activeThreadId ? { ...t, messages: [...t.messages, errorMsg] } : t
        )
      );
    } finally {
      setLoadingResponse(false);
    }
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] flex bg-[#FAF8F4] overflow-hidden font-sans">
      {/* Threads Sidebar */}
      <div className="w-64 bg-white border-r border-stone-200/80 flex flex-col shrink-0">
        <div className="p-3 border-b border-stone-100 flex items-center justify-between">
          <span className="text-xs font-bold text-stone-900">Conversations ({threads.length})</span>
          <button
            onClick={handleNewThread}
            className="p-1.5 bg-[#2F6BFF] text-white rounded-lg hover:bg-blue-700 text-xs font-bold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> New
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {threads.map((t) => (
            <div
              key={t.id}
              onClick={() => setActiveThreadId(t.id)}
              className={`p-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-between text-xs group ${
                activeThreadId === t.id
                  ? "bg-blue-50/70 text-[#2F6BFF] font-semibold border border-blue-100"
                  : "text-stone-700 hover:bg-stone-50"
              }`}
            >
              <div className="truncate pr-2 flex-1">
                <div className="truncate font-medium">{t.title}</div>
                <div className="text-[10px] text-stone-400">{t.date}</div>
              </div>

              {/* ALWAYS VISIBLE TRASH DELETE BUTTON */}
              <button
                onClick={(e) => handleDeleteThread(e, t.id)}
                className="p-1 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Delete conversation thread"
              >
                <Trash className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Canvas */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="h-12 bg-white border-b border-stone-200/80 px-6 flex items-center justify-between text-xs text-stone-600 shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-stone-900">{activeThread?.title || "AI Assistant Chat"}</span>
            <span className="text-stone-300">|</span>
            <span className="text-[10px] font-bold text-[#2F6BFF] bg-blue-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Sparkle weight="fill" className="w-3 h-3 text-[#2F6BFF]" />
              <span>{activeModel?.name || "Active Model"}</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsReasoningEnabled(!isReasoningEnabled)}
              className={`px-3 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-colors ${
                isReasoningEnabled ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-stone-100 text-stone-500"
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span>{isReasoningEnabled ? "Reasoning Enabled" : "Fast Mode"}</span>
            </button>

            {/* Clear Messages Action Button */}
            <button
              onClick={handleClearCurrentMessages}
              className="px-3 py-1 text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-100 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-colors"
              title="Clear messages in current chat"
            >
              <Trash className="w-3.5 h-3.5" />
              <span>Clear Messages</span>
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-4xl mx-auto w-full">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-4 ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.role === "assistant" && (
                <div className="w-8 h-8 rounded-2xl bg-[#2F6BFF] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
                  HV
                </div>
              )}

              <div className={`space-y-2 max-w-2xl ${m.role === "user" ? "items-end" : "items-start"}`}>
                {m.reasoning && (
                  <div className="p-3 bg-stone-100/80 border border-stone-200/60 rounded-2xl text-[11px] text-stone-600 font-mono space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-stone-700">
                      <Brain className="w-3.5 h-3.5 text-amber-600" />
                      <span>Reasoning Process</span>
                    </div>
                    <p>{m.reasoning}</p>
                  </div>
                )}

                <div
                  className={`p-4 rounded-3xl text-xs leading-relaxed ${
                    m.role === "user"
                      ? "bg-[#2F6BFF] text-white font-medium shadow-md shadow-[#2F6BFF]/10"
                      : "bg-white text-stone-800 border border-stone-200/80 shadow-2xs whitespace-pre-wrap"
                  }`}
                >
                  {m.text}
                </div>

                {/* Quick Model Switcher on Account Restricted NIM Error */}
                {m.role === "assistant" && m.text?.includes("NVIDIA NIM Error") && (
                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-800 space-y-2">
                    <div className="font-bold flex items-center gap-1.5">
                      <Lightning className="w-4 h-4 text-amber-600" />
                      <span>Account Permission Required for this NIM Endpoint</span>
                    </div>
                    <p className="text-[11px]">This model endpoint is restricted on your NVIDIA developer account tier. Click below to switch to a 100% verified public model:</p>
                    <button
                      onClick={() => {
                        selectModel({
                          id: "meta/llama-3.3-70b-instruct",
                          name: "Llama 3.3 70B",
                          providerId: "nvidia"
                        });
                      }}
                      className="px-3.5 py-2 bg-[#2F6BFF] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 hover:bg-blue-700 transition-colors shadow-2xs"
                    >
                      <Sparkle className="w-3.5 h-3.5" />
                      <span>⚡ Switch to Llama 3.3 70B (Verified NIM Model)</span>
                    </button>
                  </div>
                )}

                {m.artifact && (
                  <div
                    onClick={() => setActiveArtifact(m.artifact)}
                    className="p-3 bg-blue-50/60 border border-blue-200/80 rounded-2xl cursor-pointer hover:bg-blue-100/50 transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <CodeBlock className="w-4 h-4 text-[#2F6BFF]" />
                      <div>
                        <div className="font-bold text-stone-900">{m.artifact.title}</div>
                        <div className="text-[10px] text-stone-500">Click to open Artifact Canvas</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-[#2F6BFF]">Open Canvas →</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loadingResponse && (
            <div className="flex items-center gap-3 text-xs text-stone-500 font-medium">
              <div className="w-8 h-8 rounded-2xl bg-[#2F6BFF] text-white flex items-center justify-center text-xs font-bold animate-pulse">
                HV
              </div>
              <span>Generating completion...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-stone-200/80 max-w-4xl mx-auto w-full rounded-t-3xl shadow-lg">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Ask anything, write code, or explain concepts..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={loadingResponse}
              className="flex-1 bg-stone-100/80 border border-stone-200 rounded-2xl px-4 py-3 text-xs outline-none text-stone-800 placeholder-stone-400 font-medium focus:border-[#2F6BFF]"
            />
            <button
              onClick={handleSend}
              disabled={loadingResponse}
              className="px-5 py-3 bg-[#2F6BFF] text-white font-bold rounded-2xl hover:bg-blue-700 shadow-md shadow-[#2F6BFF]/20 flex items-center gap-1.5 text-xs transition-all disabled:opacity-50"
            >
              <span>Send</span>
              <PaperPlane className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Side-by-side Artifact Canvas */}
      {activeArtifact && (
        <ArtifactCanvas artifact={activeArtifact} onClose={() => setActiveArtifact(null)} />
      )}
    </div>
  );
}
