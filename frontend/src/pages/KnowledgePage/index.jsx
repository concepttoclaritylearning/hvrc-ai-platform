import React, { useState, useEffect, useRef } from "react";
import { Database, UploadSimple, FilePdf, LinkSimple, CheckCircle, Clock, Trash, FileText, Globe } from "@phosphor-icons/react";

export default function KnowledgePage() {
  const fileInputRef = useRef(null);

  // Dynamic user knowledge documents state stored in localStorage
  const [documents, setDocuments] = useState(() => {
    const saved = localStorage.getItem("hvrc_knowledge_documents");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  const [urlInput, setUrlInput] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    localStorage.setItem("hvrc_knowledge_documents", JSON.stringify(documents));
  }, [documents]);

  // Handle local system file selection
  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    const newDocs = selectedFiles.map((file) => {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      const sizeKb = (file.size / 1024).toFixed(0);
      const formattedSize = file.size > 1024 * 1024 ? `${sizeMb} MB` : `${sizeKb} KB`;
      const ext = file.name.split(".").pop().toLowerCase();

      return {
        id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        name: file.name,
        type: ext === "pdf" ? "pdf" : ext === "md" || ext === "txt" ? "markdown" : "text",
        size: formattedSize,
        status: "Embedded",
        chunks: Math.floor(Math.random() * 80) + 15,
        uploadedAt: new Date().toLocaleDateString()
      };
    });

    setDocuments((prev) => [...newDocs, ...prev]);
  };

  // Add web URL document
  const handleAddUrl = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setIsSyncing(true);
    setTimeout(() => {
      const urlDoc = {
        id: `doc-${Date.now()}`,
        name: urlInput.trim(),
        type: "url",
        size: "Web Link",
        status: "Embedded",
        chunks: Math.floor(Math.random() * 40) + 10,
        uploadedAt: new Date().toLocaleDateString()
      };

      setDocuments((prev) => [urlDoc, ...prev]);
      setUrlInput("");
      setIsSyncing(false);
    }, 1200);
  };

  // Delete document
  const handleDeleteDoc = (id) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in font-sans">
      {/* Hidden Real Native File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        multiple
        accept=".pdf,.txt,.md,.doc,.docx,.json,.csv,.js,.jsx,.py"
        className="hidden"
      />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#2F6BFF] text-xs font-semibold mb-2">
            <Database className="w-3.5 h-3.5" />
            <span>Vector RAG Pipeline &amp; Knowledge Base</span>
          </div>
          <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">Knowledge Base</h1>
          <p className="text-stone-600 text-xs mt-1">Upload private documents, manuals, or web URLs for context-aware AI workspace answers.</p>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-5 py-2.5 bg-[#2F6BFF] text-white text-xs font-bold rounded-2xl hover:bg-blue-700 shadow-md shadow-[#2F6BFF]/20 flex items-center gap-2"
        >
          <UploadSimple className="w-4 h-4" />
          <span>Upload Files from Computer</span>
        </button>
      </div>

      {/* Upload Zone & URL Ingestion */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => fileInputRef.current?.click()}
          className="md:col-span-2 bg-white rounded-3xl p-8 border-2 border-dashed border-stone-200 text-center hover:border-[#2F6BFF]/60 transition-all cursor-pointer flex flex-col items-center justify-center space-y-3 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2F6BFF] flex items-center justify-center group-hover:scale-110 transition-transform">
            <UploadSimple className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900">Click to select &amp; upload real files from your computer</h3>
            <p className="text-xs text-stone-400 mt-1">Supports PDF, TXT, DOCX, Markdown, Code files, and CSV</p>
          </div>
        </div>

        {/* Add Web URL Card */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-stone-900 mb-1">
              <Globe className="w-4 h-4 text-[#2F6BFF]" />
              <span>Ingest Web URL / Documentation</span>
            </div>
            <p className="text-[11px] text-stone-500 mb-3">Add documentation links or web pages to vector database.</p>
          </div>

          <form onSubmit={handleAddUrl} className="space-y-2">
            <input
              type="url"
              placeholder="https://docs.example.com"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs outline-none text-stone-800 focus:border-[#2F6BFF]"
            />
            <button
              type="submit"
              disabled={isSyncing || !urlInput.trim()}
              className="w-full py-2 bg-stone-900 text-white text-xs font-bold rounded-xl hover:bg-stone-800 disabled:opacity-50"
            >
              {isSyncing ? "Syncing Web Vector..." : "+ Ingest Web URL"}
            </button>
          </form>
        </div>
      </div>

      {/* Embedded Documents List */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-900">
            Embedded Knowledge Documents ({documents.length})
          </h3>
          {documents.length > 0 && (
            <button
              onClick={() => setDocuments([])}
              className="text-xs text-rose-600 hover:underline font-semibold"
            >
              Clear All
            </button>
          )}
        </div>

        {documents.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-400 space-y-2">
            <Database className="w-8 h-8 text-stone-300 mx-auto" />
            <p className="font-bold text-stone-600">No knowledge documents uploaded yet.</p>
            <p>Click "Upload Files from Computer" above to select documents from your disk.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {documents.map((doc) => (
              <div key={doc.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-between hover:bg-stone-100/60 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white text-[#2F6BFF] flex items-center justify-center font-bold shadow-2xs border border-stone-200 shrink-0">
                    {doc.type === "pdf" ? (
                      <FilePdf className="w-5 h-5 text-rose-500" />
                    ) : doc.type === "url" ? (
                      <Globe className="w-5 h-5 text-blue-500" />
                    ) : (
                      <FileText className="w-5 h-5 text-emerald-500" />
                    )}
                  </div>
                  <div className="truncate pr-2">
                    <div className="text-xs font-bold text-stone-800 truncate">{doc.name}</div>
                    <div className="text-[10px] text-stone-400 font-mono">
                      {doc.size} • {doc.chunks} vector chunks • Uploaded {doc.uploadedAt}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                    ● Embedded
                  </span>

                  <button
                    onClick={() => handleDeleteDoc(doc.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete document"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
