import { useState } from "react";
import {
  LayoutDashboard, Car, MapPin, Package, Users, Bell, ChevronLeft, ChevronRight, LogOut, Bike,
} from "lucide-react";

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navItems = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "pricelist", icon: Car, label: "Pricelist" },
  { id: "landing", icon: MapPin, label: "Landing Page" },
  { id: "tours", icon: Package, label: "Tour Packages" },
  { id: "about", icon: Users, label: "About Us" },
  { id: "promo", icon: Bell, label: "Promo & Notif" },
];

export default function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className="flex flex-col h-screen sticky top-0 transition-all duration-300 flex-shrink-0"
      style={{
        width: collapsed ? "72px" : "260px",
        background: "linear-gradient(180deg, hsl(220 75% 14%) 0%, hsl(220 75% 10%) 100%)",
        borderRight: "1px solid hsl(0 0% 100% / 0.06)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16" style={{ borderBottom: "1px solid hsl(0 0% 100% / 0.08)" }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--gradient-gold)" }}>
          <Bike className="w-5 h-5" style={{ color: "hsl(220 75% 14%)" }} />
        </div>
        {!collapsed && (
          <span className="font-sora font-bold text-lg" style={{ color: "hsl(0 0% 100%)" }}>
            Drive<span style={{ color: "hsl(var(--gold))" }}>Nusa</span>
          </span>
        )}
      </div>

      {!collapsed && (
        <div className="px-5 pt-6 pb-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "hsl(210 30% 50%)" }}>
            Management
          </p>
        </div>
      )}

      <nav className="flex-1 px-3 py-2 space-y-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left group"
              style={{
                background: isActive ? "hsl(var(--gold) / 0.12)" : "transparent",
                color: isActive ? "hsl(var(--gold))" : "hsl(210 30% 65%)",
              }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
                style={{
                  background: isActive ? "hsl(var(--gold) / 0.2)" : "transparent",
                }}
              >
                <item.icon className="w-[18px] h-[18px]" />
              </div>
              {!collapsed && (
                <span className="font-inter font-medium text-sm">{item.label}</span>
              )}
              {isActive && !collapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: "hsl(var(--gold))" }} />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-3 space-y-1" style={{ borderTop: "1px solid hsl(0 0% 100% / 0.06)" }}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl transition-all"
          style={{ color: "hsl(210 30% 55%)", background: "hsl(0 0% 100% / 0.04)" }}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {!collapsed && <span className="text-xs font-medium">Collapse</span>}
        </button>
        <a
          href="/"
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl transition-all"
          style={{ color: "hsl(0 0% 100% / 0.5)" }}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span className="text-xs font-medium">Back to Site</span>}
        </a>
      </div>
    </aside>
  );
}
