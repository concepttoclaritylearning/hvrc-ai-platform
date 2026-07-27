import React, { useState } from "react";
import { User, Key, HardDrive, ShieldCheck, CheckCircle, CloudCheck, ArrowClockwise, LockKey } from "@phosphor-icons/react";
import useUser from "@/hooks/useUser";

export default function ProfilePage() {
  const { user } = useUser();
  const [driveConnected, setDriveConnected] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState("Just now");

  const [profileName, setProfileName] = useState(user?.username || user?.name || "HVRC Developer");
  const [profileEmail, setProfileEmail] = useState(user?.email || "user@hvrc.ai");
  const [showEditModal, setShowEditModal] = useState(false);
  const [tempName, setTempName] = useState("");
  const [tempEmail, setTempEmail] = useState("");

  const handleOpenEdit = () => {
    setTempName(profileName);
    setTempEmail(profileEmail);
    setShowEditModal(true);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!tempName.trim()) return;
    setProfileName(tempName.trim());
    setProfileEmail(tempEmail.trim() || "user@hvrc.ai");
    setShowEditModal(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in font-sans">
      <div>
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">Account & Cloud Backup</h1>
        <p className="text-stone-600 text-xs mt-1">Manage profile details, Google Drive auto-sync, and BYOK storage encryption.</p>
      </div>

      {/* User Card */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-stone-900 text-white font-bold text-xl flex items-center justify-center shadow-md">
            {profileName?.[0]?.toUpperCase() || "H"}
          </div>
          <div>
            <h2 className="text-lg font-bold text-stone-900">{profileName}</h2>
            <p className="text-xs text-stone-400">{profileEmail}</p>
            <span className="text-[10px] font-bold text-[#2F6BFF] bg-blue-50 px-2.5 py-0.5 rounded-full inline-block mt-2">
              Google Authenticated
            </span>
          </div>
        </div>

        <button
          onClick={handleOpenEdit}
          className="px-4 py-2 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
        >
          Edit Profile
        </button>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4">
            <h3 className="text-base font-bold text-stone-900">Edit Profile Details</h3>
            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Display Name</label>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 outline-none text-stone-800 font-medium"
                />
              </div>
              <div>
                <label className="block font-bold text-stone-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 outline-none text-stone-800 font-medium"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-xl font-semibold text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2F6BFF] text-white font-bold rounded-xl hover:bg-blue-700 shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Google Drive Integration Card */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#2F6BFF] flex items-center justify-center font-bold">
              <CloudCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">Google Drive Sync & Backup</h3>
              <p className="text-xs text-stone-400">Automatically sync your projects, chats, and workspace code to your Google Drive.</p>
            </div>
          </div>

          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full flex items-center gap-1.5 border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5" />
            Connected
          </span>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div>
            <div className="text-xs font-bold text-stone-800">Auto-Backup Workspace & Chats</div>
            <div className="text-[11px] text-stone-400">Last backup: {lastSyncTime}</div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSyncNow}
              className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ArrowClockwise className={`w-3.5 h-3.5 text-[#2F6BFF] ${isSyncing ? "animate-spin" : ""}`} />
              <span>{isSyncing ? "Syncing..." : "Sync Now"}</span>
            </button>

            <button
              onClick={() => setAutoSync(!autoSync)}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                autoSync ? "bg-[#2F6BFF]" : "bg-stone-300"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  autoSync ? "translate-x-6" : "translate-x-0"
                }`}
              ></div>
            </button>
          </div>
        </div>
      </div>

      {/* Storage & Usage */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-[#2F6BFF]" />
          <span>Storage & Vector RAG Quota</span>
        </h3>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-stone-600">
            <span>Vector Embeddings Storage</span>
            <span className="font-bold text-stone-900">42 MB / 1 GB</span>
          </div>
          <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
            <div className="w-[12%] h-full bg-[#2F6BFF] rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
