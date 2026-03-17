import { useState } from "react";
import { useAdmin, TourPackage, TourVehicle } from "@/stores/adminStore";
import { Plus, X, Check, Pencil, Trash2, Eye, Package, Car, Clock, DollarSign, MapPin, Users } from "lucide-react";

const vehicleTypes = ["Small Car", "Minibus", "Medium Bus", "Long Bus"];

const emptyForm = {
  name: "", description: "", image: "", pricingType: "per_person" as "per_car" | "per_person",
  category: "Private" as "Private" | "Group", destinations: [] as string[], includedCosts: [] as string[],
  notIncludedCosts: [] as string[], vehicles: [] as TourVehicle[],
  itinerary: [] as { day: number; activities: { time: string; activity: string; label: "covered" | "personal" }[] }[],
};

export default function TourPackageManagement() {
  const { tourPackages, setTourPackages } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [step, setStep] = useState(1);
  const [detailPkg, setDetailPkg] = useState<TourPackage | null>(null);

  // Temp inputs
  const [newDest, setNewDest] = useState("");
  const [newIncluded, setNewIncluded] = useState("");
  const [newNotIncluded, setNewNotIncluded] = useState("");
  const [newVehicleType, setNewVehicleType] = useState(vehicleTypes[0]);
  const [newVehiclePrice, setNewVehiclePrice] = useState("");

  const openEdit = (pkg: TourPackage) => {
    setForm({ name: pkg.name, description: pkg.description, image: pkg.image, pricingType: pkg.pricingType, category: pkg.category, destinations: [...pkg.destinations], includedCosts: [...pkg.includedCosts], notIncludedCosts: [...pkg.notIncludedCosts], vehicles: pkg.vehicles.map((v) => ({ ...v })), itinerary: pkg.itinerary.map((d) => ({ ...d, activities: d.activities.map((a) => ({ ...a })) })) });
    setEditingId(pkg.id);
    setStep(1);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name) return;
    const pkg = { ...form, id: editingId ?? Date.now() };
    if (editingId !== null) {
      setTourPackages((prev) => prev.map((p) => p.id === editingId ? pkg : p));
    } else {
      setTourPackages((prev) => [...prev, pkg]);
    }
    setShowForm(false);
    setForm(emptyForm);
    setEditingId(null);
    setStep(1);
  };

  const handleDelete = (id: number) => setTourPackages((prev) => prev.filter((p) => p.id !== id));

  const addTag = (field: "destinations" | "includedCosts" | "notIncludedCosts", value: string, setter: (v: string) => void) => {
    if (value.trim() && !form[field].includes(value.trim())) {
      setForm({ ...form, [field]: [...form[field], value.trim()] });
      setter("");
    }
  };

  const removeTag = (field: "destinations" | "includedCosts" | "notIncludedCosts", val: string) => {
    setForm({ ...form, [field]: form[field].filter((x) => x !== val) });
  };

  const addVehicle = () => {
    if (newVehiclePrice) {
      setForm({ ...form, vehicles: [...form.vehicles, { id: Date.now(), type: newVehicleType, price: Number(newVehiclePrice) }] });
      setNewVehiclePrice("");
    }
  };

  const removeVehicle = (id: number) => setForm({ ...form, vehicles: form.vehicles.filter((v) => v.id !== id) });

  const addDay = () => {
    setForm({ ...form, itinerary: [...form.itinerary, { day: form.itinerary.length + 1, activities: [] }] });
  };

  const addActivity = (dayIdx: number) => {
    const newIt = [...form.itinerary];
    newIt[dayIdx].activities.push({ time: "08:00", activity: "", label: "covered" });
    setForm({ ...form, itinerary: newIt });
  };

  const updateActivity = (dayIdx: number, actIdx: number, field: string, value: string) => {
    const newIt = [...form.itinerary];
    (newIt[dayIdx].activities[actIdx] as Record<string, string>)[field] = value;
    setForm({ ...form, itinerary: newIt });
  };

  const removeActivity = (dayIdx: number, actIdx: number) => {
    const newIt = [...form.itinerary];
    newIt[dayIdx].activities.splice(actIdx, 1);
    setForm({ ...form, itinerary: newIt });
  };

  const inputStyle = { background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" };

  const getStartingPrice = (pkg: TourPackage) => {
    if (pkg.vehicles.length === 0) return 0;
    return Math.min(...pkg.vehicles.map((v) => v.price));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-sora font-bold text-xl" style={{ color: "hsl(var(--foreground))" }}>Tour Package Management</h2>
          <p className="text-sm mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>{tourPackages.length} packages</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); setStep(1); }} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Add Package
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-6 p-6 rounded-2xl" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", boxShadow: "var(--shadow-sm)" }}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-sora font-semibold" style={{ color: "hsl(var(--foreground))" }}>
              {editingId ? "Edit" : "New"} Tour Package — Step {step}/3
            </h3>
            <button onClick={() => setShowForm(false)}><X className="w-5 h-5" style={{ color: "hsl(var(--muted-foreground))" }} /></button>
          </div>

          {/* Step indicators */}
          <div className="flex gap-2 mb-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex-1 h-1.5 rounded-full" style={{ background: step >= s ? "hsl(var(--secondary))" : "hsl(var(--border))" }} />
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>Package Name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>Pricing Type</label>
                  <select value={form.pricingType} onChange={(e) => setForm({ ...form, pricingType: e.target.value as "per_car" | "per_person" })} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle}>
                    <option value="per_person">Price per Person</option>
                    <option value="per_car">Price per Car</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as "Private" | "Group" })} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle}>
                    <option>Private</option>
                    <option>Group</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none" style={inputStyle} />
              </div>

              {/* Tags: Destinations */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>Destination Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.destinations.map((d) => (
                    <span key={d} className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium" style={{ background: "hsl(var(--secondary) / 0.1)", color: "hsl(var(--secondary))" }}>
                      {d} <button onClick={() => removeTag("destinations", d)}><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={newDest} onChange={(e) => setNewDest(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag("destinations", newDest, setNewDest))} placeholder="Add destination..." className="flex-1 px-3 py-2 rounded-xl text-sm outline-none" style={inputStyle} />
                  <button onClick={() => addTag("destinations", newDest, setNewDest)} className="px-3 py-2 rounded-xl text-xs font-semibold" style={{ background: "hsl(var(--secondary) / 0.1)", color: "hsl(var(--secondary))" }}>Add</button>
                </div>
              </div>

              {/* Included / Not Included */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "hsl(142 70% 35%)" }}>✅ Included Costs</label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {form.includedCosts.map((c) => (
                      <span key={c} className="flex items-center gap-1 px-2 py-1 rounded-full text-xs" style={{ background: "hsl(142 70% 40% / 0.1)", color: "hsl(142 70% 35%)" }}>
                        {c} <button onClick={() => removeTag("includedCosts", c)}><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-1">
                    <input value={newIncluded} onChange={(e) => setNewIncluded(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag("includedCosts", newIncluded, setNewIncluded))} className="flex-1 px-2 py-1.5 rounded-lg text-xs outline-none" style={inputStyle} placeholder="e.g. Fuel" />
                    <button onClick={() => addTag("includedCosts", newIncluded, setNewIncluded)} className="px-2 py-1.5 rounded-lg text-xs font-semibold" style={{ background: "hsl(142 70% 40% / 0.1)", color: "hsl(142 70% 35%)" }}>+</button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "hsl(0 84% 50%)" }}>❌ Not Included</label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {form.notIncludedCosts.map((c) => (
                      <span key={c} className="flex items-center gap-1 px-2 py-1 rounded-full text-xs" style={{ background: "hsl(0 84% 60% / 0.1)", color: "hsl(0 84% 50%)" }}>
                        {c} <button onClick={() => removeTag("notIncludedCosts", c)}><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-1">
                    <input value={newNotIncluded} onChange={(e) => setNewNotIncluded(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag("notIncludedCosts", newNotIncluded, setNewNotIncluded))} className="flex-1 px-2 py-1.5 rounded-lg text-xs outline-none" style={inputStyle} placeholder="e.g. Lunch" />
                    <button onClick={() => addTag("notIncludedCosts", newNotIncluded, setNewNotIncluded)} className="px-2 py-1.5 rounded-lg text-xs font-semibold" style={{ background: "hsl(0 84% 60% / 0.1)", color: "hsl(0 84% 50%)" }}>+</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h4 className="font-sora font-semibold text-sm" style={{ color: "hsl(var(--foreground))" }}>Included Vehicles & Pricing</h4>
              <div className="flex gap-2">
                <select value={newVehicleType} onChange={(e) => setNewVehicleType(e.target.value)} className="px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle}>
                  {vehicleTypes.map((t) => <option key={t}>{t}</option>)}
                </select>
                <input type="number" value={newVehiclePrice} onChange={(e) => setNewVehiclePrice(e.target.value)} placeholder="Price (Rp)" className="px-3 py-2.5 rounded-xl text-sm outline-none flex-1" style={inputStyle} />
                <button onClick={addVehicle} className="btn-primary text-sm px-4">Add</button>
              </div>
              <div className="space-y-2">
                {form.vehicles.map((v) => (
                  <div key={v.id} className="flex items-center justify-between p-3 rounded-xl" style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))" }}>
                    <div className="flex items-center gap-3">
                      <Car className="w-5 h-5" style={{ color: "hsl(var(--secondary))" }} />
                      <span className="font-medium text-sm" style={{ color: "hsl(var(--foreground))" }}>{v.type}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-sm" style={{ color: "hsl(var(--foreground))" }}>Rp {v.price.toLocaleString("id-ID")}</span>
                      <button onClick={() => removeVehicle(v.id)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "hsl(0 84% 60% / 0.1)", color: "hsl(0 84% 50%)" }}><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-sora font-semibold text-sm" style={{ color: "hsl(var(--foreground))" }}>Travel Itinerary / Rundown</h4>
                <button onClick={addDay} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: "hsl(var(--secondary) / 0.1)", color: "hsl(var(--secondary))" }}>
                  <Plus className="w-3 h-3" /> Add Day
                </button>
              </div>
              {form.itinerary.map((day, dayIdx) => (
                <div key={dayIdx} className="p-4 rounded-xl" style={{ background: "hsl(var(--muted) / 0.5)", border: "1px solid hsl(var(--border))" }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-sora font-bold text-sm" style={{ color: "hsl(var(--foreground))" }}>Day {day.day}</span>
                    <button onClick={() => addActivity(dayIdx)} className="text-xs font-semibold flex items-center gap-1" style={{ color: "hsl(var(--secondary))" }}>
                      <Plus className="w-3 h-3" /> Activity
                    </button>
                  </div>
                  <div className="space-y-2">
                    {day.activities.map((act, actIdx) => (
                      <div key={actIdx} className="flex items-center gap-2">
                        <input type="time" value={act.time} onChange={(e) => updateActivity(dayIdx, actIdx, "time", e.target.value)} className="px-2 py-1.5 rounded-lg text-xs outline-none w-24" style={inputStyle} />
                        <input value={act.activity} onChange={(e) => updateActivity(dayIdx, actIdx, "activity", e.target.value)} placeholder="Activity..." className="flex-1 px-2 py-1.5 rounded-lg text-xs outline-none" style={inputStyle} />
                        <select value={act.label} onChange={(e) => updateActivity(dayIdx, actIdx, "label", e.target.value)} className="px-2 py-1.5 rounded-lg text-xs outline-none" style={inputStyle}>
                          <option value="covered">Covered</option>
                          <option value="personal">Personal</option>
                        </select>
                        <button onClick={() => removeActivity(dayIdx, actIdx)}><X className="w-4 h-4" style={{ color: "hsl(0 84% 50%)" }} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2 mt-6">
            {step > 1 && <button onClick={() => setStep(step - 1)} className="px-5 py-2 rounded-xl text-sm font-medium" style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}>Back</button>}
            {step < 3 ? (
              <button onClick={() => setStep(step + 1)} className="btn-primary text-sm">Next Step</button>
            ) : (
              <button onClick={handleSave} className="btn-primary flex items-center gap-2 text-sm"><Check className="w-4 h-4" /> Save Package</button>
            )}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailPkg && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center overflow-y-auto py-8" onClick={() => setDetailPkg(null)}>
          <div className="rounded-2xl p-6 max-w-2xl w-full mx-4 my-auto" style={{ background: "hsl(var(--card))" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-sora font-bold text-xl" style={{ color: "hsl(var(--foreground))" }}>{detailPkg.name}</h3>
              <button onClick={() => setDetailPkg(null)}><X className="w-5 h-5" style={{ color: "hsl(var(--muted-foreground))" }} /></button>
            </div>

            {/* Banner */}
            <div className="h-40 rounded-xl mb-4 flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
              <Package className="w-12 h-12 text-white/30" />
            </div>

            <p className="text-sm mb-4" style={{ color: "hsl(var(--muted-foreground))" }}>{detailPkg.description}</p>

            {/* Destination Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {detailPkg.destinations.map((d) => (
                <span key={d} className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium" style={{ background: "hsl(var(--secondary) / 0.1)", color: "hsl(var(--secondary))" }}>
                  <MapPin className="w-3 h-3" />{d}
                </span>
              ))}
            </div>

            {/* Cost Cards */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-4 rounded-xl" style={{ background: "hsl(142 70% 40% / 0.06)", border: "1px solid hsl(142 70% 40% / 0.15)" }}>
                <p className="text-xs font-bold mb-2" style={{ color: "hsl(142 70% 35%)" }}>✅ Included</p>
                {detailPkg.includedCosts.map((c) => <p key={c} className="text-sm" style={{ color: "hsl(var(--foreground))" }}>• {c}</p>)}
              </div>
              <div className="p-4 rounded-xl" style={{ background: "hsl(0 84% 60% / 0.06)", border: "1px solid hsl(0 84% 60% / 0.15)" }}>
                <p className="text-xs font-bold mb-2" style={{ color: "hsl(0 84% 50%)" }}>❌ Not Included</p>
                {detailPkg.notIncludedCosts.map((c) => <p key={c} className="text-sm" style={{ color: "hsl(var(--foreground))" }}>• {c}</p>)}
              </div>
            </div>

            {/* Vehicle Prices */}
            <div className="mb-4">
              <h4 className="font-sora font-semibold text-sm mb-2" style={{ color: "hsl(var(--foreground))" }}>Vehicle Options</h4>
              {detailPkg.vehicles.map((v) => (
                <div key={v.id} className="flex items-center justify-between py-2 px-3 rounded-lg mb-1" style={{ background: "hsl(var(--muted) / 0.5)" }}>
                  <span className="text-sm flex items-center gap-2" style={{ color: "hsl(var(--foreground))" }}><Car className="w-4 h-4" style={{ color: "hsl(var(--secondary))" }} />{v.type}</span>
                  <span className="font-bold text-sm" style={{ color: "hsl(var(--gold))" }}>Rp {v.price.toLocaleString("id-ID")}</span>
                </div>
              ))}
            </div>

            {/* Itinerary */}
            {detailPkg.itinerary.length > 0 && (
              <div>
                <h4 className="font-sora font-semibold text-sm mb-3" style={{ color: "hsl(var(--foreground))" }}>Itinerary</h4>
                {detailPkg.itinerary.map((day) => (
                  <div key={day.day} className="mb-3">
                    <p className="font-bold text-xs mb-1.5" style={{ color: "hsl(var(--secondary))" }}>Day {day.day}</p>
                    <div className="space-y-1 pl-3" style={{ borderLeft: "2px solid hsl(var(--border))" }}>
                      {day.activities.map((a, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm py-1">
                          <Clock className="w-3 h-3 flex-shrink-0" style={{ color: "hsl(var(--muted-foreground))" }} />
                          <span style={{ color: "hsl(var(--muted-foreground))" }}>{a.time}</span>
                          <span style={{ color: "hsl(var(--foreground))" }}>{a.activity}</span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold" style={{
                            background: a.label === "covered" ? "hsl(142 70% 40% / 0.1)" : "hsl(var(--gold) / 0.15)",
                            color: a.label === "covered" ? "hsl(142 70% 35%)" : "hsl(var(--gold))",
                          }}>{a.label === "covered" ? "Tour" : "Personal"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid hsl(var(--border))", boxShadow: "var(--shadow-sm)" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: "hsl(var(--muted))" }}>
                {["ID", "Package Name", "Category", "Starting Price", "Vehicles", "Action"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide" style={{ color: "hsl(var(--muted-foreground))" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tourPackages.map((pkg, i) => (
                <tr key={pkg.id} style={{ background: i % 2 === 0 ? "hsl(var(--card))" : "hsl(var(--muted) / 0.3)", borderTop: "1px solid hsl(var(--border))" }}>
                  <td className="px-4 py-3 text-sm font-mono" style={{ color: "hsl(var(--muted-foreground))" }}>{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-sm" style={{ color: "hsl(var(--foreground))" }}>{pkg.name}</td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{
                      background: pkg.category === "Private" ? "hsl(var(--gold) / 0.15)" : "hsl(var(--secondary) / 0.1)",
                      color: pkg.category === "Private" ? "hsl(var(--gold))" : "hsl(var(--secondary))",
                    }}>{pkg.category}</span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-sm" style={{ color: "hsl(var(--foreground))" }}>
                    Rp {getStartingPrice(pkg).toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: "hsl(var(--foreground))" }}>{pkg.vehicles.length}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <button onClick={() => setDetailPkg(pkg)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "hsl(var(--gold) / 0.1)", color: "hsl(var(--gold))" }}><Eye className="w-3.5 h-3.5" /></button>
                      <button onClick={() => openEdit(pkg)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "hsl(var(--secondary) / 0.1)", color: "hsl(var(--secondary))" }}><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(pkg.id)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "hsl(0 84% 60% / 0.1)", color: "hsl(0 84% 50%)" }}><Trash2 className="w-3.5 h-3.5" /></button>
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
