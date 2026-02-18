import { Star, Quote, Play } from "lucide-react";

interface TestimonialsProps {
  lang: "EN" | "ID";
}

const testimonials = [
  {
    name: "Sarah Johnson",
    origin: "USA 🇺🇸",
    rating: 5,
    textEN: "DriveNusa made our Bali trip absolutely magical! The BMW X5 was immaculate and keyless pickup was so convenient. Will use again!",
    textID: "DriveNusa membuat perjalanan Bali kami luar biasa! BMW X5 sangat bersih dan pengambilan tanpa kunci sangat nyaman. Akan digunakan lagi!",
    avatar: "SJ",
    type: "text",
  },
  {
    name: "Hiroshi Tanaka",
    origin: "Japan 🇯🇵",
    rating: 5,
    textEN: "Excellent service. The staff was very professional and the PCX motorcycle was perfect for exploring narrow Ubud streets.",
    textID: "Layanan sangat baik. Staf sangat profesional dan motor PCX sempurna untuk menjelajahi jalanan sempit Ubud.",
    avatar: "HT",
    type: "video",
  },
  {
    name: "Emma Müller",
    origin: "Germany 🇩🇪",
    rating: 5,
    textEN: "Amazing fleet and super easy booking process. The outside city pricing was transparent and fair. Highly recommended!",
    textID: "Armada luar biasa dan proses pemesanan sangat mudah. Harga luar kota transparan dan wajar. Sangat direkomendasikan!",
    avatar: "EM",
    type: "text",
  },
  {
    name: "David Chen",
    origin: "Singapore 🇸🇬",
    rating: 4,
    textEN: "Great experience overall! Rented the Innova for a week-long road trip across Java. Very reliable and comfortable.",
    textID: "Pengalaman luar biasa secara keseluruhan! Menyewa Innova untuk perjalanan darat seminggu melintasi Jawa. Sangat andal dan nyaman.",
    avatar: "DC",
    type: "video",
  },
];

export default function Testimonials({ lang }: TestimonialsProps) {
  return (
    <section className="py-16" style={{ background: "hsl(var(--muted))" }}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "hsl(var(--secondary))" }}>
            {lang === "EN" ? "Reviews" : "Ulasan"}
          </p>
          <h2 className="section-title text-4xl">
            {lang === "EN" ? "What Our Customers Say" : "Apa Kata Pelanggan Kami"}
          </h2>
          <p className="section-subtitle mt-2">
            {lang === "EN"
              ? "Real stories from real travelers around the world"
              : "Kisah nyata dari para wisatawan di seluruh dunia"}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="card-hover rounded-3xl p-6 relative"
              style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
            >
              {/* Quote icon */}
              <Quote
                className="absolute top-5 right-5 w-8 h-8 opacity-10"
                style={{ color: "hsl(var(--primary))" }}
              />

              {/* Video indicator */}
              {t.type === "video" && (
                <div
                  className="mb-4 h-32 rounded-2xl flex items-center justify-center cursor-pointer group"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ background: "hsl(0 0% 100% / 0.2)" }}
                  >
                    <Play className="w-5 h-5 ml-0.5" style={{ color: "hsl(0 0% 100%)" }} />
                  </div>
                  <span
                    className="ml-3 text-sm font-medium"
                    style={{ color: "hsl(0 0% 100% / 0.8)" }}
                  >
                    {lang === "EN" ? "Watch Review" : "Tonton Ulasan"}
                  </span>
                </div>
              )}

              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" style={{ color: "hsl(var(--gold))" }} />
                ))}
              </div>

              {/* Review text */}
              <p className="font-inter text-sm leading-relaxed mb-5" style={{ color: "hsl(var(--foreground))" }}>
                "{lang === "EN" ? t.textEN : t.textID}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-sora font-bold text-sm"
                  style={{ background: "var(--gradient-primary)", color: "hsl(0 0% 100%)" }}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="font-sora font-semibold text-sm" style={{ color: "hsl(var(--foreground))" }}>
                    {t.name}
                  </p>
                  <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                    {t.origin}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
