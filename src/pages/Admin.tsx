import { useState } from "react";
import { AdminProvider } from "@/stores/adminStore";
import AdminSidebar from "@/components/admin/AdminSidebar";
import DashboardHome from "@/components/admin/DashboardHome";
import PricelistManagement from "@/components/admin/PricelistManagement";
import LandingPageManagement from "@/components/admin/LandingPageManagement";
import TourPackageManagement from "@/components/admin/TourPackageManagement";
import AboutUsManagement from "@/components/admin/AboutUsManagement";
import PromoNotification from "@/components/admin/PromoNotification";
import { Bell, Search, User } from "lucide-react";

const tabTitles: Record<string, string> = {
  dashboard: "Dashboard Overview",
  pricelist: "Pricelist Management",
  landing: "Landing Page Management",
  tours: "Tour Package Management",
  about: "About Us Management",
  promo: "Promo & Notification",
};

function AdminContent() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "hsl(var(--background))" }}>
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header
          className="h-16 flex items-center justify-between px-6 flex-shrink-0"
          style={{ background: "hsl(var(--card))", borderBottom: "1px solid hsl(var(--border))" }}
        >
          <div>
            <h1 className="font-sora font-bold text-lg" style={{ color: "hsl(var(--foreground))" }}>
              {tabTitles[activeTab]}
            </h1>
            <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>DriveNusa Admin Panel</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "hsl(var(--muted-foreground))" }} />
              <input
                placeholder="Search..."
                className="pl-9 pr-4 py-2 rounded-xl text-sm outline-none w-52"
                style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }}
              />
            </div>
            <button className="w-9 h-9 rounded-xl flex items-center justify-center relative" style={{ background: "hsl(var(--muted))" }}>
              <Bell className="w-4 h-4" style={{ color: "hsl(var(--muted-foreground))" }} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: "hsl(0 84% 60%)" }} />
            </button>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm" style={{ background: "var(--gradient-primary)", color: "white" }}>
              <User className="w-4 h-4" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === "dashboard" && <DashboardHome />}
          {activeTab === "pricelist" && <PricelistManagement />}
          {activeTab === "landing" && <LandingPageManagement />}
          {activeTab === "tours" && <TourPackageManagement />}
          {activeTab === "about" && <AboutUsManagement />}
          {activeTab === "promo" && <PromoNotification />}
        </main>
      </div>
    </div>
  );
}

export default function Admin() {
  return (
    <AdminProvider>
      <AdminContent />
    </AdminProvider>
  );
}
