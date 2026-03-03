import { useState } from "react";
import { Settings as SettingsIcon, Database, Key, RefreshCw } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";

export default function Settings() {
  const { user } = useAuth();
  const [s3Prefix, setS3Prefix] = useState("");
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    if (!s3Prefix) return;
    setSyncing(true);
    setSyncStatus(null);
    try {
      const result: any = await api.syncManifests(s3Prefix);
      setSyncStatus(`Synced ${result.synced} manifests (${result.errors} errors)`);
    } catch (err: any) {
      setSyncStatus(`Error: ${err.message}`);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <SettingsIcon className="w-6 h-6 text-wire-400" />
        <h1 className="text-2xl font-bold text-white">Settings</h1>
      </div>

      {/* Profile */}
      <div className="card p-6">
        <h2 className="text-sm font-semibold text-surface-200 mb-4">Profile</h2>
        <div className="flex items-center gap-4">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="" className="w-12 h-12 rounded-full" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-wire-600 flex items-center justify-center text-lg font-bold text-white">
              {(user?.displayName || user?.email || "U")[0].toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-surface-100">
              {user?.displayName || "User"}
            </p>
            <p className="text-xs text-surface-400">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* S3 Manifest Sync */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-4 h-4 text-wire-400" />
          <h2 className="text-sm font-semibold text-surface-200">
            S3 Manifest Sync
          </h2>
        </div>
        <p className="text-xs text-surface-400 mb-4">
          Sync news manifests from your S3 bucket into the local database.
        </p>
        <div className="flex gap-3">
          <input
            type="text"
            value={s3Prefix}
            onChange={(e) => setS3Prefix(e.target.value)}
            placeholder="S3 prefix (e.g., news/2025/02/)"
            className="input flex-1"
          />
          <button
            onClick={handleSync}
            disabled={syncing || !s3Prefix}
            className="btn-primary gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
            Sync
          </button>
        </div>
        {syncStatus && (
          <p className={`text-xs mt-2 ${syncStatus.startsWith("Error") ? "text-loss" : "text-gain"}`}>
            {syncStatus}
          </p>
        )}
      </div>

      {/* API Keys */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Key className="w-4 h-4 text-wire-400" />
          <h2 className="text-sm font-semibold text-surface-200">
            API Configuration
          </h2>
        </div>
        <p className="text-xs text-surface-400">
          API keys and S3 credentials are configured via environment variables
          on the server. See <code className="text-wire-400">.env.example</code> for
          the required configuration.
        </p>
      </div>
    </div>
  );
}
