import { useState } from "react";
import { useAdmin, TourPackage, TourVehicle } from "@/stores/adminStore";
import { Plus, X, Check, Pencil, Trash2, Eye, Package, Car, Clock, MapPin, Users, Bus, ChevronDown, Calculator } from "lucide-react";

interface CustomVehicleOption {
  id: number;
  name: string;
  category: "Small Car" | "Minibus" | "Medium Bus" | "Long Bus";
  defaultCapacity: number;
  notes: string;
}

const defaultCarOptions = [
  { name: "Avanza", category: "Small Car" },
  { name: "Xpander", category: "Small Car" },
  { name: "Innova", category: "Small Car" },
  { name: "Alphard", category: "Small Car" },
  { name: "Fortuner", category: "Small Car" },
  { name: "Pajero Sport", category: "Small Car" },
];

const defaultBusOptions = [
  { name: "Minibus (12 Seat)", category: "Minibus" },
  { name: "Medium Bus (25 Seat)", category: "Medium Bus" },
  { name: "Long Bus (40 Seat)", category: "Long Bus" },
];

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
  const [participantCount, setParticipantCount] = useState(1);

  // Custom vehicle options
  const [customVehicles, setCustomVehicles] = useState<CustomVehicleOption[]>([]);
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customForm, setCustomForm] = useState({ name: "", category: "Small Car" as CustomVehicleOption["category"], defaultCapacity: 4, notes: "" });

  // Temp inputs
  const [newDest, setNewDest] = useState("");
  const [newIncluded, setNewIncluded] = useState("");
  const [newNotIncluded, setNewNotIncluded] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [newVehiclePrice, setNewVehiclePrice] = useState("");
  const [editingVehicleId, setEditingVehicleId] = useState<number | null>(null);
  const [editVehiclePrice, setEditVehiclePrice] = useState("");

  const getAvailableVehicleOptions = () => {
    const base = form.pricingType === "per_car"
      ? defaultCarOptions
      : defaultBusOptions;

    const customFiltered = customVehicles.filter((cv) =>
      form.pricingType === "per_car"
        ? cv.category === "Small Car"
        : ["Minibus", "Medium Bus", "Long Bus"].includes(cv.category)
    );

    return [
      ...base.map((b) => b.name),
      ...customFiltered.map((c) => c.name),
    ];
  };

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
    if (selectedVehicle && newVehiclePrice) {
      const existing = form.vehicles.find((v) => v.type === selectedVehicle);
      if (existing) return;
      setForm({ ...form, vehicles: [...form.vehicles, { id: Date.now(), type: selectedVehicle, price: Number(newVehiclePrice) }] });
      setNewVehiclePrice("");
      setSelectedVehicle("");
    }
  };

  const removeVehicle = (id: number) => setForm({ ...form, vehicles: form.vehicles.filter((v) => v.id !== id) });

  const startEditVehicle = (v: TourVehicle) => {
    setEditingVehicleId(v.id);
    setEditVehiclePrice(v.price.toString());
  };

  const saveEditVehicle = (id: number) => {
    setForm({ ...form, vehicles: form.vehicles.map((v) => v.id === id ? { ...v, price: Number(editVehiclePrice) } : v) });
    setEditingVehicleId(null);
  };

  const addCustomVehicle = () => {
    if (!customForm.name) return;
    setCustomVehicles((prev) => [...prev, { ...customForm, id: Date.now() }]);
    setCustomForm({ name: "", category: "Small Car", defaultCapacity: 4, notes: "" });
    setShowAddCustom(false);
  };

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

  const vehicleOptions = getAvailableVehicleOptions();

  // Reset vehicles when pricing type changes
  const handlePricingTypeChange = (type: "per_car" | "per_person") => {
    setForm({ ...form, pricingType: type, vehicles: [] });
    setSelectedVehicle("");
    setNewVehiclePrice("");
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
              {editingId ? "Edit" : "New"} Tour Package — Step {step}/4
            </h3>
            <button onClick={() => setShowForm(false)}><X className="w-5 h-5" style={{ color: "hsl(var(--muted-foreground))" }} /></button>
          </div>

          {/* Step indicators */}
          <div className="flex gap-2 mb-6">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex-1 h-1.5 rounded-full transition-all" style={{ background: step >= s ? "hsl(var(--secondary))" : "hsl(var(--border))" }} />
            ))}
          </div>

          {/* Step labels */}
          <div className="flex gap-2 mb-6">
            {[
              { n: 1, label: "Basic Info" },
              { n: 2, label: "Vehicles & Pricing" },
              { n: 3, label: "Vehicle Summary" },
              { n: 4, label: "Itinerary" },
            ].map((s) => (
              <button key={s.n} onClick={() => setStep(s.n)} className="flex-1 text-center py-2 rounded-xl text-xs font-semibold transition-all" style={{
                background: step === s.n ? "hsl(var(--secondary) / 0.1)" : "transparent",
                color: step === s.n ? "hsl(var(--secondary))" : "hsl(var(--muted-foreground))",
              }}>
                {s.label}
              </button>
            ))}
          </div>

          {/* STEP 1: Basic Info & Pricing Type */}
          {step === 1 && (
            <div className="space-y-4">
              {/* Pricing Type Selection */}
              <div>
                <label className="block text-xs font-bold mb-2 uppercase tracking-wide" style={{ color: "hsl(var(--muted-foreground))" }}>Step 1 — Select Pricing Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handlePricingTypeChange("per_car")}
                    className="p-4 rounded-xl text-left transition-all"
                    style={{
                      background: form.pricingType === "per_car" ? "hsl(var(--secondary) / 0.1)" : "hsl(var(--muted))",
                      border: form.pricingType === "per_car" ? "2px solid hsl(var(--secondary))" : "2px solid hsl(var(--border))",
                    }}
                  >
                    <Car className="w-6 h-6 mb-2" style={{ color: form.pricingType === "per_car" ? "hsl(var(--secondary))" : "hsl(var(--muted-foreground))" }} />
                    <p className="font-sora font-bold text-sm" style={{ color: "hsl(var(--foreground))" }}>Price per Car</p>
                    <p className="text-xs mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>Avanza, Xpander, Innova, Alphard, dll</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePricingTypeChange("per_person")}
                    className="p-4 rounded-xl text-left transition-all"
                    style={{
                      background: form.pricingType === "per_person" ? "hsl(var(--secondary) / 0.1)" : "hsl(var(--muted))",
                      border: form.pricingType === "per_person" ? "2px solid hsl(var(--secondary))" : "2px solid hsl(var(--border))",
                    }}
                  >
                    <Bus className="w-6 h-6 mb-2" style={{ color: form.pricingType === "per_person" ? "hsl(var(--secondary))" : "hsl(var(--muted-foreground))" }} />
                    <p className="font-sora font-bold text-sm" style={{ color: "hsl(var(--foreground))" }}>Price per Person</p>
                    <p className="text-xs mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>Minibus, Medium Bus, Long Bus</p>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>Package Name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} placeholder="e.g. Bali Explorer" />
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

              {/* Destination Tags */}
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

          {/* STEP 2: Vehicle Selection Based on Pricing Type */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="p-3 rounded-xl flex items-center gap-3" style={{ background: "hsl(var(--secondary) / 0.08)", border: "1px solid hsl(var(--secondary) / 0.2)" }}>
                {form.pricingType === "per_car" ? <Car className="w-5 h-5" style={{ color: "hsl(var(--secondary))" }} /> : <Bus className="w-5 h-5" style={{ color: "hsl(var(--secondary))" }} />}
                <div>
                  <p className="text-xs font-bold" style={{ color: "hsl(var(--secondary))" }}>
                    {form.pricingType === "per_car" ? "Price per Car Mode" : "Price per Person Mode"}
                  </p>
                  <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                    {form.pricingType === "per_car" ? "Select private cars and set price per car" : "Select buses and set price per person (pax)"}
                  </p>
                </div>
              </div>

              <h4 className="font-sora font-semibold text-sm" style={{ color: "hsl(var(--foreground))" }}>
                Add Vehicle — {form.pricingType === "per_car" ? "Private Cars" : "Buses"}
              </h4>

              <div className="flex gap-2">
                <select
                  value={selectedVehicle}
                  onChange={(e) => setSelectedVehicle(e.target.value)}
                  className="px-3 py-2.5 rounded-xl text-sm outline-none flex-1"
                  style={inputStyle}
                >
                  <option value="">Select vehicle...</option>
                  {vehicleOptions.filter((v) => !form.vehicles.find((fv) => fv.type === v)).map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={newVehiclePrice}
                  onChange={(e) => setNewVehiclePrice(e.target.value)}
                  placeholder={form.pricingType === "per_car" ? "Price / car (Rp)" : "Price / pax (Rp)"}
                  className="px-3 py-2.5 rounded-xl text-sm outline-none w-48"
                  style={inputStyle}
                />
                <button onClick={addVehicle} className="btn-primary text-sm px-4" disabled={!selectedVehicle || !newVehiclePrice}>Add</button>
              </div>

              {/* Current vehicles list */}
              {form.vehicles.length > 0 && (
                <div className="space-y-2">
                  {form.vehicles.map((v) => (
                    <div key={v.id} className="flex items-center justify-between p-3 rounded-xl" style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))" }}>
                      <div className="flex items-center gap-3">
                        {form.pricingType === "per_car" ? <Car className="w-5 h-5" style={{ color: "hsl(var(--secondary))" }} /> : <Bus className="w-5 h-5" style={{ color: "hsl(var(--secondary))" }} />}
                        <span className="font-medium text-sm" style={{ color: "hsl(var(--foreground))" }}>{v.type}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: "hsl(var(--secondary) / 0.1)", color: "hsl(var(--secondary))" }}>
                          {form.pricingType === "per_car" ? "Per Car" : "Per Person"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        {editingVehicleId === v.id ? (
                          <div className="flex items-center gap-2">
                            <input type="number" value={editVehiclePrice} onChange={(e) => setEditVehiclePrice(e.target.value)} className="px-2 py-1 rounded-lg text-sm outline-none w-32" style={inputStyle} />
                            <button onClick={() => saveEditVehicle(v.id)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "hsl(142 70% 40% / 0.1)", color: "hsl(142 70% 35%)" }}><Check className="w-3.5 h-3.5" /></button>
                          </div>
                        ) : (
                          <span className="font-semibold text-sm" style={{ color: "hsl(var(--foreground))" }}>
                            Rp {v.price.toLocaleString("id-ID")}{form.pricingType === "per_person" && " /pax"}
                          </span>
                        )}
                        <button onClick={() => startEditVehicle(v)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "hsl(var(--secondary) / 0.1)", color: "hsl(var(--secondary))" }}><Pencil className="w-3.5 h-3.5" /></button>
                        <button onClick={() => removeVehicle(v.id)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "hsl(0 84% 60% / 0.1)", color: "hsl(0 84% 50%)" }}><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Custom Vehicle Option */}
              <div className="border-t pt-4" style={{ borderColor: "hsl(var(--border))" }}>
                <button onClick={() => setShowAddCustom(!showAddCustom)} className="flex items-center gap-2 text-xs font-semibold" style={{ color: "hsl(var(--secondary))" }}>
                  <Plus className="w-3.5 h-3.5" /> Add Custom Vehicle Option
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAddCustom ? "rotate-180" : ""}`} />
                </button>

                {showAddCustom && (
                  <div className="mt-3 p-4 rounded-xl space-y-3" style={{ background: "hsl(var(--muted) / 0.5)", border: "1px solid hsl(var(--border))" }}>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold mb-1" style={{ color: "hsl(var(--muted-foreground))" }}>Vehicle Name</label>
                        <input value={customForm.name} onChange={(e) => setCustomForm({ ...customForm, name: e.target.value })} placeholder="e.g. Toyota HiAce" className="w-full px-3 py-2 rounded-xl text-sm outline-none" style={inputStyle} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1" style={{ color: "hsl(var(--muted-foreground))" }}>Category</label>
                        <select value={customForm.category} onChange={(e) => setCustomForm({ ...customForm, category: e.target.value as CustomVehicleOption["category"] })} className="w-full px-3 py-2 rounded-xl text-sm outline-none" style={inputStyle}>
                          <option value="Small Car">Small Car</option>
                          <option value="Minibus">Minibus</option>
                          <option value="Medium Bus">Medium Bus</option>
                          <option value="Long Bus">Long Bus</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1" style={{ color: "hsl(var(--muted-foreground))" }}>Default Capacity</label>
                        <input type="number" value={customForm.defaultCapacity} onChange={(e) => setCustomForm({ ...customForm, defaultCapacity: Number(e.target.value) })} className="w-full px-3 py-2 rounded-xl text-sm outline-none" style={inputStyle} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1" style={{ color: "hsl(var(--muted-foreground))" }}>Notes</label>
                        <input value={customForm.notes} onChange={(e) => setCustomForm({ ...customForm, notes: e.target.value })} placeholder="Optional notes" className="w-full px-3 py-2 rounded-xl text-sm outline-none" style={inputStyle} />
                      </div>
                    </div>
                    <button onClick={addCustomVehicle} className="btn-primary text-xs px-4 py-2">
                      <Plus className="w-3 h-3 inline mr-1" /> Save Custom Vehicle
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Vehicle Summary Table */}
          {step === 3 && (
            <div className="space-y-4">
              <h4 className="font-sora font-semibold text-sm" style={{ color: "hsl(var(--foreground))" }}>Included Vehicle Summary</h4>

              {form.vehicles.length === 0 ? (
                <div className="text-center py-8 rounded-xl" style={{ background: "hsl(var(--muted) / 0.3)" }}>
                  <Package className="w-10 h-10 mx-auto mb-2" style={{ color: "hsl(var(--muted-foreground))" }} />
                  <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>No vehicles added yet. Go to Step 2 to add vehicles.</p>
                </div>
              ) : (
                <div className="rounded-xl overflow-hidden" style={{ border: "1px solid hsl(var(--border))" }}>
                  <table className="w-full">
                    <thead>
                      <tr style={{ background: "hsl(var(--muted))" }}>
                        {["ID", "Vehicle Name", "Price Type", "Price", "Action"].map((h) => (
                          <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide" style={{ color: "hsl(var(--muted-foreground))" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {form.vehicles.map((v, i) => (
                        <tr key={v.id} style={{ background: i % 2 === 0 ? "hsl(var(--card))" : "hsl(var(--muted) / 0.3)", borderTop: "1px solid hsl(var(--border))" }}>
                          <td className="px-4 py-3 text-sm font-mono" style={{ color: "hsl(var(--muted-foreground))" }}>{i + 1}</td>
                          <td className="px-4 py-3 font-medium text-sm" style={{ color: "hsl(var(--foreground))" }}>
                            <div className="flex items-center gap-2">
                              {form.pricingType === "per_car" ? <Car className="w-4 h-4" style={{ color: "hsl(var(--secondary))" }} /> : <Bus className="w-4 h-4" style={{ color: "hsl(var(--secondary))" }} />}
                              {v.type}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{
                              background: form.pricingType === "per_car" ? "hsl(var(--gold) / 0.15)" : "hsl(var(--secondary) / 0.1)",
                              color: form.pricingType === "per_car" ? "hsl(var(--gold))" : "hsl(var(--secondary))",
                            }}>
                              {form.pricingType === "per_car" ? "Per Car" : "Per Person"}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-semibold text-sm" style={{ color: "hsl(var(--foreground))" }}>
                            Rp {v.price.toLocaleString("id-ID")}{form.pricingType === "per_person" && " /pax"}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1.5">
                              <button onClick={() => startEditVehicle(v)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "hsl(var(--secondary) / 0.1)", color: "hsl(var(--secondary))" }}><Pencil className="w-3.5 h-3.5" /></button>
                              <button onClick={() => removeVehicle(v.id)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "hsl(0 84% 60% / 0.1)", color: "hsl(0 84% 50%)" }}><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Itinerary */}
          {step === 4 && (
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
            {step < 4 ? (
              <button onClick={() => setStep(step + 1)} className="btn-primary text-sm">Next Step</button>
            ) : (
              <button onClick={handleSave} className="btn-primary flex items-center gap-2 text-sm"><Check className="w-4 h-4" /> Save Package</button>
            )}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailPkg && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto py-8" onClick={() => setDetailPkg(null)}>
          <div className="rounded-2xl max-w-3xl w-full mx-4 my-auto" style={{ background: "hsl(var(--card))" }} onClick={(e) => e.stopPropagation()}>
            {/* Banner */}
            <div className="h-48 rounded-t-2xl flex items-center justify-center relative overflow-hidden" style={{ background: "var(--gradient-primary)" }}>
              <Package className="w-16 h-16 text-white/20" />
              <div className="absolute bottom-0 left-0 right-0 p-6" style={{ background: "linear-gradient(transparent, hsl(var(--primary) / 0.8))" }}>
                <h3 className="font-sora font-bold text-2xl text-white">{detailPkg.name}</h3>
                <div className="flex gap-2 mt-2">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: "hsl(var(--gold) / 0.2)", color: "hsl(var(--gold))" }}>{detailPkg.category}</span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: "white/20", color: "white" }}>
                    {detailPkg.pricingType === "per_car" ? "💰 Per Car" : "👤 Per Person"}
                  </span>
                </div>
              </div>
              <button onClick={() => setDetailPkg(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"><X className="w-4 h-4 text-white" /></button>
            </div>

            <div className="p-6 space-y-6">
              {/* Description */}
              <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>{detailPkg.description}</p>

              {/* Destinations */}
              <div>
                <h4 className="font-sora font-semibold text-sm mb-2" style={{ color: "hsl(var(--foreground))" }}>Destinations</h4>
                <div className="flex flex-wrap gap-2">
                  {detailPkg.destinations.map((d) => (
                    <span key={d} className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: "hsl(var(--secondary) / 0.1)", color: "hsl(var(--secondary))" }}>
                      <MapPin className="w-3 h-3" />{d}
                    </span>
                  ))}
                </div>
              </div>

              {/* Cost Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl" style={{ background: "hsl(142 70% 40% / 0.06)", border: "1px solid hsl(142 70% 40% / 0.15)" }}>
                  <p className="text-xs font-bold mb-2" style={{ color: "hsl(142 70% 35%)" }}>✅ Included</p>
                  {detailPkg.includedCosts.map((c) => <p key={c} className="text-sm py-0.5" style={{ color: "hsl(var(--foreground))" }}>• {c}</p>)}
                </div>
                <div className="p-4 rounded-xl" style={{ background: "hsl(0 84% 60% / 0.06)", border: "1px solid hsl(0 84% 60% / 0.15)" }}>
                  <p className="text-xs font-bold mb-2" style={{ color: "hsl(0 84% 50%)" }}>❌ Not Included</p>
                  {detailPkg.notIncludedCosts.map((c) => <p key={c} className="text-sm py-0.5" style={{ color: "hsl(var(--foreground))" }}>• {c}</p>)}
                </div>
              </div>

              {/* Dynamic Vehicle Pricing */}
              <div>
                <h4 className="font-sora font-semibold text-sm mb-3" style={{ color: "hsl(var(--foreground))" }}>
                  Vehicle Options & Pricing
                </h4>
                <div className="space-y-2">
                  {detailPkg.vehicles.map((v) => (
                    <div key={v.id} className="flex items-center justify-between py-3 px-4 rounded-xl" style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))" }}>
                      <div className="flex items-center gap-3">
                        {detailPkg.pricingType === "per_car" ? <Car className="w-5 h-5" style={{ color: "hsl(var(--secondary))" }} /> : <Bus className="w-5 h-5" style={{ color: "hsl(var(--secondary))" }} />}
                        <div>
                          <span className="font-medium text-sm" style={{ color: "hsl(var(--foreground))" }}>{v.type}</span>
                          <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: "hsl(var(--secondary) / 0.1)", color: "hsl(var(--secondary))" }}>
                            {detailPkg.pricingType === "per_car" ? "Per Car" : "Per Person"}
                          </span>
                        </div>
                      </div>
                      <span className="font-bold text-sm" style={{ color: "hsl(var(--gold))" }}>
                        Rp {v.price.toLocaleString("id-ID")}{detailPkg.pricingType === "per_person" && " /pax"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Participant Estimator & Cost Breakdown */}
              {detailPkg.pricingType === "per_person" && detailPkg.vehicles.length > 0 && (
                <div className="p-5 rounded-xl" style={{ background: "hsl(var(--gold) / 0.05)", border: "1px solid hsl(var(--gold) / 0.2)" }}>
                  <div className="flex items-center gap-2 mb-4">
                    <Calculator className="w-5 h-5" style={{ color: "hsl(var(--gold))" }} />
                    <h4 className="font-sora font-semibold text-sm" style={{ color: "hsl(var(--foreground))" }}>Participant Estimator</h4>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <label className="text-xs font-semibold" style={{ color: "hsl(var(--muted-foreground))" }}>Number of Participants:</label>
                    <input type="number" min={1} value={participantCount} onChange={(e) => setParticipantCount(Math.max(1, Number(e.target.value)))} className="px-3 py-2 rounded-xl text-sm outline-none w-24" style={inputStyle} />
                    <Users className="w-4 h-4" style={{ color: "hsl(var(--muted-foreground))" }} />
                  </div>
                  <div className="space-y-2">
                    {detailPkg.vehicles.map((v) => (
                      <div key={v.id} className="flex items-center justify-between py-2 px-3 rounded-lg" style={{ background: "hsl(var(--card))" }}>
                        <span className="text-sm" style={{ color: "hsl(var(--foreground))" }}>{v.type} × {participantCount} pax</span>
                        <span className="font-bold text-sm" style={{ color: "hsl(var(--gold))" }}>
                          Rp {(v.price * participantCount).toLocaleString("id-ID")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {detailPkg.pricingType === "per_car" && detailPkg.vehicles.length > 0 && (
                <div className="p-5 rounded-xl" style={{ background: "hsl(var(--gold) / 0.05)", border: "1px solid hsl(var(--gold) / 0.2)" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Calculator className="w-5 h-5" style={{ color: "hsl(var(--gold))" }} />
                    <h4 className="font-sora font-semibold text-sm" style={{ color: "hsl(var(--foreground))" }}>Cost Breakdown (Per Car)</h4>
                  </div>
                  <div className="space-y-2">
                    {detailPkg.vehicles.map((v) => (
                      <div key={v.id} className="flex items-center justify-between py-2 px-3 rounded-lg" style={{ background: "hsl(var(--card))" }}>
                        <span className="text-sm" style={{ color: "hsl(var(--foreground))" }}>{v.type}</span>
                        <span className="font-bold text-sm" style={{ color: "hsl(var(--gold))" }}>
                          Rp {v.price.toLocaleString("id-ID")} / car
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Itinerary Timeline */}
              {detailPkg.itinerary.length > 0 && (
                <div>
                  <h4 className="font-sora font-semibold text-sm mb-4" style={{ color: "hsl(var(--foreground))" }}>Travel Itinerary</h4>
                  {detailPkg.itinerary.map((day) => (
                    <div key={day.day} className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "hsl(var(--secondary))", color: "white" }}>{day.day}</div>
                        <span className="font-sora font-bold text-sm" style={{ color: "hsl(var(--foreground))" }}>Day {day.day}</span>
                      </div>
                      <div className="space-y-1 ml-4 pl-4" style={{ borderLeft: "2px solid hsl(var(--secondary) / 0.3)" }}>
                        {day.activities.map((a, i) => (
                          <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-lg" style={{ background: i % 2 === 0 ? "hsl(var(--muted) / 0.3)" : "transparent" }}>
                            <Clock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "hsl(var(--muted-foreground))" }} />
                            <span className="text-xs font-mono w-12" style={{ color: "hsl(var(--muted-foreground))" }}>{a.time}</span>
                            <span className="text-sm flex-1" style={{ color: "hsl(var(--foreground))" }}>{a.activity}</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{
                              background: a.label === "covered" ? "hsl(142 70% 40% / 0.1)" : "hsl(var(--gold) / 0.15)",
                              color: a.label === "covered" ? "hsl(142 70% 35%)" : "hsl(var(--gold))",
                            }}>{a.label === "covered" ? "✅ Tour Covered" : "💰 Personal"}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid hsl(var(--border))", boxShadow: "var(--shadow-sm)" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: "hsl(var(--muted))" }}>
                {["ID", "Package Name", "Category", "Price Type", "Starting Price", "Vehicles", "Action"].map((h) => (
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
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{
                      background: pkg.pricingType === "per_car" ? "hsl(var(--gold) / 0.1)" : "hsl(var(--secondary) / 0.08)",
                      color: pkg.pricingType === "per_car" ? "hsl(var(--gold))" : "hsl(var(--secondary))",
                    }}>
                      {pkg.pricingType === "per_car" ? "Per Car" : "Per Person"}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-sm" style={{ color: "hsl(var(--foreground))" }}>
                    Rp {getStartingPrice(pkg).toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: "hsl(var(--foreground))" }}>{pkg.vehicles.length}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <button onClick={() => { setDetailPkg(pkg); setParticipantCount(1); }} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "hsl(var(--gold) / 0.1)", color: "hsl(var(--gold))" }}><Eye className="w-3.5 h-3.5" /></button>
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
