import { useState } from "react";
import { useAdmin } from "@/stores/adminStore";
import { MousePointerClick, CalendarCheck, Car } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const weeklyData = [
  { label: "Mon", clicks: 3200, bookings: 5 },
  { label: "Tue", clicks: 4000, bookings: 8 },
  { label: "Wed", clicks: 3800, bookings: 6 },
  { label: "Thu", clicks: 5200, bookings: 12 },
  { label: "Fri", clicks: 4800, bookings: 10 },
  { label: "Sat", clicks: 6000, bookings: 15 },
  { label: "Sun", clicks: 5500, bookings: 11 },
];

const monthlyData = [
  { label: "Jan", clicks: 12400, bookings: 45 },
  { label: "Feb", clicks: 14200, bookings: 52 },
  { label: "Mar", clicks: 11800, bookings: 38 },
  { label: "Apr", clicks: 15600, bookings: 61 },
  { label: "May", clicks: 18200, bookings: 72 },
  { label: "Jun", clicks: 16800, bookings: 65 },
];

export default function DashboardHome() {
  const { vehicles, bookings, webClicks } = useAdmin();
  const [period, setPeriod] = useState<"weekly" | "monthly">("weekly");

  const activeBookings = vehicles.filter((v) => v.status === "Booked").length;
  const availableUnits = vehicles.filter((v) => v.status === "Available").length;

  const stats = [
    { label: "Total Web Clicks", value: webClicks.toLocaleString("id-ID"), icon: MousePointerClick, gradient: "var(--gradient-primary)" },
    { label: "Active Bookings", value: activeBookings.toString(), icon: CalendarCheck, gradient: "linear-gradient(135deg, hsl(142 70% 35%), hsl(160 60% 45%))" },
    { label: "Available Units", value: availableUnits.toString(), icon: Car, gradient: "var(--gradient-gold)" },
  ];

  const data = period === "weekly" ? weeklyData : monthlyData;
  const maxClicks = Math.max(...data.map((d) => d.clicks));
  const maxBookings = Math.max(...data.map((d) => d.bookings));

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-1"
            style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", boxShadow: "var(--shadow-sm)" }}
          >
            <div className="absolute top-0 right-0 w-28 h-28 rounded-full blur-3xl opacity-10 -translate-y-6 translate-x-6" style={{ background: s.gradient }} />
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: s.gradient }}>
                <s.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium" style={{ color: "hsl(var(--muted-foreground))" }}>{s.label}</span>
            </div>
            <p className="font-sora font-extrabold text-3xl" style={{ color: "hsl(var(--foreground))" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="rounded-2xl p-6" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", boxShadow: "var(--shadow-sm)" }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-sora font-bold text-lg" style={{ color: "hsl(var(--foreground))" }}>Performance Overview</h3>
            <p className="text-sm" style={{ color: "hsl(var(--secondary))" }}>Web clicks & booking trends</p>
          </div>
          <div className="flex rounded-xl overflow-hidden" style={{ border: "1px solid hsl(var(--border))" }}>
            {(["weekly", "monthly"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className="px-5 py-2 text-xs font-semibold capitalize transition-all"
                style={{
                  background: period === p ? "hsl(var(--secondary))" : "transparent",
                  color: period === p ? "white" : "hsl(var(--muted-foreground))",
                  borderRadius: period === p ? "0.625rem" : "0",
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.75rem",
                boxShadow: "var(--shadow-sm)",
                fontSize: "12px",
              }}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              formatter={(value) => <span style={{ color: "hsl(var(--muted-foreground))", fontSize: "12px", marginLeft: "4px" }}>{value}</span>}
            />
            <Line yAxisId="left" type="monotone" dataKey="clicks" name="Web Clicks" stroke="hsl(var(--secondary))" strokeWidth={2.5} dot={{ r: 4, fill: "white", stroke: "hsl(var(--secondary))", strokeWidth: 2 }} activeDot={{ r: 6 }} />
            <Line yAxisId="right" type="monotone" dataKey="bookings" name="Bookings" stroke="hsl(var(--gold))" strokeWidth={2.5} dot={{ r: 4, fill: "white", stroke: "hsl(var(--gold))", strokeWidth: 2 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Bookings */}
      <div className="rounded-2xl p-6" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", boxShadow: "var(--shadow-sm)" }}>
        <h3 className="font-sora font-bold text-lg mb-4" style={{ color: "hsl(var(--foreground))" }}>Recent Bookings</h3>
        {bookings.length === 0 ? (
          <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>No bookings yet</p>
        ) : (
          <div className="space-y-3">
            {bookings.slice(0, 5).map((b) => (
              <div key={b.id} className="flex items-center justify-between py-3 px-4 rounded-xl" style={{ background: "hsl(var(--muted) / 0.5)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm" style={{ background: "var(--gradient-primary)", color: "white" }}>
                    {b.vehicleName[0]}
                  </div>
                  <div>
                    <p className="font-medium text-sm" style={{ color: "hsl(var(--foreground))" }}>{b.vehicleName}</p>
                    <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{b.plateNumber} · {b.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium" style={{ color: "hsl(var(--foreground))" }}>{b.duration} days</p>
                  <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{b.bookingDate}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
