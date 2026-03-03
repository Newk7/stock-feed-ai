import { NavLink } from "react-router-dom";
import {
  Zap,
  LayoutDashboard,
  Newspaper,
  BarChart3,
  Grid3x3,
  Bookmark,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/news", icon: Newspaper, label: "News Feed" },
  { to: "/sectors", icon: BarChart3, label: "Sectors" },
  { to: "/screener", icon: Grid3x3, label: "Screener" },
  { to: "/saved", icon: Bookmark, label: "Saved" },
];

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { user, signOut } = useAuth();

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-surface-900 border-r border-surface-800
                   flex flex-col z-40 transition-all duration-300
                   ${collapsed ? "w-16" : "w-60"}`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 h-14 border-b border-surface-800 shrink-0">
        <div className="p-1.5 bg-wire-600 rounded-lg shrink-0">
          <Zap className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <span className="text-sm font-bold text-white whitespace-nowrap">SmartWire</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="ml-auto p-1 rounded-md hover:bg-surface-800 text-surface-400 hover:text-surface-200 transition-colors shrink-0"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all
               ${isActive
                 ? "bg-wire-600/15 text-wire-400 border border-wire-600/20"
                 : "text-surface-400 hover:bg-surface-800 hover:text-surface-200 border border-transparent"
               }`
            }
          >
            <Icon className="w-4.5 h-4.5 shrink-0" />
            {!collapsed && <span className="whitespace-nowrap">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="border-t border-surface-800 p-2 space-y-0.5">
        <NavLink
          to="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-surface-400
                     hover:bg-surface-800 hover:text-surface-200 transition-all"
        >
          <Settings className="w-4.5 h-4.5 shrink-0" />
          {!collapsed && <span>Settings</span>}
        </NavLink>

        {user && (
          <div className="flex items-center gap-3 px-3 py-2">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt=""
                className="w-6 h-6 rounded-full shrink-0"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-wire-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                {(user.displayName || user.email || "U")[0].toUpperCase()}
              </div>
            )}
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-surface-200 truncate">
                  {user.displayName || user.email}
                </p>
              </div>
            )}
            <button
              onClick={signOut}
              className="p-1 rounded-md hover:bg-surface-800 text-surface-500 hover:text-loss transition-colors shrink-0"
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
