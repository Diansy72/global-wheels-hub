import { useState } from "react";
import { Send, Tag, Percent, Users, Bell, Check } from "lucide-react";

interface Promo {
  id: number;
  code: string;
  discount: number;
  type: "percentage" | "fixed";
  expiry: string;
  active: boolean;
}

const existingPromos: Promo[] = [
  { id: 1, code: "BALI2024", discount: 20, type: "percentage", expiry: "2024-12-31", active: true },
  { id: 2, code: "TOURIST50K", discount: 50000, type: "fixed", expiry: "2024-06-30", active: true },
  { id: 3, code: "NEWUSER15", discount: 15, type: "percentage", expiry: "2024-09-30", active: false },
];

export default function PromoCenter() {
  const [promos, setPromos] = useState(existingPromos);
  const [form, setForm] = useState({
    code: "",
    discount: "",
    type: "percentage",
    expiry: "",
    emails: "",
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPromo: Promo = {
      id: Date.now(),
      code: form.code.toUpperCase(),
      discount: Number(form.discount),
      type: form.type as "percentage" | "fixed",
      expiry: form.expiry,
      active: true,
    };
    setPromos((p) => [newPromo, ...p]);
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setForm({ code: "", discount: "", type: "percentage", expiry: "", emails: "" });
  };

  const togglePromo = (id: number) => {
    setPromos((p) => p.map((item) => item.id === id ? { ...item, active: !item.active } : item));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Create Promo Form */}
      <div
        className="rounded-2xl p-6"
        style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
      >
        <div className="flex items-center gap-2 mb-5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "var(--gradient-gold)" }}
          >
            <Tag className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} />
          </div>
          <div>
            <h3 className="font-sora font-bold text-base" style={{ color: "hsl(var(--foreground))" }}>
              Create Promo
            </h3>
            <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
              New discount code & notification
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {/* Promo Code */}
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "hsl(var(--muted-foreground))" }}>
                Promo Code
              </label>
              <input
                required
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                placeholder="e.g. BALI2025"
                className="w-full px-3 py-2 rounded-lg text-sm outline-none uppercase"
                style={{
                  background: "hsl(var(--muted))",
                  border: "1px solid hsl(var(--border))",
                  color: "hsl(var(--foreground))",
                }}
              />
            </div>

            {/* Discount type */}
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "hsl(var(--muted-foreground))" }}>
                Type
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{
                  background: "hsl(var(--muted))",
                  border: "1px solid hsl(var(--border))",
                  color: "hsl(var(--foreground))",
                }}
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed (Rp)</option>
              </select>
            </div>

            {/* Discount value */}
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "hsl(var(--muted-foreground))" }}>
                Discount {form.type === "percentage" ? "(%)" : "(Rp)"}
              </label>
              <div className="relative">
                <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "hsl(var(--muted-foreground))" }} />
                <input
                  required
                  type="number"
                  value={form.discount}
                  onChange={(e) => setForm({ ...form, discount: e.target.value })}
                  placeholder={form.type === "percentage" ? "20" : "50000"}
                  className="w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none"
                  style={{
                    background: "hsl(var(--muted))",
                    border: "1px solid hsl(var(--border))",
                    color: "hsl(var(--foreground))",
                  }}
                />
              </div>
            </div>

            {/* Expiry */}
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "hsl(var(--muted-foreground))" }}>
                Expiry Date
              </label>
              <input
                required
                type="date"
                value={form.expiry}
                onChange={(e) => setForm({ ...form, expiry: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{
                  background: "hsl(var(--muted))",
                  border: "1px solid hsl(var(--border))",
                  color: "hsl(var(--foreground))",
                }}
              />
            </div>
          </div>

          {/* Email Notification */}
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "hsl(var(--muted-foreground))" }}>
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                Send to Customer Emails (comma separated)
              </div>
            </label>
            <textarea
              value={form.emails}
              onChange={(e) => setForm({ ...form, emails: e.target.value })}
              placeholder="customer1@email.com, customer2@email.com..."
              rows={3}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
              style={{
                background: "hsl(var(--muted))",
                border: "1px solid hsl(var(--border))",
                color: "hsl(var(--foreground))",
              }}
            />
          </div>

          <button
            type="submit"
            className="w-full btn-primary flex items-center justify-center gap-2 text-sm"
          >
            {sent ? (
              <>
                <Check className="w-4 h-4" />
                Promo Created & Notified!
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Create & Send Notification
              </>
            )}
          </button>
        </form>
      </div>

      {/* Active Promos List */}
      <div
        className="rounded-2xl p-6"
        style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
      >
        <div className="flex items-center gap-2 mb-5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Bell className="w-4 h-4" style={{ color: "hsl(0 0% 100%)" }} />
          </div>
          <div>
            <h3 className="font-sora font-bold text-base" style={{ color: "hsl(var(--foreground))" }}>
              Active Promos
            </h3>
            <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
              {promos.filter((p) => p.active).length} promos running
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {promos.map((promo) => (
            <div
              key={promo.id}
              className="flex items-center justify-between px-4 py-3 rounded-xl"
              style={{
                background: promo.active ? "hsl(var(--muted))" : "hsl(var(--muted) / 0.5)",
                border: "1px solid hsl(var(--border))",
                opacity: promo.active ? 1 : 0.6,
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="px-2.5 py-1 rounded-lg font-sora font-bold text-sm"
                  style={{ background: "var(--gradient-gold)", color: "hsl(var(--accent-foreground))" }}
                >
                  {promo.code}
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: "hsl(var(--foreground))" }}>
                    {promo.type === "percentage" ? `${promo.discount}% off` : `Rp ${promo.discount.toLocaleString("id-ID")} off`}
                  </p>
                  <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                    Expires {promo.expiry}
                  </p>
                </div>
              </div>

              {/* Toggle */}
              <button
                onClick={() => togglePromo(promo.id)}
                className="w-10 h-5 rounded-full transition-colors flex items-center px-0.5"
                style={{ background: promo.active ? "hsl(var(--secondary))" : "hsl(var(--border))" }}
              >
                <div
                  className="w-4 h-4 rounded-full transition-transform"
                  style={{ background: "hsl(0 0% 100%)", transform: promo.active ? "translateX(20px)" : "translateX(0)" }}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
