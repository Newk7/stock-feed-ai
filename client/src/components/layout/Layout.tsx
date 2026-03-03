import { useState, type ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-surface-950">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <Header sidebarCollapsed={sidebarCollapsed} />
      <main
        className={`pt-14 transition-all duration-300 ${
          sidebarCollapsed ? "ml-16" : "ml-60"
        }`}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
