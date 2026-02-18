import { MousePointerClick, CalendarCheck, Car, TrendingUp, TrendingDown } from "lucide-react";

const cards = [
  {
    label: "Total Web Clicks",
    value: "48,291",
    change: "+12.4%",
    up: true,
    icon: MousePointerClick,
    color: "var(--gradient-primary)",
  },
  {
    label: "Active Bookings",
    value: "127",
    change: "+5.2%",
    up: true,
    icon: CalendarCheck,
    color: "linear-gradient(135deg, hsl(142 70% 30%), hsl(142 70% 45%))",
  },
  {
    label: "Available Units",
    value: "89",
    change: "-3.1%",
    up: false,
    icon: Car,
    color: "var(--gradient-gold)",
  },
];

export default function OverviewCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-2xl p-6 relative overflow-hidden card-hover"
          style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
        >
          {/* Background accent */}
          <div
            className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-10 -translate-y-4 translate-x-4"
            style={{ background: card.color }}
          />

          <div className="flex items-start justify-between mb-4">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: card.color }}
            >
              <card.icon className="w-5 h-5" style={{ color: "hsl(0 0% 100%)" }} />
            </div>
            <span
              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{
                background: card.up ? "hsl(142 70% 40% / 0.1)" : "hsl(0 84% 60% / 0.1)",
                color: card.up ? "hsl(142 70% 40%)" : "hsl(0 84% 60%)",
              }}
            >
              {card.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {card.change}
            </span>
          </div>

          <p className="font-sora font-extrabold text-3xl mb-1" style={{ color: "hsl(var(--foreground))" }}>
            {card.value}
          </p>
          <p className="text-sm font-medium" style={{ color: "hsl(var(--muted-foreground))" }}>
            {card.label}
          </p>
        </div>
      ))}
    </div>
  );
}
