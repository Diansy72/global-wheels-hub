import { useState } from "react";
import { useAdmin, Tourist, GoogleReview } from "@/stores/adminStore";
import { Plus, X, Check, Pencil, Trash2, Star, Upload, Globe, User } from "lucide-react";

const continents = ["All", "Asia", "Europe", "Americas"];

export default function AboutUsManagement() {
  const { tourists, setTourists, reviews, setReviews } = useAdmin();
  const [tab, setTab] = useState<"gallery" | "reviews">("gallery");
  const [filter, setFilter] = useState("All");

  // Tourist form
  const [showTouristForm, setShowTouristForm] = useState(false);
  const [editTouristId, setEditTouristId] = useState<number | null>(null);
  const [touristForm, setTouristForm] = useState({ photo: "", nationality: "", continent: "Asia", destinationPackage: "" });

  // Review form
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editReviewId, setEditReviewId] = useState<number | null>(null);
  const [reviewForm, setReviewForm] = useState({ photo: "", name: "", country: "", rating: 5, comment: "" });

  const inputStyle = { background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" };

  // Tourist CRUD
  const saveTourist = () => {
    if (!touristForm.nationality) return;
    if (editTouristId !== null) {
      setTourists((prev) => prev.map((t) => t.id === editTouristId ? { ...t, ...touristForm } : t));
    } else {
      setTourists((prev) => [...prev, { id: Date.now(), ...touristForm }]);
    }
    setShowTouristForm(false);
    setEditTouristId(null);
    setTouristForm({ photo: "", nationality: "", continent: "Asia", destinationPackage: "" });
  };

  const editTourist = (t: Tourist) => {
    setTouristForm({ photo: t.photo, nationality: t.nationality, continent: t.continent, destinationPackage: t.destinationPackage });
    setEditTouristId(t.id);
    setShowTouristForm(true);
  };

  const deleteTourist = (id: number) => setTourists((prev) => prev.filter((t) => t.id !== id));

  // Review CRUD
  const saveReview = () => {
    if (!reviewForm.name) return;
    if (editReviewId !== null) {
      setReviews((prev) => prev.map((r) => r.id === editReviewId ? { ...r, ...reviewForm } : r));
    } else {
      setReviews((prev) => [...prev, { id: Date.now(), ...reviewForm }]);
    }
    setShowReviewForm(false);
    setEditReviewId(null);
    setReviewForm({ photo: "", name: "", country: "", rating: 5, comment: "" });
  };

  const editReview = (r: GoogleReview) => {
    setReviewForm({ photo: r.photo, name: r.name, country: r.country, rating: r.rating, comment: r.comment });
    setEditReviewId(r.id);
    setShowReviewForm(true);
  };

  const deleteReview = (id: number) => setReviews((prev) => prev.filter((r) => r.id !== id));

  const filteredTourists = filter === "All" ? tourists : tourists.filter((t) => t.continent === filter);

  return (
    <div>
      <h2 className="font-sora font-bold text-xl mb-1" style={{ color: "hsl(var(--foreground))" }}>About Us Management</h2>
      <p className="text-sm mb-6" style={{ color: "hsl(var(--muted-foreground))" }}>Manage tourist gallery and Google reviews</p>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit" style={{ background: "hsl(var(--muted))" }}>
        {(["gallery", "reviews"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className="px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-all" style={{
            background: tab === t ? "var(--gradient-primary)" : "transparent",
            color: tab === t ? "white" : "hsl(var(--muted-foreground))",
          }}>{t === "gallery" ? "Tourist Gallery" : "Google Reviews"}</button>
        ))}
      </div>

      {tab === "gallery" ? (
        <div>
          <div className="flex items-center justify-between mb-5">
            <div className="flex gap-2">
              {continents.map((c) => (
                <button key={c} onClick={() => setFilter(c)} className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all" style={{
                  background: filter === c ? "var(--gradient-primary)" : "hsl(var(--muted))",
                  color: filter === c ? "white" : "hsl(var(--muted-foreground))",
                }}>{c}</button>
              ))}
            </div>
            <button onClick={() => { setShowTouristForm(true); setEditTouristId(null); setTouristForm({ photo: "", nationality: "", continent: "Asia", destinationPackage: "" }); }} className="btn-primary flex items-center gap-2 text-sm">
              <Plus className="w-4 h-4" /> Add Tourist
            </button>
          </div>

          {showTouristForm && (
            <div className="mb-6 p-6 rounded-2xl" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-sora font-semibold" style={{ color: "hsl(var(--foreground))" }}>{editTouristId ? "Edit" : "Add"} Tourist</h3>
                <button onClick={() => setShowTouristForm(false)}><X className="w-5 h-5" style={{ color: "hsl(var(--muted-foreground))" }} /></button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>Photo</label>
                  <div className="px-3 py-2.5 rounded-xl text-sm flex items-center gap-2 cursor-pointer" style={inputStyle}>
                    <Upload className="w-4 h-4" /><span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>Upload</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>Nationality</label>
                  <input value={touristForm.nationality} onChange={(e) => setTouristForm({ ...touristForm, nationality: e.target.value })} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} placeholder="Japan 🇯🇵" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>Continent</label>
                  <select value={touristForm.continent} onChange={(e) => setTouristForm({ ...touristForm, continent: e.target.value })} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle}>
                    <option>Asia</option><option>Europe</option><option>Americas</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>Package Taken</label>
                  <input value={touristForm.destinationPackage} onChange={(e) => setTouristForm({ ...touristForm, destinationPackage: e.target.value })} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={saveTourist} className="btn-primary flex items-center gap-2 text-sm"><Check className="w-4 h-4" /> Save</button>
                <button onClick={() => setShowTouristForm(false)} className="px-4 py-2 rounded-xl text-sm" style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}>Cancel</button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredTourists.map((t) => (
              <div key={t.id} className="rounded-2xl overflow-hidden" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", boxShadow: "var(--shadow-sm)" }}>
                <div className="h-32 flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
                  <User className="w-10 h-10 text-white/30" />
                </div>
                <div className="p-4">
                  <p className="font-sora font-semibold text-sm" style={{ color: "hsl(var(--foreground))" }}>{t.nationality}</p>
                  <p className="text-xs mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>{t.destinationPackage}</p>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => editTourist(t)} className="flex-1 py-1.5 rounded-lg text-xs font-semibold text-center" style={{ background: "hsl(var(--secondary) / 0.1)", color: "hsl(var(--secondary))" }}>Edit</button>
                    <button onClick={() => deleteTourist(t.id)} className="flex-1 py-1.5 rounded-lg text-xs font-semibold text-center" style={{ background: "hsl(0 84% 60% / 0.1)", color: "hsl(0 84% 50%)" }}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-end mb-5">
            <button onClick={() => { setShowReviewForm(true); setEditReviewId(null); setReviewForm({ photo: "", name: "", country: "", rating: 5, comment: "" }); }} className="btn-primary flex items-center gap-2 text-sm">
              <Plus className="w-4 h-4" /> Add Review
            </button>
          </div>

          {showReviewForm && (
            <div className="mb-6 p-6 rounded-2xl" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-sora font-semibold" style={{ color: "hsl(var(--foreground))" }}>{editReviewId ? "Edit" : "Add"} Review</h3>
                <button onClick={() => setShowReviewForm(false)}><X className="w-5 h-5" style={{ color: "hsl(var(--muted-foreground))" }} /></button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>Profile Photo</label>
                  <div className="px-3 py-2.5 rounded-xl text-sm flex items-center gap-2 cursor-pointer" style={inputStyle}>
                    <Upload className="w-4 h-4" /><span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>Upload</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>Name</label>
                  <input value={reviewForm.name} onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>Country</label>
                  <input value={reviewForm.country} onChange={(e) => setReviewForm({ ...reviewForm, country: e.target.value })} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} placeholder="USA 🇺🇸" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button key={s} onClick={() => setReviewForm({ ...reviewForm, rating: s })}>
                        <Star className="w-5 h-5" style={{ color: s <= reviewForm.rating ? "hsl(var(--gold))" : "hsl(var(--border))", fill: s <= reviewForm.rating ? "hsl(var(--gold))" : "none" }} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>Comment</label>
                  <textarea value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} rows={2} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none" style={inputStyle} />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={saveReview} className="btn-primary flex items-center gap-2 text-sm"><Check className="w-4 h-4" /> Save</button>
                <button onClick={() => setShowReviewForm(false)} className="px-4 py-2 rounded-xl text-sm" style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}>Cancel</button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((r) => (
              <div key={r.id} className="rounded-2xl p-5" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", boxShadow: "var(--shadow-sm)" }}>
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 font-bold" style={{ background: "var(--gradient-primary)", color: "white" }}>{r.name[0]}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-sora font-semibold text-sm" style={{ color: "hsl(var(--foreground))" }}>{r.name}</p>
                        <p className="text-xs flex items-center gap-1" style={{ color: "hsl(var(--muted-foreground))" }}>
                          <Globe className="w-3 h-3" />{r.country}
                        </p>
                      </div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" style={{ color: "hsl(var(--gold))" }} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm mt-2" style={{ color: "hsl(var(--foreground))" }}>"{r.comment}"</p>
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => editReview(r)} className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold" style={{ background: "hsl(var(--secondary) / 0.1)", color: "hsl(var(--secondary))" }}><Pencil className="w-3 h-3" /> Edit</button>
                      <button onClick={() => deleteReview(r.id)} className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold" style={{ background: "hsl(0 84% 60% / 0.1)", color: "hsl(0 84% 50%)" }}><Trash2 className="w-3 h-3" /> Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
