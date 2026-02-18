import { useState } from "react";
import { Search, Calendar, ChevronDown, MapPin } from "lucide-react";
import heroBali from "@/assets/hero-bali.jpg";

interface HeroSectionProps {
  lang: "EN" | "ID";
}

const content = {
  EN: {
    badge: "International Vehicle Rental",
    title: "Explore Indonesia",
    title2: "on Your Terms",
    sub: "Premium cars & motorcycles for the ultimate travel experience. Keyless. Flexible. Unforgettable.",
    type: "Vehicle Type",
    search: "Search by name...",
    date: "Pick-up Date",
    return: "Return Date",
    cta: "Search Vehicles",
    explore: "Explore Tours",
    types: ["Car", "Motorcycle"],
  },
  ID: {
    badge: "Rental Kendaraan Internasional",
    title: "Jelajahi Indonesia",
    title2: "Sesuai Keinginanmu",
    sub: "Mobil & motor premium untuk pengalaman perjalanan terbaik. Keyless. Fleksibel. Tak Terlupakan.",
    type: "Jenis Kendaraan",
    search: "Cari nama kendaraan...",
    date: "Tanggal Ambil",
    return: "Tanggal Kembali",
    cta: "Cari Kendaraan",
    explore: "Lihat Paket Tour",
    types: ["Mobil", "Motor"],
  },
};

export default function HeroSection({ lang }: HeroSectionProps) {
  const t = content[lang];
  const [selectedType, setSelectedType] = useState(t.types[0]);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBali})` }}
      />
      <div className="absolute inset-0 gradient-hero" />

      {/* Floating orbs */}
      <div
        className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl pointer-events-none"
        style={{ background: "hsl(210 100% 45% / 0.15)" }}
      />
      <div
        className="absolute bottom-1/3 left-1/4 w-48 h-48 rounded-full blur-3xl pointer-events-none"
        style={{ background: "hsl(43 95% 55% / 0.1)" }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-16 flex flex-col items-center text-center">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 animate-fade-in-up"
          style={{
            background: "hsl(var(--gold) / 0.15)",
            border: "1px solid hsl(var(--gold) / 0.4)",
            color: "hsl(var(--gold))",
          }}
        >
          <MapPin className="w-3 h-3" />
          {t.badge}
        </div>

        {/* Title */}
        <h1
          className="font-sora font-extrabold text-5xl md:text-7xl leading-tight mb-4 animate-fade-in-up"
          style={{ color: "hsl(0 0% 100%)", animationDelay: "0.1s" }}
        >
          {t.title}
          <br />
          <span style={{ color: "hsl(var(--gold))" }}>{t.title2}</span>
        </h1>

        {/* Subtitle */}
        <p
          className="font-inter text-base md:text-lg max-w-xl mb-10 leading-relaxed animate-fade-in-up"
          style={{ color: "hsl(210 40% 82%)", animationDelay: "0.2s" }}
        >
          {t.sub}
        </p>

        {/* Search Bar */}
        <div
          className="w-full max-w-3xl glass rounded-2xl p-4 animate-fade-in-up shadow-lg"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="flex flex-col md:flex-row gap-3">
            {/* Type Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl w-full md:w-40 justify-between text-sm font-medium transition-all"
                style={{
                  background: "hsl(0 0% 100% / 0.15)",
                  color: "hsl(0 0% 100%)",
                  border: "1px solid hsl(0 0% 100% / 0.2)",
                }}
              >
                <span>{selectedType}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {showTypeDropdown && (
                <div
                  className="absolute top-full left-0 mt-1 w-full rounded-xl overflow-hidden z-20 shadow-md"
                  style={{ background: "hsl(220 75% 14%)" }}
                >
                  {t.types.map((type) => (
                    <button
                      key={type}
                      onClick={() => { setSelectedType(type); setShowTypeDropdown(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm transition-colors"
                      style={{ color: "hsl(0 0% 100%)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(210 100% 45% / 0.2)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "hsl(0 0% 100% / 0.6)" }} />
              <input
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                placeholder={t.search}
                style={{
                  background: "hsl(0 0% 100% / 0.12)",
                  color: "hsl(0 0% 100%)",
                  border: "1px solid hsl(0 0% 100% / 0.2)",
                }}
              />
            </div>

            {/* Date Pickers */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "hsl(0 0% 100% / 0.6)" }} />
              <input
                type="date"
                className="pl-10 pr-4 py-3 rounded-xl text-sm outline-none w-full md:w-40"
                style={{
                  background: "hsl(0 0% 100% / 0.12)",
                  color: "hsl(0 0% 100%)",
                  border: "1px solid hsl(0 0% 100% / 0.2)",
                }}
              />
            </div>

            {/* CTA */}
            <button className="btn-gold font-sora text-sm px-6 py-3 whitespace-nowrap" style={{ color: "hsl(var(--accent-foreground))" }}>
              {t.cta}
            </button>
          </div>
        </div>

        {/* Explore CTA */}
        <button
          className="mt-6 text-sm font-medium underline underline-offset-4 animate-fade-in-up"
          style={{ color: "hsl(210 40% 75%)", animationDelay: "0.4s" }}
        >
          {t.explore} ↓
        </button>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ height: "80px", width: "100%" }}>
          <path d="M0,60 C360,0 1080,80 1440,20 L1440,80 L0,80 Z" fill="hsl(210 20% 98%)" />
        </svg>
      </div>
    </section>
  );
}
