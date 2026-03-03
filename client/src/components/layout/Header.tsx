import { useState } from "react";
import { Search, Bell, RefreshCw } from "lucide-react";

interface HeaderProps {
  sidebarCollapsed: boolean;
}

export default function Header({ sidebarCollapsed }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header
      className={`fixed top-0 right-0 h-14 bg-surface-900/80 backdrop-blur-xl border-b border-surface-800
                   flex items-center gap-4 px-6 z-30 transition-all duration-300
                   ${sidebarCollapsed ? "left-16" : "left-60"}`}
    >
      {/* Search */}
      <div className="relative flex-1 max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tickers, news, sectors..."
          className="w-full pl-10 pr-4 py-1.5 text-sm bg-surface-800/50 border border-surface-700/50 rounded-lg
                     text-surface-200 placeholder-surface-500 focus:outline-none focus:ring-1
                     focus:ring-wire-600/50 focus:border-wire-600/50 transition-all"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-surface-500 bg-surface-700/50 px-1.5 py-0.5 rounded">
          /
        </kbd>
      </div>

      {/* Market status ticker */}
      <div className="hidden md:flex items-center gap-4 text-xs font-mono">
        <span className="text-surface-500">Market:</span>
        <span className="text-gain">S&P +0.42%</span>
        <span className="text-loss">NASDAQ -0.18%</span>
        <span className="text-gain">DOW +0.31%</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <button className="p-2 rounded-lg hover:bg-surface-800 text-surface-400 hover:text-surface-200 transition-colors" title="Refresh data">
          <RefreshCw className="w-4 h-4" />
        </button>
        <button className="p-2 rounded-lg hover:bg-surface-800 text-surface-400 hover:text-surface-200 transition-colors relative" title="Notifications">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-wire-500 rounded-full" />
        </button>
      </div>
    </header>
  );
}
