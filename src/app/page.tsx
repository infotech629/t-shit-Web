"use client";
import Link from "next/link";
import { ArrowRight, Star, Shield, Truck, RotateCcw, Zap } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import ProductCard from "@/components/ProductCard";

const categories = [
  { label: "Men", slug: "men", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80" },
  { label: "Women", slug: "women", img: "https://images.unsplash.com/photo-1554568218-0f1715e72254?w=400&q=80" },
  { label: "Oversized", slug: "oversized", img: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&q=80" },
  { label: "Graphic Tees", slug: "graphic", img: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&q=80" },
];

const trustBadges = [
  { icon: Shield, label: "Secure Payment", sub: "100% safe checkout" },
  { icon: Truck, label: "Fast Delivery", sub: "2-5 business days" },
  { icon: RotateCcw, label: "Easy Returns", sub: "7-day return policy" },
  { icon: Zap, label: "Premium Quality", sub: "100% cotton fabric" },
];

export default function HomePage() {
  const { products, banner, promoBanner, reviews } = useAdmin();
  const featured = products.slice(0, 4);

  return (
    <div>
      {/* Hero Banner — Admin controlled */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={banner.image} alt="Hero" className="absolute inset-0 w-full h-full object-cover opacity-50" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="max-w-2xl animate-fade-up">
            <span className="inline-block bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full mb-6 uppercase tracking-widest">
              {banner.badge}
            </span>
            <h1 className="text-5xl sm:text-7xl font-black text-white leading-none tracking-tight mb-6">
              {banner.heading}<br />
              <span className="text-yellow-400">{banner.highlight}</span>
            </h1>
            <p className="text-gray-300 text-lg mb-8 max-w-md">{banner.subtext}</p>
            <div className="flex flex-wrap gap-4">
              <Link
                href={banner.ctaLink}
                className="bg-yellow-400 text-black font-bold px-8 py-4 rounded-full hover:bg-yellow-300 transition-colors flex items-center gap-2"
              >
                {banner.ctaLabel} <ArrowRight size={18} />
              </Link>
              <Link
                href="/about"
                className="border border-white text-white font-semibold px-8 py-4 rounded-full hover:bg-white hover:text-black transition-colors"
              >
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-yellow-400 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {trustBadges.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-3 py-2">
              <Icon size={22} className="text-black shrink-0" />
              <div>
                <p className="font-bold text-black text-sm">{label}</p>
                <p className="text-black/70 text-xs">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Browse by</p>
            <h2 className="text-3xl sm:text-4xl font-black">Categories</h2>
          </div>
          <Link href="/shop" className="text-sm font-semibold text-gray-500 hover:text-black flex items-center gap-1">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/shop?category=${cat.slug}`} className="group relative overflow-hidden rounded-2xl aspect-square">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cat.img} alt={cat.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
              <div className="absolute inset-0 flex items-end p-5">
                <span className="text-white font-bold text-lg">{cat.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products — from AdminContext */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Hand-picked</p>
              <h2 className="text-3xl sm:text-4xl font-black">Featured Drops</h2>
            </div>
            <Link href="/shop" className="text-sm font-semibold text-gray-500 hover:text-black flex items-center gap-1">
              Shop All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Promo Banner — Admin controlled */}
      <section className="relative overflow-hidden bg-black py-24 mx-4 sm:mx-6 rounded-3xl mb-20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={promoBanner.image} alt="Promo Banner" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="relative z-10 text-center px-4">
          <p className="text-yellow-400 text-sm font-bold uppercase tracking-widest mb-4">{promoBanner.badge}</p>
          <h2 className="text-4xl sm:text-6xl font-black text-white mb-6">{promoBanner.heading}</h2>
          <p className="text-gray-300 mb-8 max-w-md mx-auto">{promoBanner.subtext}</p>
          <Link href={promoBanner.ctaLink} className="bg-yellow-400 text-black font-bold px-8 py-4 rounded-full hover:bg-yellow-300 transition-colors inline-flex items-center gap-2">
            {promoBanner.ctaLabel} <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Reviews — from AdminContext */}
      {reviews.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">What they say</p>
            <h2 className="text-3xl sm:text-4xl font-black">Customer Love</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((r) => (
              <div key={r.id} className="bg-gray-50 rounded-2xl p-6">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">"{r.comment}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">
                    {r.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{r.name}</p>
                    <p className="text-xs text-gray-400">{r.product}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
