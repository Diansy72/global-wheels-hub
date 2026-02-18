import { useState } from "react";
import { Pencil, Trash2, Plus, X, Check, Key, Car, Bike } from "lucide-react";
import carImg from "@/assets/car-suv.jpg";
import motoImg from "@/assets/motorcycle.jpg";

type VehicleStatus = "available" | "booked" | "maintenance";

interface Vehicle {
  id: number;
  name: string;
  type: "Car" | "Motorcycle";
  price: number;
  status: VehicleStatus;
  keyless: boolean;
  plate: string;
}

const initialVehicles: Vehicle[] = [
  { id: 1, name: "BMW X5 Premium", type: "Car", price: 850000, status: "available", keyless: true, plate: "DK 1234 AA" },
  { id: 2, name: "Toyota Innova Reborn", type: "Car", price: 550000, status: "booked", keyless: false, plate: "DK 5678 BB" },
  { id: 3, name: "Honda PCX 160", type: "Motorcycle", price: 120000, status: "available", keyless: true, plate: "DK 9012 CC" },
  { id: 4, name: "Yamaha NMAX 155", type: "Motorcycle", price: 110000, status: "available", keyless: false, plate: "DK 3456 DD" },
  { id: 5, name: "Toyota Avanza", type: "Car", price: 420000, status: "maintenance", keyless: false, plate: "DK 7890 EE" },
];

const statusConfig: Record<VehicleStatus, { label: string; bg: string; color: string }> = {
  available: { label: "Available", bg: "hsl(142 70% 40% / 0.12)", color: "hsl(142 70% 35%)" },
  booked: { label: "Booked", bg: "hsl(0 84% 60% / 0.1)", color: "hsl(0 84% 50%)" },
  maintenance: { label: "Maintenance", bg: "hsl(38 95% 55% / 0.12)", color: "hsl(38 80% 40%)" },
};

export default function ArmadaTable() {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", type: "Car", price: "", status: "available", keyless: false, plate: "" });

  const handleDelete = (id: number) => {
    setVehicles((v) => v.filter((item) => item.id !== id));
  };

  const handleEdit = (v: Vehicle) => {
    setEditingId(v.id);
    setForm({ name: v.name, type: v.type, price: v.price.toString(), status: v.status, keyless: v.keyless, plate: v.plate });
    setShowForm(true);
  };

  const handleSave = () => {
    if (editingId !== null) {
      setVehicles((v) =>
        v.map((item) =>
          item.id === editingId
            ? { ...item, name: form.name, type: form.type as "Car" | "Motorcycle", price: Number(form.price), status: form.status as VehicleStatus, keyless: form.keyless, plate: form.plate }
            : item
        )
      );
    } else {
      setVehicles((v) => [
        ...v,
        { id: Date.now(), name: form.name, type: form.type as "Car" | "Motorcycle", price: Number(form.price), status: form.status as VehicleStatus, keyless: form.keyless, plate: form.plate },
      ]);
    }
    setShowForm(false);
    setEditingId(null);
    setForm({ name: "", type: "Car", price: "", status: "available", keyless: false, plate: "" });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-sora font-bold text-xl" style={{ color: "hsl(var(--foreground))" }}>
            Armada Management
          </h2>
          <p className="text-sm mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>
            {vehicles.length} vehicles in fleet
          </p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm({ name: "", type: "Car", price: "", status: "available", keyless: false, plate: "" }); }}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Vehicle
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div
          className="mb-6 p-5 rounded-2xl"
          style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-sora font-semibold text-base" style={{ color: "hsl(var(--foreground))" }}>
              {editingId ? "Edit Vehicle" : "Add New Vehicle"}
            </h3>
            <button onClick={() => setShowForm(false)}>
              <X className="w-4 h-4" style={{ color: "hsl(var(--muted-foreground))" }} />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { label: "Name", key: "name", type: "text" },
              { label: "Plate", key: "plate", type: "text" },
              { label: "Price/day (Rp)", key: "price", type: "number" },
            ].map((f) => (
              <div key={f.key}>
                <label className="block text-xs font-medium mb-1" style={{ color: "hsl(var(--muted-foreground))" }}>{f.label}</label>
                <input
                  type={f.type}
                  value={(form as Record<string, unknown>)[f.key] as string}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }}
                />
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "hsl(var(--muted-foreground))" }}>Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }}
              >
                <option>Car</option>
                <option>Motorcycle</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "hsl(var(--muted-foreground))" }}>Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }}
              >
                <option value="available">Available</option>
                <option value="booked">Booked</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <div
                  onClick={() => setForm({ ...form, keyless: !form.keyless })}
                  className="w-10 h-5 rounded-full transition-colors flex items-center px-0.5"
                  style={{ background: form.keyless ? "hsl(var(--secondary))" : "hsl(var(--border))" }}
                >
                  <div
                    className="w-4 h-4 rounded-full transition-transform"
                    style={{ background: "hsl(0 0% 100%)", transform: form.keyless ? "translateX(20px)" : "translateX(0)" }}
                  />
                </div>
                <span className="text-sm" style={{ color: "hsl(var(--foreground))" }}>Keyless</span>
              </label>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleSave} className="btn-primary flex items-center gap-2 text-sm">
              <Check className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-xl text-sm font-medium"
              style={{ background: "hsl(var(--card))", color: "hsl(var(--muted-foreground))", border: "1px solid hsl(var(--border))" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid hsl(var(--border))" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: "hsl(var(--muted))" }}>
                {["Vehicle", "Plate", "Type", "Price/Day", "Status", "Keyless", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v, i) => (
                <tr
                  key={v.id}
                  style={{
                    background: i % 2 === 0 ? "hsl(var(--card))" : "hsl(var(--muted) / 0.4)",
                    borderTop: "1px solid hsl(var(--border))",
                  }}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0"
                        style={{ background: "hsl(var(--muted))" }}
                      >
                        <img src={v.type === "Car" ? carImg : motoImg} className="w-full h-full object-cover" alt="" />
                      </div>
                      <span className="font-medium text-sm" style={{ color: "hsl(var(--foreground))" }}>
                        {v.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
                    {v.plate}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {v.type === "Car" ? (
                        <Car className="w-4 h-4" style={{ color: "hsl(var(--secondary))" }} />
                      ) : (
                        <Bike className="w-4 h-4" style={{ color: "hsl(var(--secondary))" }} />
                      )}
                      <span className="text-sm" style={{ color: "hsl(var(--foreground))" }}>{v.type}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-sm" style={{ color: "hsl(var(--foreground))" }}>
                    Rp {v.price.toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="px-2.5 py-1 rounded-full text-xs font-semibold"
                      style={{ background: statusConfig[v.status].bg, color: statusConfig[v.status].color }}
                    >
                      {statusConfig[v.status].label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {v.keyless ? (
                      <Key className="w-4 h-4" style={{ color: "hsl(var(--secondary))" }} />
                    ) : (
                      <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(v)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                        style={{ background: "hsl(var(--secondary) / 0.1)", color: "hsl(var(--secondary))" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(var(--secondary) / 0.2)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "hsl(var(--secondary) / 0.1)")}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(v.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                        style={{ background: "hsl(0 84% 60% / 0.1)", color: "hsl(0 84% 50%)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(0 84% 60% / 0.2)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "hsl(0 84% 60% / 0.1)")}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
