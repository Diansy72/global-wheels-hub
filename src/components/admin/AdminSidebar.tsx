import { useState } from "react";
import {
  LayoutDashboard,
  Car,
  MessageSquare,
  Tag,
  BarChart2,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navItems = [
  { id: "overview", icon: LayoutDashboard, label: "Overview" },
  { id: "analytics", icon: BarChart2, label: "Analytics" },
  { id: "armada", icon: Car, label: "Armada" },
  { id: "testimonials", icon: MessageSquare, label: "Testimonials" },
  { id: "promo", icon: Tag, label: "Promo Center" },
];

export default function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className="flex flex-col h-screen sticky top-0 transition-all duration-300"
      style={{
        width: collapsed ? "72px" : "240px",
        background: "hsl(var(--primary))",
        borderRight: "1px solid hsl(0 0% 100% / 0.06)",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-4 h-16"
        style={{ borderBottom: "1px solid hsl(0 0% 100% / 0.08)" }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "hsl(var(--gold))" }}
        >
          <Car className="w-5 h-5" style={{ color: "hsl(var(--primary))" }} />
        </div>
        {!collapsed && (
          <span className="font-sora font-bold text-base" style={{ color: "hsl(0 0% 100%)" }}>
            Drive<span style={{ color: "hsl(var(--gold))" }}>Nusa</span>
          </span>
        )}
      </div>

      {/* Admin label */}
      {!collapsed && (
        <div className="px-4 pt-5 pb-2">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "hsl(210 40% 55%)" }}>
            Admin Panel
          </p>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left"
              style={{
                background: isActive ? "hsl(var(--gold) / 0.15)" : "transparent",
                color: isActive ? "hsl(var(--gold))" : "hsl(210 40% 72%)",
                borderLeft: isActive ? "3px solid hsl(var(--gold))" : "3px solid transparent",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "hsl(0 0% 100% / 0.06)";
                  e.currentTarget.style.color = "hsl(0 0% 90%)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "hsl(210 40% 72%)";
                }
              }}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <span className="font-inter font-medium text-sm">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse button */}
      <div className="p-3" style={{ borderTop: "1px solid hsl(0 0% 100% / 0.08)" }}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl transition-all"
          style={{ color: "hsl(210 40% 60%)", background: "hsl(0 0% 100% / 0.05)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(0 0% 100% / 0.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "hsl(0 0% 100% / 0.05)")}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {!collapsed && <span className="text-xs">Collapse</span>}
        </button>

        <a
          href="/"
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl transition-all mt-1"
          style={{ color: "hsl(0 84% 70%)", background: "transparent" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(0 84% 60% / 0.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span className="text-xs font-medium">Back to Site</span>}
        </a>
      </div>
    </aside>
  );
}
