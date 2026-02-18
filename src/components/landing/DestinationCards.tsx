import { MapPin, Clock, Star } from "lucide-react";
import komodoImg from "@/assets/dest-komodo.jpg";
import rajaAmpatImg from "@/assets/dest-rajaampat.jpg";
import labuanBajoImg from "@/assets/dest-labuanbajo.jpg";

interface DestinationCardsProps {
  lang: "EN" | "ID";
}

const destinations = [
  {
    nameEN: "Komodo Island",
    nameID: "Pulau Komodo",
    locationEN: "East Nusa Tenggara",
    locationID: "Nusa Tenggara Timur",
    duration: "3D/2N",
    rating: 4.9,
    priceUSD: 299,
    priceIDR: "4.500.000",
    img: komodoImg,
    tag: "Trending",
  },
  {
    nameEN: "Raja Ampat",
    nameID: "Raja Ampat",
    locationEN: "West Papua",
    locationID: "Papua Barat",
    duration: "5D/4N",
    rating: 5.0,
    priceUSD: 499,
    priceIDR: "7.500.000",
    img: rajaAmpatImg,
    tag: "Top Pick",
  },
  {
    nameEN: "Labuan Bajo",
    nameID: "Labuan Bajo",
    locationEN: "Flores, NTT",
    locationID: "Flores, NTT",
    duration: "4D/3N",
    rating: 4.8,
    priceUSD: 349,
    priceIDR: "5.200.000",
    img: labuanBajoImg,
    tag: "Popular",
  },
];

export default function DestinationCards({ lang }: DestinationCardsProps) {
  return (
    <section className="py-16" style={{ background: "hsl(var(--muted))" }}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "hsl(var(--secondary))" }}>
            {lang === "EN" ? "Discover" : "Temukan"}
          </p>
          <h2 className="section-title text-4xl">
            {lang === "EN" ? "Recommended Destinations" : "Destinasi Unggulan"}
          </h2>
          <p className="section-subtitle mt-2 max-w-lg mx-auto">
            {lang === "EN"
              ? "Handpicked destinations for the ultimate Indonesian adventure"
              : "Destinasi pilihan untuk petualangan Indonesia terbaik"}
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {destinations.map((dest) => (
            <div
              key={dest.nameEN}
              className="rounded-3xl overflow-hidden card-hover group"
              style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={dest.img}
                  alt={dest.nameEN}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Tag badge */}
                <div
                  className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold"
                  style={{ background: "var(--gradient-gold)", color: "hsl(var(--accent-foreground))" }}
                >
                  {dest.tag}
                </div>
                {/* Rating */}
                <div
                  className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
                  style={{ background: "hsl(220 75% 14% / 0.85)", color: "hsl(0 0% 100%)" }}
                >
                  <Star className="w-3 h-3 fill-current" style={{ color: "hsl(var(--gold))" }} />
                  {dest.rating}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-sora font-bold text-lg" style={{ color: "hsl(var(--foreground))" }}>
                      {lang === "EN" ? dest.nameEN : dest.nameID}
                    </h3>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5" style={{ color: "hsl(var(--muted-foreground))" }} />
                      <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                        {lang === "EN" ? dest.locationEN : dest.locationID}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                    <Clock className="w-3.5 h-3.5" />
                    {dest.duration}
                  </div>
                </div>

                {/* Price row */}
                <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: "1px solid hsl(var(--border))" }}>
                  <div>
                    <span className="font-sora font-bold text-xl" style={{ color: "hsl(var(--primary))" }}>
                      ${dest.priceUSD}
                    </span>
                    <span className="text-xs ml-1" style={{ color: "hsl(var(--muted-foreground))" }}>
                      / Rp {dest.priceIDR}
                    </span>
                  </div>
                  <button className="btn-primary text-sm px-4 py-2">
                    {lang === "EN" ? "Book Tour" : "Pesan Sekarang"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
