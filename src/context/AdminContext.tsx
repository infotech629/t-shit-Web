"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "@/lib/data";
import { supabase } from "@/lib/supabase";

export interface Banner {
  badge: string; heading: string; highlight: string;
  subtext: string; image: string; ctaLabel: string; ctaLink: string;
}
export interface PromoBanner {
  badge: string; heading: string; subtext: string;
  image: string; ctaLabel: string; ctaLink: string;
}
export interface Order {
  id: string; customer: string; email: string; phone: string; address: string;
  items: { name: string; qty: number; price: number; size?: string; color?: string }[];
  total: number; payment: string; status: string; date: string;
}
export interface Review {
  id: string; name: string; rating: number;
  comment: string; product: string; avatar: string;
}

interface AdminContextType {
  products: Product[]; addProduct: (p: Product) => void;
  updateProduct: (p: Product) => void; deleteProduct: (id: string) => void;
  orders: Order[]; addOrder: (o: Order) => void;
  updateOrderStatus: (id: string, status: string) => void;
  banner: Banner; updateBanner: (b: Banner) => void;
  promoBanner: PromoBanner; updatePromoBanner: (b: PromoBanner) => void;
  reviews: Review[]; addReview: (r: Review) => void; deleteReview: (id: string) => void;
  loading: boolean;
}

const AdminContext = createContext<AdminContextType | null>(null);

const defaultBanner: Banner = {
  badge: "New Collection 2024", heading: "WEAR YOUR", highlight: "STYLE.",
  subtext: "Premium streetwear tees crafted for the bold. Express yourself with every thread.",
  image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=1400&q=80",
  ctaLabel: "Shop Now", ctaLink: "/shop",
};
const defaultPromoBanner: PromoBanner = {
  badge: "Limited Edition", heading: "New Drop Alert 🔥",
  subtext: "Exclusive graphic tees dropping this week. Don't miss out.",
  image: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=1200&q=80",
  ctaLabel: "Shop Graphic Tees", ctaLink: "/shop?category=graphic",
};

function lsGet(key: string, fallback: unknown) {
  if (typeof window === "undefined") return fallback;
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}
function lsSet(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [banner, setBanner] = useState<Banner>(defaultBanner);
  const [promoBanner, setPromoBanner] = useState<PromoBanner>(defaultPromoBanner);
  const [loading, setLoading] = useState(true);
  const [useDb, setUseDb] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [{ data: prods, error: e1 }, { data: ords, error: e2 }, { data: revs, error: e3 }, { data: settings, error: e4 }] =
          await Promise.all([
            supabase.from("products").select("*").order("created_at", { ascending: false }),
            supabase.from("orders").select("*").order("created_at", { ascending: false }),
            supabase.from("reviews").select("*").order("created_at", { ascending: false }),
            supabase.from("settings").select("*"),
          ]);

        if (e1 || e2 || e3 || e4) throw new Error("Supabase error");

        setProducts(prods ?? []);
        setOrders(ords ?? []);
        setReviews(revs ?? []);

        if (settings) {
          const b = settings.find((s: { key: string; value: Banner }) => s.key === "banner");
          const pb = settings.find((s: { key: string; value: PromoBanner }) => s.key === "promo_banner");
          if (b?.value) setBanner(b.value);
          if (pb?.value) setPromoBanner(pb.value);
        }
        setUseDb(true);
      } catch {
        // Fallback to localStorage
        setProducts(lsGet("tc_products", []) as Product[]);
        setOrders(lsGet("tc_orders", []) as Order[]);
        setReviews(lsGet("tc_reviews", []) as Review[]);
        setBanner(lsGet("tc_banner", defaultBanner) as Banner);
        setPromoBanner(lsGet("tc_promo_banner", defaultPromoBanner) as PromoBanner);
      }
      setLoading(false);
    };
    load();
  }, []);

  // Always backup to localStorage
  useEffect(() => { lsSet("tc_products", products); }, [products]);
  useEffect(() => { lsSet("tc_orders", orders); }, [orders]);
  useEffect(() => { lsSet("tc_reviews", reviews); }, [reviews]);
  useEffect(() => { lsSet("tc_banner", banner); }, [banner]);
  useEffect(() => { lsSet("tc_promo_banner", promoBanner); }, [promoBanner]);

  const addProduct = async (p: Product) => {
    setProducts((prev) => [p, ...prev]);
    if (useDb) await supabase.from("products").insert(p);
  };
  const updateProduct = async (p: Product) => {
    setProducts((prev) => prev.map((x) => (x.id === p.id ? p : x)));
    if (useDb) await supabase.from("products").update(p).eq("id", p.id);
  };
  const deleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((x) => x.id !== id));
    if (useDb) await supabase.from("products").delete().eq("id", id);
  };

  const addOrder = async (o: Order) => {
    setOrders((prev) => [o, ...prev]);
    if (useDb) await supabase.from("orders").insert(o);
  };
  const updateOrderStatus = async (id: string, status: string) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    if (useDb) await supabase.from("orders").update({ status }).eq("id", id);
  };

  const updateBanner = async (b: Banner) => {
    setBanner(b);
    if (useDb) await supabase.from("settings").upsert({ key: "banner", value: b });
  };
  const updatePromoBanner = async (b: PromoBanner) => {
    setPromoBanner(b);
    if (useDb) await supabase.from("settings").upsert({ key: "promo_banner", value: b });
  };

  const addReview = async (r: Review) => {
    setReviews((prev) => [r, ...prev]);
    if (useDb) await supabase.from("reviews").insert(r);
  };
  const deleteReview = async (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    if (useDb) await supabase.from("reviews").delete().eq("id", id);
  };

  return (
    <AdminContext.Provider value={{
      products, addProduct, updateProduct, deleteProduct,
      orders, addOrder, updateOrderStatus,
      banner, updateBanner, promoBanner, updatePromoBanner,
      reviews, addReview, deleteReview, loading,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
