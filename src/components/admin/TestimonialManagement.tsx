import { useState } from "react";
import { Check, Trash2, Play, Star } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  origin: string;
  rating: number;
  text: string;
  type: "video" | "text";
  status: "pending" | "approved";
  date: string;
}

const initialTestimonials: Testimonial[] = [
  { id: 1, name: "Sarah Johnson", origin: "USA 🇺🇸", rating: 5, text: "DriveNusa made our Bali trip absolutely magical! The BMW X5 was immaculate...", type: "text", status: "pending", date: "2024-03-15" },
  { id: 2, name: "Hiroshi Tanaka", origin: "Japan 🇯🇵", rating: 5, text: "Excellent service. The staff was very professional and the PCX motorcycle was perfect...", type: "video", status: "pending", date: "2024-03-14" },
  { id: 3, name: "Emma Müller", origin: "Germany 🇩🇪", rating: 4, text: "Amazing fleet and super easy booking process. The outside city pricing was transparent...", type: "text", status: "approved", date: "2024-03-12" },
  { id: 4, name: "David Chen", origin: "Singapore 🇸🇬", rating: 4, text: "Great experience overall! Rented the Innova for a week-long road trip across Java...", type: "video", status: "pending", date: "2024-03-10" },
];

export default function TestimonialManagement() {
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  const handleApprove = (id: number) => {
    setTestimonials((t) => t.map((item) => item.id === id ? { ...item, status: "approved" } : item));
  };

  const handleDelete = (id: number) => {
    setTestimonials((t) => t.filter((item) => item.id !== id));
  };

  const filtered = filter === "all" ? testimonials : testimonials.filter((t) => t.status === filter);
  const pendingCount = testimonials.filter((t) => t.status === "pending").length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-sora font-bold text-xl" style={{ color: "hsl(var(--foreground))" }}>
            Testimonial Management
          </h2>
          <p className="text-sm mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>
            {pendingCount} pending approval
          </p>
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          {(["all", "pending", "approved"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all"
              style={
                filter === f
                  ? { background: "var(--gradient-primary)", color: "hsl(0 0% 100%)" }
                  : { background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }
              }
            >
              {f}
              {f === "pending" && pendingCount > 0 && (
                <span
                  className="ml-1.5 px-1.5 py-0.5 rounded-full text-xs"
                  style={{ background: "hsl(0 84% 60%)", color: "hsl(0 0% 100%)" }}
                >
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((t) => (
          <div
            key={t.id}
            className="rounded-2xl p-4 relative"
            style={{
              background: "hsl(var(--card))",
              border: `1px solid ${t.status === "pending" ? "hsl(43 95% 55% / 0.3)" : "hsl(var(--border))"}`,
            }}
          >
            {/* Status indicator */}
            <div
              className="absolute top-4 right-4 px-2 py-0.5 rounded-full text-xs font-semibold"
              style={{
                background: t.status === "approved" ? "hsl(142 70% 40% / 0.1)" : "hsl(43 95% 55% / 0.1)",
                color: t.status === "approved" ? "hsl(142 70% 35%)" : "hsl(43 70% 40%)",
              }}
            >
              {t.status}
            </div>

            {/* Video preview */}
            {t.type === "video" && (
              <div
                className="h-20 rounded-xl flex items-center justify-center mb-3 cursor-pointer"
                style={{ background: "var(--gradient-primary)" }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: "hsl(0 0% 100% / 0.2)" }}
                >
                  <Play className="w-4 h-4 ml-0.5" style={{ color: "hsl(0 0% 100%)" }} />
                </div>
              </div>
            )}

            {/* Stars */}
            <div className="flex gap-0.5 mb-2">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" style={{ color: "hsl(var(--gold))" }} />
              ))}
            </div>

            {/* Text */}
            <p className="text-sm leading-relaxed mb-3 pr-16 line-clamp-2" style={{ color: "hsl(var(--foreground))" }}>
              "{t.text}"
            </p>

            {/* Meta */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-sora font-semibold text-sm" style={{ color: "hsl(var(--foreground))" }}>
                  {t.name}
                </p>
                <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                  {t.origin} · {t.date}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {t.status === "pending" && (
                  <button
                    onClick={() => handleApprove(t.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                    style={{ background: "hsl(142 70% 40% / 0.1)", color: "hsl(142 70% 35%)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(142 70% 40% / 0.2)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "hsl(142 70% 40% / 0.1)")}
                  >
                    <Check className="w-3.5 h-3.5" />
                    Approve
                  </button>
                )}
                <button
                  onClick={() => handleDelete(t.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{ background: "hsl(0 84% 60% / 0.1)", color: "hsl(0 84% 50%)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(0 84% 60% / 0.2)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "hsl(0 84% 60% / 0.1)")}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
