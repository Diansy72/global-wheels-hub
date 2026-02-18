import { Users, Star, Car } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface TrustSignalsProps {
  lang: "EN" | "ID";
}

const stats = [
  { icon: Car, value: 250, suffix: "+", labelEN: "Total Units", labelID: "Total Unit" },
  { icon: Users, value: 12000, suffix: "+", labelEN: "Happy Customers", labelID: "Pelanggan Puas" },
  { icon: Star, value: 4.9, suffix: "", labelEN: "Star Rating", labelID: "Rating Bintang", isDecimal: true },
];

function CountUp({ target, isDecimal }: { target: number; isDecimal?: boolean }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1800;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(isDecimal ? Math.round(current * 10) / 10 : Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, isDecimal]);

  return (
    <div ref={ref}>
      {isDecimal ? count.toFixed(1) : count.toLocaleString()}
    </div>
  );
}

export default function TrustSignals({ lang }: TrustSignalsProps) {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.labelEN}
              className="card-hover rounded-2xl p-8 flex flex-col items-center text-center"
              style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
            >
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-glow"
                style={{ background: "var(--gradient-primary)" }}
              >
                <stat.icon className="w-7 h-7" style={{ color: "hsl(0 0% 100%)" }} />
              </div>

              {/* Number */}
              <div className="font-sora font-extrabold text-5xl mb-1" style={{ color: "hsl(var(--primary))" }}>
                <CountUp target={stat.value} isDecimal={stat.isDecimal} />
                <span style={{ color: "hsl(var(--gold))" }}>{stat.suffix}</span>
              </div>

              {/* Stars for rating */}
              {stat.icon === Star && (
                <div className="flex gap-0.5 mb-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-current" style={{ color: "hsl(var(--gold))" }} />
                  ))}
                </div>
              )}

              <p className="font-inter font-medium" style={{ color: "hsl(var(--muted-foreground))" }}>
                {lang === "EN" ? stat.labelEN : stat.labelID}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
