import { useState } from "react";
import { useAdmin, Vehicle, VehicleCategory, BookingRecord } from "@/stores/adminStore";
import { Plus, X, Check, Pencil, Trash2, Eye, Car, Bike, Upload, Tag } from "lucide-react";

const emptyForm = {
  name: "", category: "Motorcycle" as VehicleCategory, image: "", pricePerDay: "",
  plateNumber: "", fuelConsumption: "", selfDrive: true, maxSpeed: "", seatCapacity: "",
  features: [] as string[],
};

const emptyBookingForm = {
  bookingDate: "", bookingTime: "", duration: "", customerName: "", notes: "",
};

export default function PricelistManagement() {
  const { vehicles, setVehicles, bookings, setBookings, defaultMotorcycleFeatures, defaultCarFeatures } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [newFeature, setNewFeature] = useState("");
  const [detailVehicle, setDetailVehicle] = useState<Vehicle | null>(null);
  
  // Booking modal state
  const [bookingVehicle, setBookingVehicle] = useState<Vehicle | null>(null);
  const [bookingForm, setBookingForm] = useState(emptyBookingForm);

  // Tab: vehicles or history
  const [tab, setTab] = useState<"vehicles" | "history">("vehicles");

  const openNewForm = (cat: VehicleCategory) => {
    setForm({ ...emptyForm, category: cat, features: cat === "Motorcycle" ? [...defaultMotorcycleFeatures] : [...defaultCarFeatures] });
    setEditingId(null);
    setShowCategoryPicker(false);
    setShowForm(true);
  };

  const openEditForm = (v: Vehicle) => {
    setForm({
      name: v.name, category: v.category, image: v.image, pricePerDay: v.pricePerDay.toString(),
      plateNumber: v.plateNumber, fuelConsumption: v.fuelConsumption, selfDrive: v.selfDrive,
      maxSpeed: v.maxSpeed, seatCapacity: v.seatCapacity.toString(), features: [...v.features],
    });
    setEditingId(v.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name || !form.plateNumber || !form.pricePerDay) return;
    if (editingId !== null) {
      setVehicles((prev) => prev.map((v) => v.id === editingId ? {
        ...v, name: form.name, category: form.category, image: form.image,
        pricePerDay: Number(form.pricePerDay), plateNumber: form.plateNumber,
        fuelConsumption: form.fuelConsumption, selfDrive: form.selfDrive,
        maxSpeed: form.maxSpeed, seatCapacity: Number(form.seatCapacity), features: form.features,
      } : v));
    } else {
      setVehicles((prev) => [...prev, {
        id: Date.now(), name: form.name, category: form.category, image: form.image,
        pricePerDay: Number(form.pricePerDay), plateNumber: form.plateNumber,
        fuelConsumption: form.fuelConsumption, selfDrive: form.selfDrive,
        maxSpeed: form.maxSpeed, seatCapacity: Number(form.seatCapacity), features: form.features,
        status: "Available",
      }]);
    }
    setShowForm(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleDelete = (id: number) => setVehicles((prev) => prev.filter((v) => v.id !== id));

  const handleStatusToggle = (v: Vehicle) => {
    if (v.status === "Available") {
      // Show booking form
      setBookingVehicle(v);
      setBookingForm(emptyBookingForm);
    } else {
      // Set back to Available
      setVehicles((prev) => prev.map((item) => item.id === v.id ? { ...item, status: "Available" } : item));
    }
  };

  const handleBookingSubmit = () => {
    if (!bookingVehicle || !bookingForm.bookingDate || !bookingForm.bookingTime || !bookingForm.duration) return;
    setVehicles((prev) => prev.map((v) => v.id === bookingVehicle.id ? { ...v, status: "Booked" } : v));
    setBookings((prev) => [...prev, {
      id: Date.now(), vehicleId: bookingVehicle.id, vehicleName: bookingVehicle.name,
      plateNumber: bookingVehicle.plateNumber, category: bookingVehicle.category,
      bookingDate: bookingForm.bookingDate, bookingTime: bookingForm.bookingTime,
      duration: Number(bookingForm.duration), customerName: bookingForm.customerName, notes: bookingForm.notes,
    }]);
    setBookingVehicle(null);
  };

  const addFeature = () => {
    if (newFeature.trim() && !form.features.includes(newFeature.trim())) {
      setForm({ ...form, features: [...form.features, newFeature.trim()] });
      setNewFeature("");
    }
  };

  const removeFeature = (f: string) => setForm({ ...form, features: form.features.filter((x) => x !== f) });

  const inputStyle = { background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-sora font-bold text-xl" style={{ color: "hsl(var(--foreground))" }}>Pricelist Management</h2>
          <p className="text-sm mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>{vehicles.length} vehicles in fleet</p>
        </div>
        <button onClick={() => setShowCategoryPicker(true)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Add Vehicle
        </button>
      </div>

      {/* Category Picker Modal */}
      {showCategoryPicker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setShowCategoryPicker(false)}>
          <div className="rounded-2xl p-8 max-w-sm w-full mx-4" style={{ background: "hsl(var(--card))" }} onClick={(e) => e.stopPropagation()}>
            <h3 className="font-sora font-bold text-lg mb-6 text-center" style={{ color: "hsl(var(--foreground))" }}>Select Vehicle Type</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { cat: "Motorcycle" as VehicleCategory, icon: Bike, label: "Motorcycle" },
                { cat: "Car" as VehicleCategory, icon: Car, label: "Car" },
              ].map((opt) => (
                <button
                  key={opt.cat}
                  onClick={() => openNewForm(opt.cat)}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl transition-all hover:-translate-y-1"
                  style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))" }}
                >
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
                    <opt.icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="font-sora font-semibold" style={{ color: "hsl(var(--foreground))" }}>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit" style={{ background: "hsl(var(--muted))" }}>
        {(["vehicles", "history"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-all"
            style={{
              background: tab === t ? "var(--gradient-primary)" : "transparent",
              color: tab === t ? "white" : "hsl(var(--muted-foreground))",
            }}
          >
            {t === "vehicles" ? "Vehicles" : "Booking History"}
          </button>
        ))}
      </div>

      {/* Vehicle Form */}
      {showForm && (
        <div className="mb-6 p-6 rounded-2xl" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", boxShadow: "var(--shadow-sm)" }}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
                {form.category === "Motorcycle" ? <Bike className="w-4 h-4 text-white" /> : <Car className="w-4 h-4 text-white" />}
              </div>
              <h3 className="font-sora font-semibold text-base" style={{ color: "hsl(var(--foreground))" }}>
                {editingId ? "Edit" : "Add"} {form.category}
              </h3>
            </div>
            <button onClick={() => { setShowForm(false); setEditingId(null); }}><X className="w-5 h-5" style={{ color: "hsl(var(--muted-foreground))" }} /></button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { label: "Vehicle Name", key: "name", type: "text", placeholder: "Honda Beat" },
              { label: "Plate Number", key: "plateNumber", type: "text", placeholder: "DK 1234 AA" },
              { label: "Price per Day (Rp)", key: "pricePerDay", type: "number", placeholder: "75000" },
              { label: "Fuel Consumption", key: "fuelConsumption", type: "text", placeholder: "100 km/L" },
              { label: "Max Speed", key: "maxSpeed", type: "text", placeholder: "90 km/h" },
              { label: "Seat Capacity", key: "seatCapacity", type: "number", placeholder: "2" },
            ].map((f) => (
              <div key={f.key}>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>{f.label}</label>
                <input
                  type={f.type}
                  value={(form as Record<string, unknown>)[f.key] as string}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  placeholder={f.placeholder}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={inputStyle}
                />
              </div>
            ))}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>Self Drive</label>
              <button
                onClick={() => setForm({ ...form, selfDrive: !form.selfDrive })}
                className="w-full px-3 py-2.5 rounded-xl text-sm font-medium text-left"
                style={inputStyle}
              >
                {form.selfDrive ? "✅ Yes" : "❌ No"}
              </button>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>Image</label>
              <div className="w-full px-3 py-2.5 rounded-xl text-sm flex items-center gap-2 cursor-pointer" style={inputStyle}>
                <Upload className="w-4 h-4" style={{ color: "hsl(var(--muted-foreground))" }} />
                <span style={{ color: "hsl(var(--muted-foreground))" }}>Upload</span>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mt-5">
            <label className="block text-xs font-semibold mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>
              <Tag className="w-3 h-3 inline mr-1" />Additional Features
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {form.features.map((f) => (
                <span key={f} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: "hsl(var(--secondary) / 0.1)", color: "hsl(var(--secondary))" }}>
                  {f}
                  <button onClick={() => removeFeature(f)}><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                placeholder="Add feature..."
                className="px-3 py-2 rounded-xl text-sm outline-none flex-1"
                style={inputStyle}
              />
              <button onClick={addFeature} className="px-4 py-2 rounded-xl text-sm font-semibold" style={{ background: "hsl(var(--secondary) / 0.1)", color: "hsl(var(--secondary))" }}>Add</button>
            </div>
          </div>

          <div className="flex gap-2 mt-5">
            <button onClick={handleSave} className="btn-primary flex items-center gap-2 text-sm"><Check className="w-4 h-4" /> Save</button>
            <button onClick={() => { setShowForm(false); setEditingId(null); }} className="px-4 py-2 rounded-xl text-sm font-medium" style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))", border: "1px solid hsl(var(--border))" }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {bookingVehicle && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setBookingVehicle(null)}>
          <div className="rounded-2xl p-6 max-w-md w-full mx-4" style={{ background: "hsl(var(--card))" }} onClick={(e) => e.stopPropagation()}>
            <h3 className="font-sora font-bold text-lg mb-1" style={{ color: "hsl(var(--foreground))" }}>Create Booking</h3>
            <p className="text-sm mb-5" style={{ color: "hsl(var(--muted-foreground))" }}>{bookingVehicle.name} ({bookingVehicle.plateNumber})</p>
            <div className="space-y-3">
              {[
                { label: "Booking Date", key: "bookingDate", type: "date" },
                { label: "Booking Time", key: "bookingTime", type: "time" },
                { label: "Duration (days)", key: "duration", type: "number" },
                { label: "Customer Name (optional)", key: "customerName", type: "text" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "hsl(var(--muted-foreground))" }}>{f.label}</label>
                  <input
                    type={f.type}
                    value={(bookingForm as Record<string, string>)[f.key]}
                    onChange={(e) => setBookingForm({ ...bookingForm, [f.key]: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={inputStyle}
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: "hsl(var(--muted-foreground))" }}>Notes</label>
                <textarea
                  value={bookingForm.notes}
                  onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
                  style={inputStyle}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={handleBookingSubmit} className="btn-primary flex items-center gap-2 text-sm flex-1"><Check className="w-4 h-4" /> Confirm Booking</button>
              <button onClick={() => setBookingVehicle(null)} className="px-4 py-2 rounded-xl text-sm" style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailVehicle && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setDetailVehicle(null)}>
          <div className="rounded-2xl p-6 max-w-lg w-full mx-4" style={{ background: "hsl(var(--card))" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-sora font-bold text-lg" style={{ color: "hsl(var(--foreground))" }}>{detailVehicle.name}</h3>
              <button onClick={() => setDetailVehicle(null)}><X className="w-5 h-5" style={{ color: "hsl(var(--muted-foreground))" }} /></button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ["Plate", detailVehicle.plateNumber], ["Category", detailVehicle.category],
                ["Price/Day", `Rp ${detailVehicle.pricePerDay.toLocaleString("id-ID")}`], ["Status", detailVehicle.status],
                ["Fuel", detailVehicle.fuelConsumption], ["Max Speed", detailVehicle.maxSpeed],
                ["Seats", detailVehicle.seatCapacity.toString()], ["Self Drive", detailVehicle.selfDrive ? "Yes" : "No"],
              ].map(([label, val]) => (
                <div key={label} className="p-3 rounded-xl" style={{ background: "hsl(var(--muted))" }}>
                  <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{label}</p>
                  <p className="font-semibold" style={{ color: "hsl(var(--foreground))" }}>{val}</p>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>Features</p>
              <div className="flex flex-wrap gap-2">
                {detailVehicle.features.map((f) => (
                  <span key={f} className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: "hsl(var(--secondary) / 0.1)", color: "hsl(var(--secondary))" }}>{f}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "vehicles" ? (
        /* Vehicles Table */
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid hsl(var(--border))", boxShadow: "var(--shadow-sm)" }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: "hsl(var(--muted))" }}>
                  {["ID", "Image", "Vehicle Name", "Plate Number", "Category", "Price/Day", "Status", "Action"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide" style={{ color: "hsl(var(--muted-foreground))" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vehicles.map((v, i) => (
                  <tr key={v.id} style={{ background: i % 2 === 0 ? "hsl(var(--card))" : "hsl(var(--muted) / 0.3)", borderTop: "1px solid hsl(var(--border))" }}>
                    <td className="px-4 py-3 text-sm font-mono" style={{ color: "hsl(var(--muted-foreground))" }}>{i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "hsl(var(--muted))" }}>
                        {v.category === "Car" ? <Car className="w-5 h-5" style={{ color: "hsl(var(--secondary))" }} /> : <Bike className="w-5 h-5" style={{ color: "hsl(var(--secondary))" }} />}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-sm" style={{ color: "hsl(var(--foreground))" }}>{v.name}</td>
                    <td className="px-4 py-3 text-sm font-mono" style={{ color: "hsl(var(--muted-foreground))" }}>{v.plateNumber}</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{
                        background: v.category === "Car" ? "hsl(var(--secondary) / 0.1)" : "hsl(var(--gold) / 0.15)",
                        color: v.category === "Car" ? "hsl(var(--secondary))" : "hsl(var(--gold))",
                      }}>{v.category}</span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-sm" style={{ color: "hsl(var(--foreground))" }}>Rp {v.pricePerDay.toLocaleString("id-ID")}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleStatusToggle(v)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer"
                        style={{
                          background: v.status === "Available" ? "hsl(142 70% 40% / 0.12)" : "hsl(0 84% 60% / 0.1)",
                          color: v.status === "Available" ? "hsl(142 70% 35%)" : "hsl(0 84% 50%)",
                        }}
                      >
                        <div className="w-2 h-2 rounded-full" style={{ background: v.status === "Available" ? "hsl(142 70% 40%)" : "hsl(0 84% 55%)" }} />
                        {v.status}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button onClick={() => setDetailVehicle(v)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "hsl(var(--gold) / 0.1)", color: "hsl(var(--gold))" }}><Eye className="w-3.5 h-3.5" /></button>
                        <button onClick={() => openEditForm(v)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "hsl(var(--secondary) / 0.1)", color: "hsl(var(--secondary))" }}><Pencil className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDelete(v.id)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "hsl(0 84% 60% / 0.1)", color: "hsl(0 84% 50%)" }}><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Booking History */
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid hsl(var(--border))", boxShadow: "var(--shadow-sm)" }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: "hsl(var(--muted))" }}>
                  {["Vehicle Name", "Plate Number", "Category", "Booking Date", "Time", "Duration", "Customer", "Notes"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide" style={{ color: "hsl(var(--muted-foreground))" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr><td colSpan={8} className="px-4 py-8 text-center text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>No booking records yet</td></tr>
                ) : bookings.map((b, i) => (
                  <tr key={b.id} style={{ background: i % 2 === 0 ? "hsl(var(--card))" : "hsl(var(--muted) / 0.3)", borderTop: "1px solid hsl(var(--border))" }}>
                    <td className="px-4 py-3 font-medium text-sm" style={{ color: "hsl(var(--foreground))" }}>{b.vehicleName}</td>
                    <td className="px-4 py-3 text-sm font-mono" style={{ color: "hsl(var(--muted-foreground))" }}>{b.plateNumber}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: "hsl(var(--foreground))" }}>{b.category}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: "hsl(var(--foreground))" }}>{b.bookingDate}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: "hsl(var(--foreground))" }}>{b.bookingTime}</td>
                    <td className="px-4 py-3 text-sm font-semibold" style={{ color: "hsl(var(--foreground))" }}>{b.duration} days</td>
                    <td className="px-4 py-3 text-sm" style={{ color: "hsl(var(--foreground))" }}>{b.customerName || "—"}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>{b.notes || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
