"use client";
import { useState, useRef } from "react";
import { useAdmin } from "@/context/AdminContext";
import { Product, ColorImages } from "@/lib/data";
import { fileToBase64 } from "@/lib/imageUtils";
import { Plus, Pencil, Trash2, Search, X, Upload, ImagePlus } from "lucide-react";

// Safe image — works with base64, any URL
function Img({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className}
      onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0"; }} />
  );
}

const emptyProduct: Omit<Product, "id"> = {
  name: "", price: 0, originalPrice: undefined, category: "men",
  colors: ["#000000"],
  colorImages: [{ color: "#000000", images: [] }],
  sizes: ["S", "M", "L", "XL"],
  images: [],
  description: "", rating: 5, reviews: 0, badge: "",
};

export default function AdminProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useAdmin();
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<Product, "id">>(emptyProduct);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [activeColorTab, setActiveColorTab] = useState(0);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "all" || p.category === filterCat;
    return matchSearch && matchCat;
  });

  const openAdd = () => {
    setEditing(null); setForm(emptyProduct); setActiveColorTab(0); setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    const colorImages: ColorImages[] = p.colors.map((c) => {
      const existing = p.colorImages?.find((ci) => ci.color === c);
      return existing || { color: c, images: [] };
    });
    setForm({ ...p, colorImages });
    setActiveColorTab(0);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name || !form.price) return;
    const mainImages = form.colorImages[0]?.images || [];
    const data: Omit<Product, "id"> = {
      ...form,
      images: mainImages,
      badge: form.badge || undefined,
      originalPrice: form.originalPrice || undefined,
    };
    if (editing) updateProduct({ ...data, id: editing.id } as Product);
    else addProduct({ ...data, id: Date.now().toString() } as Product);
    setShowForm(false);
  };

  const toggleSize = (s: string) => {
    setForm((f) => ({
      ...f,
      sizes: f.sizes.includes(s) ? f.sizes.filter((x) => x !== s) : [...f.sizes, s],
    }));
  };

  const handleColorsChange = (raw: string) => {
    const newColors = raw.split(",").map((c) => c.trim()).filter(Boolean);
    const newColorImages: ColorImages[] = newColors.map((c) => {
      const existing = form.colorImages.find((ci) => ci.color === c);
      return existing || { color: c, images: [] };
    });
    setForm((f) => ({ ...f, colors: newColors, colorImages: newColorImages }));
    setActiveColorTab(0);
  };

  // Handle file upload for active color
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const currentCount = form.colorImages[activeColorTab]?.images.length || 0;
    const allowed = Math.min(files.length, 5 - currentCount);
    if (allowed <= 0) return;
    setUploading(true);
    try {
      const base64s = await Promise.all(files.slice(0, allowed).map(fileToBase64));
      setForm((f) => {
        const updated = f.colorImages.map((ci, i) => {
          if (i !== activeColorTab) return ci;
          return { ...ci, images: [...ci.images, ...base64s] };
        });
        return { ...f, colorImages: updated };
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (colorIdx: number, imgIdx: number) => {
    setForm((f) => {
      const updated = f.colorImages.map((ci, i) => {
        if (i !== colorIdx) return ci;
        return { ...ci, images: ci.images.filter((_, j) => j !== imgIdx) };
      });
      return { ...f, colorImages: updated };
    });
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black">Products</h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} total products</p>
        </div>
        <button onClick={openAdd} className="bg-black text-white font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-gray-800 transition-colors">
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black w-64" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", "men", "women", "oversized", "graphic"].map((c) => (
            <button key={c} onClick={() => setFilterCat(c)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold capitalize transition-colors ${filterCat === c ? "bg-black text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-black"}`}>
              {c === "all" ? "All" : c}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {["Product", "Category", "Price", "Colors", "Sizes", "Badge", "Actions"].map((h) => (
                <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center">
                      {p.images[0]
                        ? <Img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                        : <span className="text-xl">👕</span>}
                    </div>
                    <div>
                      <p className="font-semibold max-w-[160px] truncate">{p.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">⭐ {p.rating} · {p.reviews} reviews</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="capitalize bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-full">{p.category}</span>
                </td>
                <td className="px-5 py-4">
                  <p className="font-bold">₹{p.price}</p>
                  {p.originalPrice && <p className="text-xs text-gray-400 line-through">₹{p.originalPrice}</p>}
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-1.5">
                    {p.colors.map((c) => (
                      <div key={c} title={c} className="w-5 h-5 rounded-full border border-gray-200" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-1 flex-wrap">
                    {p.sizes.map((s) => (
                      <span key={s} className="text-xs border border-gray-200 px-1.5 py-0.5 rounded-md font-medium">{s}</span>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-4">
                  {p.badge ? <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2.5 py-1 rounded-full">{p.badge}</span>
                    : <span className="text-gray-300 text-xs">—</span>}
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(p)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-black">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => setDeleteConfirm(p.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors text-gray-500 hover:text-red-500">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="text-center py-16 text-gray-400">No products found.</div>}
      </div>

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-red-500" />
            </div>
            <h3 className="font-black text-lg mb-2">Delete Product?</h3>
            <p className="text-gray-500 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => { deleteProduct(deleteConfirm); setDeleteConfirm(null); }}
                className="flex-1 bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition-colors">Delete</button>
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 border border-gray-200 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h3 className="font-black text-lg">{editing ? "Edit Product" : "Add New Product"}</h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold mb-1.5">Product Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Classic White Essential"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black" />
              </div>

              {/* Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Selling Price (₹) *</label>
                  <input type="number" value={form.price || ""} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    placeholder="799"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Original Price (₹)</label>
                  <input type="number" value={form.originalPrice || ""} onChange={(e) => setForm({ ...form, originalPrice: Number(e.target.value) || undefined })}
                    placeholder="1299"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black" />
                </div>
              </div>

              {/* Category + Badge */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Category *</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Product["category"] })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black">
                    {["men", "women", "oversized", "graphic"].map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Badge</label>
                  <input type="text" value={form.badge || ""} onChange={(e) => setForm({ ...form, badge: e.target.value })}
                    placeholder="New / Best Seller / Trending"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black" />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold mb-1.5">Description *</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Product description..." rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black resize-none" />
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-sm font-semibold mb-2">Available Sizes</label>
                <div className="flex gap-2">
                  {["S", "M", "L", "XL", "XXL"].map((s) => (
                    <button key={s} type="button" onClick={() => toggleSize(s)}
                      className={`w-12 h-12 rounded-xl text-sm font-bold border-2 transition-colors ${form.sizes.includes(s) ? "border-black bg-black text-white" : "border-gray-200 hover:border-gray-400"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div>
                <label className="block text-sm font-semibold mb-1.5">Colors (comma separated hex codes)</label>
                <input type="text" value={form.colors.join(", ")} onChange={(e) => handleColorsChange(e.target.value)}
                  placeholder="#000000, #FFFFFF, #FF5733"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black" />
                <div className="flex gap-2 mt-2">
                  {form.colors.map((c, i) => (
                    <div key={i} title={c} className="w-7 h-7 rounded-full border-2 border-gray-200" style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>

              {/* Per-Color Image Upload */}
              <div>
                <label className="block text-sm font-semibold mb-3">
                  Images per Color
                  <span className="text-gray-400 font-normal ml-2">(max 5 per color)</span>
                </label>

                {/* Color Tabs */}
                <div className="flex gap-2 mb-4 flex-wrap">
                  {form.colorImages.map((ci, i) => (
                    <button key={i} type="button" onClick={() => setActiveColorTab(i)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${activeColorTab === i ? "border-black bg-black text-white" : "border-gray-200 hover:border-gray-400"}`}>
                      <div className="w-4 h-4 rounded-full border border-white/30" style={{ backgroundColor: ci.color }} />
                      {ci.color}
                      <span className={`text-xs ${activeColorTab === i ? "text-gray-300" : "text-gray-400"}`}>
                        ({ci.images.length})
                      </span>
                    </button>
                  ))}
                </div>

                {/* Upload Area for Active Color */}
                {form.colorImages[activeColorTab] && (
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full border border-gray-300" style={{ backgroundColor: form.colorImages[activeColorTab].color }} />
                        <span className="text-sm font-semibold">{form.colorImages[activeColorTab].color}</span>
                        <span className="text-xs text-gray-400">— {form.colorImages[activeColorTab].images.length}/5 images</span>
                      </div>
                    </div>

                    {/* Uploaded Images Preview */}
                    {form.colorImages[activeColorTab].images.length > 0 && (
                      <div className="flex gap-2 flex-wrap mb-3">
                        {form.colorImages[activeColorTab].images.map((img, imgIdx) => (
                          <div key={imgIdx} className="relative group">
                            <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-gray-200">
                              <Img src={img} alt={`img-${imgIdx}`} className="w-full h-full object-cover" />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeImage(activeColorTab, imgIdx)}
                              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={10} />
                            </button>
                            {imgIdx === 0 && (
                              <span className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1 rounded">Main</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Upload Button */}
                    {form.colorImages[activeColorTab].images.length < 5 && (
                      <>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                          className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-gray-300 hover:border-black rounded-xl py-4 text-sm font-semibold text-gray-500 hover:text-black transition-colors disabled:opacity-50"
                        >
                          {uploading ? (
                            <><div className="w-4 h-4 border-2 border-gray-400 border-t-black rounded-full animate-spin" /> Processing...</>
                          ) : (
                            <><Upload size={16} /> Click to Upload Images</>
                          )}
                        </button>
                        <p className="text-xs text-gray-400 text-center mt-2">
                          JPG, PNG, WEBP supported · Max 5 images per color · Multiple select allowed
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Rating */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Rating (1-5)</label>
                  <input type="number" min="1" max="5" step="0.1" value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Review Count</label>
                  <input type="number" value={form.reviews}
                    onChange={(e) => setForm({ ...form, reviews: Number(e.target.value) })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black" />
                </div>
              </div>
            </div>

            <div className="flex gap-3 px-6 pb-6">
              <button onClick={handleSave} className="flex-1 bg-black text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 transition-colors">
                {editing ? "Update Product" : "Add Product"}
              </button>
              <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 font-bold py-3.5 rounded-xl hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
