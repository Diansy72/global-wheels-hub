import { useState } from "react";
import { useAdmin, PromoNotif } from "@/stores/adminStore";
import { Plus, X, Check, Pencil, Trash2, Bell, BellRing, Calendar } from "lucide-react";

const emptyForm = { title: "", description: "", expiredDate: "", pushNotification: false };

export default function PromoNotification() {
  const { promos, setPromos } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const inputStyle = { background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" };

  const handleSave = () => {
    if (!form.title) return;
    if (editingId !== null) {
      setPromos((prev) => prev.map((p) => p.id === editingId ? { ...p, ...form } : p));
    } else {
      setPromos((prev) => [...prev, { id: Date.now(), ...form, active: true }]);
    }
    setShowForm(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const openEdit = (p: PromoNotif) => {
    setForm({ title: p.title, description: p.description, expiredDate: p.expiredDate, pushNotification: p.pushNotification });
    setEditingId(p.id);
    setShowForm(true);
  };

  const handleDelete = (id: number) => setPromos((prev) => prev.filter((p) => p.id !== id));
  const toggleActive = (id: number) => setPromos((prev) => prev.map((p) => p.id === id ? { ...p, active: !p.active } : p));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-sora font-bold text-xl" style={{ color: "hsl(var(--foreground))" }}>Promo & Notification</h2>
          <p className="text-sm mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>{promos.filter((p) => p.active).length} active promos</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> New Promo
        </button>
      </div>

      {showForm && (
        <div className="mb-6 p-6 rounded-2xl" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", boxShadow: "var(--shadow-sm)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-sora font-semibold" style={{ color: "hsl(var(--foreground))" }}>{editingId ? "Edit" : "Create"} Promo</h3>
            <button onClick={() => setShowForm(false)}><X className="w-5 h-5" style={{ color: "hsl(var(--muted-foreground))" }} /></button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>Title</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} placeholder="Early Bird Discount" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none" style={inputStyle} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>Expired Date</label>
                <input type="date" value={form.expiredDate} onChange={(e) => setForm({ ...form, expiredDate: e.target.value })} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => setForm({ ...form, pushNotification: !form.pushNotification })}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium w-full"
                  style={inputStyle}
                >
                  {form.pushNotification ? <BellRing className="w-4 h-4" style={{ color: "hsl(var(--gold))" }} /> : <Bell className="w-4 h-4" style={{ color: "hsl(var(--muted-foreground))" }} />}
                  Push Notification: {form.pushNotification ? "ON" : "OFF"}
                </button>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-5">
            <button onClick={handleSave} className="btn-primary flex items-center gap-2 text-sm"><Check className="w-4 h-4" /> Save</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl text-sm" style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}>Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {promos.map((p) => (
          <div key={p.id} className="flex items-center justify-between p-5 rounded-2xl transition-all" style={{
            background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", boxShadow: "var(--shadow-sm)",
            opacity: p.active ? 1 : 0.6,
          }}>
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: p.pushNotification ? "var(--gradient-gold)" : "hsl(var(--muted))" }}>
                {p.pushNotification ? <BellRing className="w-5 h-5" style={{ color: "hsl(220 75% 14%)" }} /> : <Bell className="w-5 h-5" style={{ color: "hsl(var(--muted-foreground))" }} />}
              </div>
              <div>
                <p className="font-sora font-semibold text-sm" style={{ color: "hsl(var(--foreground))" }}>{p.title}</p>
                <p className="text-xs mt-0.5 line-clamp-1" style={{ color: "hsl(var(--muted-foreground))" }}>{p.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="w-3 h-3" style={{ color: "hsl(var(--muted-foreground))" }} />
                  <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>Expires {p.expiredDate}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Toggle */}
              <button
                onClick={() => toggleActive(p.id)}
                className="w-10 h-5 rounded-full transition-colors flex items-center px-0.5"
                style={{ background: p.active ? "hsl(142 70% 40%)" : "hsl(var(--border))" }}
              >
                <div className="w-4 h-4 rounded-full transition-transform" style={{ background: "white", transform: p.active ? "translateX(20px)" : "translateX(0)" }} />
              </button>
              <button onClick={() => openEdit(p)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "hsl(var(--secondary) / 0.1)", color: "hsl(var(--secondary))" }}><Pencil className="w-3.5 h-3.5" /></button>
              <button onClick={() => handleDelete(p.id)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "hsl(0 84% 60% / 0.1)", color: "hsl(0 84% 50%)" }}><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
