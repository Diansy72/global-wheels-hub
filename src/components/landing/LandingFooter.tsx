import { MapPin, Instagram, Facebook, Youtube, Twitter, Car, Mail, Phone } from "lucide-react";

interface LandingFooterProps {
  lang: "EN" | "ID";
}

export default function LandingFooter({ lang }: LandingFooterProps) {
  return (
    <footer style={{ background: "hsl(var(--primary))" }}>
      {/* Main footer */}
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "hsl(var(--gold))" }}
              >
                <Car className="w-5 h-5" style={{ color: "hsl(var(--primary))" }} />
              </div>
              <span className="font-sora font-bold text-xl" style={{ color: "hsl(0 0% 100%)" }}>
                Drive<span style={{ color: "hsl(var(--gold))" }}>Nusa</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "hsl(210 40% 70%)" }}>
              {lang === "EN"
                ? "Indonesia's premier international vehicle rental service. Est. 2019, Bali."
                : "Layanan rental kendaraan internasional terkemuka Indonesia. Didirikan 2019, Bali."}
            </p>
            {/* Social media */}
            <div className="flex gap-3">
              {[Instagram, Facebook, Youtube, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
                  style={{ background: "hsl(0 0% 100% / 0.08)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(var(--gold) / 0.2)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "hsl(0 0% 100% / 0.08)")}
                >
                  <Icon className="w-4 h-4" style={{ color: "hsl(210 40% 75%)" }} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-sora font-semibold mb-4" style={{ color: "hsl(0 0% 100%)" }}>
              {lang === "EN" ? "Quick Links" : "Tautan Cepat"}
            </h4>
            <ul className="space-y-2.5">
              {(lang === "EN"
                ? ["Home", "Catalog", "Tour Packages", "About Us", "Contact"]
                : ["Beranda", "Katalog", "Paket Tour", "Tentang Kami", "Kontak"]
              ).map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm transition-colors"
                    style={{ color: "hsl(210 40% 70%)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "hsl(var(--gold))")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "hsl(210 40% 70%)")}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-sora font-semibold mb-4" style={{ color: "hsl(0 0% 100%)" }}>
              {lang === "EN" ? "Contact Us" : "Hubungi Kami"}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "hsl(var(--gold))" }} />
                <span className="text-sm" style={{ color: "hsl(210 40% 70%)" }}>
                  Jl. Bypass Ngurah Rai No. 21, Kuta, Bali 80361, Indonesia
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 flex-shrink-0" style={{ color: "hsl(var(--gold))" }} />
                <span className="text-sm" style={{ color: "hsl(210 40% 70%)" }}>
                  +62 361 123 4567
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 flex-shrink-0" style={{ color: "hsl(var(--gold))" }} />
                <span className="text-sm" style={{ color: "hsl(210 40% 70%)" }}>
                  hello@drivenusa.com
                </span>
              </li>
            </ul>
          </div>

          {/* Map placeholder */}
          <div>
            <h4 className="font-sora font-semibold mb-4" style={{ color: "hsl(0 0% 100%)" }}>
              {lang === "EN" ? "Find Us" : "Temukan Kami"}
            </h4>
            <div
              className="h-36 rounded-2xl overflow-hidden flex items-center justify-center"
              style={{ background: "hsl(0 0% 100% / 0.06)", border: "1px solid hsl(0 0% 100% / 0.1)" }}
            >
              <div className="text-center">
                <MapPin className="w-8 h-8 mx-auto mb-2" style={{ color: "hsl(var(--gold))" }} />
                <p className="text-xs" style={{ color: "hsl(210 40% 60%)" }}>Kuta, Bali</p>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs mt-1 inline-block underline"
                  style={{ color: "hsl(var(--gold))" }}
                >
                  {lang === "EN" ? "Open in Maps" : "Buka di Maps"}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid hsl(0 0% 100% / 0.08)" }}>
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs" style={{ color: "hsl(210 40% 55%)" }}>
            © 2024 DriveNusa. {lang === "EN" ? "All rights reserved." : "Hak cipta dilindungi."}
          </p>
          <p className="text-xs" style={{ color: "hsl(210 40% 55%)" }}>
            {lang === "EN" ? "Made with ❤️ in Bali, Indonesia 🇮🇩" : "Dibuat dengan ❤️ di Bali, Indonesia 🇮🇩"}
          </p>
        </div>
      </div>
    </footer>
  );
}
