import { useState } from "react";
import { Key, MapPin, ChevronDown, ChevronUp, Car, Bike } from "lucide-react";
import carSuvImg from "@/assets/car-suv.jpg";
import motorcycleImg from "@/assets/motorcycle.jpg";

interface ProductCardsProps {
  lang: "EN" | "ID";
}

const vehicles = [
  {
    id: 1,
    nameEN: "BMW X5 Premium",
    nameID: "BMW X5 Premium",
    type: "Car",
    priceDay: 850000,
    status: "available",
    keyless: true,
    img: carSuvImg,
    seats: 7,
    outsideCityMultiplier: 1.5,
  },
  {
    id: 2,
    nameEN: "Toyota Innova Reborn",
    nameID: "Toyota Innova Reborn",
    type: "Car",
    priceDay: 550000,
    status: "booked",
    keyless: false,
    img: carSuvImg,
    seats: 8,
    outsideCityMultiplier: 1.4,
  },
  {
    id: 3,
    nameEN: "Honda PCX 160",
    nameID: "Honda PCX 160",
    type: "Motorcycle",
    priceDay: 120000,
    status: "available",
    keyless: true,
    img: motorcycleImg,
    seats: 2,
    outsideCityMultiplier: 1.3,
  },
  {
    id: 4,
    nameEN: "Yamaha NMAX 155",
    nameID: "Yamaha NMAX 155",
    type: "Motorcycle",
    priceDay: 110000,
    status: "available",
    keyless: false,
    img: motorcycleImg,
    seats: 2,
    outsideCityMultiplier: 1.3,
  },
];

function VehicleCard({ vehicle, lang }: { vehicle: typeof vehicles[0]; lang: "EN" | "ID" }) {
  const [showOutsideCity, setShowOutsideCity] = useState(false);
  const outsideCityPrice = Math.round(vehicle.priceDay * vehicle.outsideCityMultiplier);

  return (
    <div
      className="rounded-3xl overflow-hidden card-hover"
      style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden" style={{ background: "hsl(var(--muted))" }}>
        <img src={vehicle.img} alt={vehicle.nameEN} className="w-full h-full object-cover" />

        {/* Status badge */}
        <div className="absolute top-3 left-3">
          {vehicle.status === "available" ? (
            <span className="badge-available">{lang === "EN" ? "Available" : "Tersedia"}</span>
          ) : (
            <span className="badge-booked">{lang === "EN" ? "Booked" : "Dipesan"}</span>
          )}
        </div>

        {/* Keyless badge */}
        {vehicle.keyless && (
          <div className="absolute top-3 right-3">
            <span className="badge-keyless flex items-center gap-1">
              <Key className="w-3 h-3" />
              Keyless
            </span>
          </div>
        )}

        {/* Type icon */}
        <div
          className="absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: "hsl(var(--primary) / 0.9)" }}
        >
          {vehicle.type === "Car" ? (
            <Car className="w-4 h-4" style={{ color: "hsl(0 0% 100%)" }} />
          ) : (
            <Bike className="w-4 h-4" style={{ color: "hsl(0 0% 100%)" }} />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-sora font-bold text-base mb-1" style={{ color: "hsl(var(--foreground))" }}>
          {lang === "EN" ? vehicle.nameEN : vehicle.nameID}
        </h3>
        <p className="text-xs mb-3" style={{ color: "hsl(var(--muted-foreground))" }}>
          {vehicle.seats} {lang === "EN" ? "seats" : "kursi"}
        </p>

        {/* Price */}
        <div className="flex items-baseline gap-1 mb-3">
          <span className="font-sora font-bold text-2xl" style={{ color: "hsl(var(--primary))" }}>
            Rp {vehicle.priceDay.toLocaleString("id-ID")}
          </span>
          <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
            /{lang === "EN" ? "day" : "hari"}
          </span>
        </div>

        {/* Outside City estimator */}
        <button
          onClick={() => setShowOutsideCity(!showOutsideCity)}
          className="w-full flex items-center justify-between text-xs px-3 py-2 rounded-lg mb-3 transition-colors"
          style={{
            background: "hsl(var(--muted))",
            color: "hsl(var(--muted-foreground))",
          }}
        >
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            {lang === "EN" ? "Outside city estimate" : "Estimasi luar kota"}
          </div>
          {showOutsideCity ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showOutsideCity && (
          <div
            className="mb-3 px-3 py-2 rounded-lg text-xs"
            style={{ background: "hsl(var(--accent) / 0.08)", border: "1px solid hsl(var(--accent) / 0.2)" }}
          >
            <p style={{ color: "hsl(var(--muted-foreground))" }}>
              {lang === "EN" ? "Outside city price:" : "Harga luar kota:"}
            </p>
            <p className="font-bold text-sm mt-0.5" style={{ color: "hsl(var(--accent-foreground))" }}>
              Rp {outsideCityPrice.toLocaleString("id-ID")} /{lang === "EN" ? "day" : "hari"}
            </p>
            <p className="mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
              {lang === "EN" ? `(×${vehicle.outsideCityMultiplier} multiplier)` : `(×${vehicle.outsideCityMultiplier} pengali)`}
            </p>
          </div>
        )}

        {/* CTA */}
        <button
          disabled={vehicle.status === "booked"}
          className="w-full btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {vehicle.status === "available"
            ? lang === "EN" ? "Rent Now" : "Sewa Sekarang"
            : lang === "EN" ? "Not Available" : "Tidak Tersedia"}
        </button>
      </div>
    </div>
  );
}

export default function ProductCards({ lang }: ProductCardsProps) {
  const [filter, setFilter] = useState<"All" | "Car" | "Motorcycle">("All");

  const filtered = vehicles.filter(
    (v) => filter === "All" || v.type === filter
  );

  const filterLabels = {
    EN: { All: "All", Car: "Cars", Motorcycle: "Motorcycles" },
    ID: { All: "Semua", Car: "Mobil", Motorcycle: "Motor" },
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "hsl(var(--secondary))" }}>
            {lang === "EN" ? "Our Fleet" : "Armada Kami"}
          </p>
          <h2 className="section-title text-4xl">
            {lang === "EN" ? "Available Vehicles" : "Kendaraan Tersedia"}
          </h2>
        </div>

        {/* Filter tabs */}
        <div className="flex justify-center gap-2 mb-8">
          {(["All", "Car", "Motorcycle"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200"
              style={
                filter === f
                  ? { background: "var(--gradient-primary)", color: "hsl(0 0% 100%)" }
                  : { background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }
              }
            >
              {filterLabels[lang][f]}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  );
}
