import { useState } from "react";
import { useAdmin, Destination } from "@/stores/adminStore";
import { Plus, X, Check, Pencil, Trash2, MapPin, Upload } from "lucide-react";

const emptyForm = { title: "", description: "", image: "", location: "" };

export default function LandingPageManagement() {
  const { destinations, setDestinations, getBestVehicles } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const bestVehicles = getBestVehicles();

  const openEdit = (d: Destination) => {
    setForm({ title: d.title, description: d.description, image: d.image, location: d.location });
    setEditingId(d.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.title) return;
    if (editingId !== null) {
      setDestinations((prev) => prev.map((d) => d.id === editingId ? { ...d, ...form } : d));
    } else {
      setDestinations((prev) => [...prev, { id: Date.now(), ...form }]);
    }
    setShowForm(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleDelete = (id: number) => setDestinations((prev) => prev.filter((d) => d.id !== id));

  const inputStyle = { background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" };

  return (
    <div className="space-y-6">
      {/* Best Vehicles Section */}
      <div className="rounded-2xl p-6" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", boxShadow: "var(--shadow-sm)" }}>
        <h3 className="font-sora font-bold text-lg mb-1" style={{ color: "hsl(var(--foreground))" }}>🏆 Best Vehicles (Auto-ranked)</h3>
        <p className="text-sm mb-4" style={{ color: "hsl(var(--muted-foreground))" }}>Ranked by total bookings — shown on landing page automatically</p>
        {bestVehicles.length === 0 ? (
          <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>No booking data yet</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {bestVehicles.map((v, i) => (
              <div key={v.name} className="p-4 rounded-xl text-center" style={{ background: "hsl(var(--muted) / 0.5)", border: "1px solid hsl(var(--border))" }}>
                <span className="text-lg font-bold" style={{ color: "hsl(var(--gold))" }}>#{i + 1}</span>
                <p className="font-sora font-semibold text-sm mt-1" style={{ color: "hsl(var(--foreground))" }}>{v.name}</p>
                <p className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>{v.totalBookings} bookings · {v.category}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Destinations */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-sora font-bold text-xl" style={{ color: "hsl(var(--foreground))" }}>Recommended Destinations</h2>
            <p className="text-sm mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>{destinations.length} destinations</p>
          </div>
          <button onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }} className="btn-primary flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> Add Destination
          </button>
        </div>

        {showForm && (
          <div className="mb-6 p-6 rounded-2xl" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", boxShadow: "var(--shadow-sm)" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-sora font-semibold" style={{ color: "hsl(var(--foreground))" }}>{editingId ? "Edit" : "Add"} Destination</h3>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5" style={{ color: "hsl(var(--muted-foreground))" }} /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>Title</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} placeholder="Komodo Island" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                  <MapPin className="w-3 h-3 inline mr-1" />Location
                </label>
                <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} placeholder="Flores, NTT" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none" style={inputStyle} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>Image</label>
                <div className="px-3 py-2.5 rounded-xl text-sm flex items-center gap-2 cursor-pointer" style={inputStyle}>
                  <Upload className="w-4 h-4" style={{ color: "hsl(var(--muted-foreground))" }} />
                  <span style={{ color: "hsl(var(--muted-foreground))" }}>Upload Image</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={handleSave} className="btn-primary flex items-center gap-2 text-sm"><Check className="w-4 h-4" /> Save</button>
              <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl text-sm font-medium" style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}>Cancel</button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {destinations.map((d) => (
            <div key={d.id} className="rounded-2xl overflow-hidden transition-all hover:-translate-y-1" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", boxShadow: "var(--shadow-sm)" }}>
              <div className="h-40 flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
                <MapPin className="w-10 h-10 text-white/40" />
              </div>
              <div className="p-4">
                <h4 className="font-sora font-bold text-base" style={{ color: "hsl(var(--foreground))" }}>{d.title}</h4>
                <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "hsl(var(--muted-foreground))" }}>
                  <MapPin className="w-3 h-3" />{d.location}
                </p>
                <p className="text-sm mt-2 line-clamp-2" style={{ color: "hsl(var(--muted-foreground))" }}>{d.description}</p>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => openEdit(d)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold" style={{ background: "hsl(var(--secondary) / 0.1)", color: "hsl(var(--secondary))" }}><Pencil className="w-3 h-3" /> Edit</button>
                  <button onClick={() => handleDelete(d.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold" style={{ background: "hsl(0 84% 60% / 0.1)", color: "hsl(0 84% 50%)" }}><Trash2 className="w-3 h-3" /> Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
