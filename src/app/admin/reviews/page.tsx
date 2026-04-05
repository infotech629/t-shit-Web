"use client";
import { useState } from "react";
import { useAdmin, Review } from "@/context/AdminContext";
import { Plus, Trash2, Star, X } from "lucide-react";

const emptyReview = { name: "", rating: 5, comment: "", product: "" };

export default function AdminReviewsPage() {
  const { reviews, addReview, deleteReview, products } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyReview);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleSave = () => {
    if (!form.name || !form.comment) return;
    addReview({
      id: Date.now().toString(),
      name: form.name,
      rating: form.rating,
      comment: form.comment,
      product: form.product,
      avatar: form.name.charAt(0).toUpperCase(),
    } as Review);
    setForm(emptyReview);
    setShowForm(false);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black">Reviews</h1>
          <p className="text-gray-500 text-sm mt-1">
            {reviews.length} review(s) — shown on homepage Customer Love section
          </p>
        </div>
        <button
          onClick={() => { setForm(emptyReview); setShowForm(true); }}
          className="bg-black text-white font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-gray-800 transition-colors"
        >
          <Plus size={18} /> Add Review
        </button>
      </div>

      {/* Empty State */}
      {reviews.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Star size={40} className="mx-auto mb-4 text-gray-200" />
          <h3 className="font-black text-lg mb-2">No Reviews Yet</h3>
          <p className="text-gray-500 text-sm mb-6">
            Add customer reviews to display them on the homepage.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-black text-white font-bold px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors"
          >
            Add First Review
          </button>
        </div>
      )}

      {/* Reviews Grid */}
      {reviews.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl border border-gray-100 p-5 relative group">
              <button
                onClick={() => setDeleteConfirm(r.id)}
                className="absolute top-4 right-4 p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-50 rounded-lg transition-all text-gray-400 hover:text-red-500"
              >
                <Trash2 size={14} />
              </button>
              <div className="flex gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className={i < r.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-100 text-gray-100"} />
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">"{r.comment}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {r.avatar}
                </div>
                <div>
                  <p className="font-semibold text-sm">{r.name}</p>
                  {r.product && <p className="text-xs text-gray-400">{r.product}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-red-500" />
            </div>
            <h3 className="font-black text-lg mb-2">Delete Review?</h3>
            <p className="text-gray-500 text-sm mb-6">This will remove it from the homepage.</p>
            <div className="flex gap-3">
              <button onClick={() => { deleteReview(deleteConfirm); setDeleteConfirm(null); }}
                className="flex-1 bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition-colors">
                Delete
              </button>
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 border border-gray-200 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Review Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h3 className="font-black text-lg">Add Review</h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5">Customer Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Rahul M."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} type="button" onClick={() => setForm({ ...form, rating: n })}
                      className={`w-10 h-10 rounded-xl font-bold text-sm border-2 transition-colors ${form.rating >= n ? "border-yellow-400 bg-yellow-400 text-black" : "border-gray-200 text-gray-400"}`}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Review Comment *</label>
                <textarea value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })}
                  placeholder="Customer's review..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black resize-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Product Name</label>
                <select value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black">
                  <option value="">Select product (optional)</option>
                  {products.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button onClick={handleSave}
                className="flex-1 bg-black text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 transition-colors">
                Add Review
              </button>
              <button onClick={() => setShowForm(false)}
                className="flex-1 border border-gray-200 font-bold py-3.5 rounded-xl hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
