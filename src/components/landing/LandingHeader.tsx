import { useState } from "react";
import { Menu, X, Globe, Car } from "lucide-react";

const navItems = {
  EN: ["Home", "Catalog", "Tour Packages", "About Us"],
  ID: ["Beranda", "Katalog", "Paket Tour", "Tentang Kami"],
};

interface LandingHeaderProps {
  lang: "EN" | "ID";
  setLang: (l: "EN" | "ID") => void;
}

export default function LandingHeader({ lang, setLang }: LandingHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const items = navItems[lang];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-dark">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
            <Car className="w-5 h-5" style={{ color: "hsl(0 0% 100%)" }} />
          </div>
          <span className="font-sora font-bold text-lg" style={{ color: "hsl(0 0% 100%)" }}>
            Drive<span style={{ color: "hsl(var(--gold))" }}>Nusa</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {items.map((item) => (
            <a
              key={item}
              href="#"
              className="font-inter text-sm font-medium transition-colors duration-200"
              style={{ color: "hsl(210 40% 85%)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "hsl(var(--gold))")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "hsl(210 40% 85%)")}
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <button
            onClick={() => setLang(lang === "EN" ? "ID" : "EN")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border"
            style={{
              color: "hsl(var(--gold))",
              borderColor: "hsl(var(--gold) / 0.4)",
              background: "hsl(var(--gold) / 0.08)",
            }}
          >
            <Globe className="w-3.5 h-3.5" />
            {lang === "EN" ? "ID" : "EN"}
          </button>

          {/* Login */}
          <a
            href="/admin"
            className="hidden md:inline-flex btn-gold text-sm px-4 py-2"
            style={{ color: "hsl(var(--accent-foreground))" }}
          >
            {lang === "EN" ? "Login" : "Masuk"}
          </a>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden"
            style={{ color: "hsl(0 0% 100%)" }}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="md:hidden glass-dark border-t" style={{ borderColor: "hsl(210 100% 45% / 0.2)" }}>
          <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
            {items.map((item) => (
              <a
                key={item}
                href="#"
                className="font-inter text-sm py-2"
                style={{ color: "hsl(210 40% 85%)" }}
              >
                {item}
              </a>
            ))}
            <a href="/admin" className="btn-gold text-sm text-center mt-2" style={{ color: "hsl(var(--accent-foreground))" }}>
              {lang === "EN" ? "Login" : "Masuk"}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
