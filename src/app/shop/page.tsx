"use client";
import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAdmin } from "@/context/AdminContext";
import ProductCard from "@/components/ProductCard";
import { SlidersHorizontal } from "lucide-react";

const categories = ["all", "men", "women", "oversized", "graphic"];
const sortOptions = ["Featured", "Price: Low to High", "Price: High to Low", "Top Rated"];

function ShopContent() {
  const { products } = useAdmin();
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("category") || "all";
  const [activeCategory, setActiveCategory] = useState(initialCat);
  const [sort, setSort] = useState("Featured");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = activeCategory === "all" ? products : products.filter((p) => p.category === activeCategory);
    if (search) list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    if (sort === "Price: Low to High") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "Price: High to Low") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "Top Rated") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [products, activeCategory, sort, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-black mb-2">Shop All Tees</h1>
        <p className="text-gray-500">{filtered.length} products</p>
      </div>

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-80 border border-gray-200 rounded-full px-5 py-2.5 text-sm mb-6 focus:outline-none focus:border-black"
      />

      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition-colors ${
                activeCategory === cat ? "bg-black text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat === "all" ? "All" : cat}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <SlidersHorizontal size={16} />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
          >
            {sortOptions.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">No products found.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense>
      <ShopContent />
    </Suspense>
  );
}
