import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import OverviewCards from "@/components/admin/OverviewCards";
import ArmadaTable from "@/components/admin/ArmadaTable";
import TestimonialManagement from "@/components/admin/TestimonialManagement";
import PromoCenter from "@/components/admin/PromoCenter";
import { BarChart2, Bell, Search, User } from "lucide-react";

const tabTitles: Record<string, string> = {
  overview: "Dashboard Overview",
  analytics: "Visitor Analytics",
  armada: "Armada Management",
  testimonials: "Testimonial Management",
  promo: "Promo Center",
};

// Simple bar chart for analytics
function SimpleAnalytics() {
  const data = [
    { label: "Mon", clicks: 320, bookings: 12 },
    { label: "Tue", clicks: 480, bookings: 18 },
    { label: "Wed", clicks: 390, bookings: 15 },
    { label: "Thu", clicks: 520, bookings: 22 },
    { label: "Fri", clicks: 680, bookings: 28 },
    { label: "Sat", clicks: 750, bookings: 31 },
    { label: "Sun", clicks: 610, bookings: 25 },
  ];
  const maxClicks = Math.max(...data.map((d) => d.clicks));

  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
    >
      <h3 className="font-sora font-bold text-base mb-1" style={{ color: "hsl(var(--foreground))" }}>
        Weekly Traffic
      </h3>
      <p className="text-sm mb-6" style={{ color: "hsl(var(--muted-foreground))" }}>
        Web clicks and bookings this week
      </p>
      <div className="flex items-end gap-4 h-40">
        {data.map((d) => (
          <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex flex-col items-center gap-1 justify-end" style={{ height: "120px" }}>
              <div
                className="w-full rounded-t-lg transition-all duration-500"
                style={{
                  height: `${(d.clicks / maxClicks) * 100}px`,
                  background: "var(--gradient-primary)",
                  minHeight: "8px",
                }}
              />
            </div>
            <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
              {d.label}
            </span>
            <span className="text-xs font-semibold" style={{ color: "hsl(var(--foreground))" }}>
              {d.clicks}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-6 mt-4 pt-4" style={{ borderTop: "1px solid hsl(var(--border))" }}>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ background: "hsl(var(--secondary))" }} />
          <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>Web Clicks</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ background: "hsl(var(--gold))" }} />
          <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>Bookings</span>
        </div>
      </div>
    </div>
  );
}

const Admin = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "hsl(var(--background))" }}>
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header
          className="h-16 flex items-center justify-between px-6 flex-shrink-0"
          style={{
            background: "hsl(var(--card))",
            borderBottom: "1px solid hsl(var(--border))",
          }}
        >
          <div>
            <h1 className="font-sora font-bold text-lg" style={{ color: "hsl(var(--foreground))" }}>
              {tabTitles[activeTab]}
            </h1>
            <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
              DriveNusa Admin Panel
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "hsl(var(--muted-foreground))" }} />
              <input
                placeholder="Search..."
                className="pl-9 pr-4 py-2 rounded-xl text-sm outline-none w-52"
                style={{
                  background: "hsl(var(--muted))",
                  border: "1px solid hsl(var(--border))",
                  color: "hsl(var(--foreground))",
                }}
              />
            </div>

            {/* Notification */}
            <button
              className="w-9 h-9 rounded-xl flex items-center justify-center relative"
              style={{ background: "hsl(var(--muted))" }}
            >
              <Bell className="w-4 h-4" style={{ color: "hsl(var(--muted-foreground))" }} />
              <span
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                style={{ background: "hsl(0 84% 60%)" }}
              />
            </button>

            {/* Avatar */}
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-sora font-bold text-sm"
              style={{ background: "var(--gradient-primary)", color: "hsl(0 0% 100%)" }}
            >
              <User className="w-4 h-4" />
            </div>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === "overview" && (
            <div>
              <OverviewCards />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SimpleAnalytics />
                <div
                  className="rounded-2xl p-6"
                  style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                >
                  <h3 className="font-sora font-bold text-base mb-4" style={{ color: "hsl(var(--foreground))" }}>
                    Recent Bookings
                  </h3>
                  {[
                    { name: "Sarah Johnson", vehicle: "BMW X5", date: "Mar 15", status: "active" },
                    { name: "Hiroshi Tanaka", vehicle: "Honda PCX", date: "Mar 14", status: "active" },
                    { name: "Emma Müller", vehicle: "Innova Reborn", date: "Mar 13", status: "completed" },
                    { name: "David Chen", vehicle: "NMAX 155", date: "Mar 12", status: "completed" },
                  ].map((b, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-3"
                      style={{ borderBottom: i < 3 ? "1px solid hsl(var(--border))" : "none" }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ background: "var(--gradient-primary)", color: "hsl(0 0% 100%)" }}
                        >
                          {b.name[0]}
                        </div>
                        <div>
                          <p className="font-medium text-sm" style={{ color: "hsl(var(--foreground))" }}>{b.name}</p>
                          <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{b.vehicle}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-semibold"
                          style={{
                            background: b.status === "active" ? "hsl(142 70% 40% / 0.1)" : "hsl(var(--muted))",
                            color: b.status === "active" ? "hsl(142 70% 35%)" : "hsl(var(--muted-foreground))",
                          }}
                        >
                          {b.status}
                        </span>
                        <p className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>{b.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="grid grid-cols-1 gap-6">
              <OverviewCards />
              <SimpleAnalytics />
            </div>
          )}

          {activeTab === "armada" && <ArmadaTable />}
          {activeTab === "testimonials" && <TestimonialManagement />}
          {activeTab === "promo" && <PromoCenter />}
        </main>
      </div>
    </div>
  );
};

export default Admin;
