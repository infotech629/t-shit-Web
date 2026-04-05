import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const values = [
  { emoji: "🧵", title: "Premium Quality", desc: "We use only 100% combed cotton for maximum softness and durability." },
  { emoji: "🌍", title: "Sustainable", desc: "Eco-friendly packaging and ethical manufacturing practices." },
  { emoji: "🎨", title: "Original Designs", desc: "Every graphic is designed in-house by our creative team." },
  { emoji: "🚀", title: "Fast Shipping", desc: "Orders dispatched within 24 hours, delivered in 2-5 days." },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-[50vh] flex items-center overflow-hidden bg-black">
        <Image
          src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1400&q=80"
          alt="About"
          fill
          className="object-cover opacity-40"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="text-5xl sm:text-7xl font-black text-white">Our Story</h1>
          <p className="text-gray-300 mt-4 max-w-lg text-lg">Born on the streets. Built for the bold.</p>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">Who We Are</p>
          <h2 className="text-3xl font-black mb-6">We're THREADCO</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            THREADCO was founded in 2022 by a group of streetwear enthusiasts who were tired of overpriced, low-quality tees. We set out to create premium T-shirts that look great, feel amazing, and don't break the bank.
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            From our first drop of 100 tees to thousands of happy customers across India, we've stayed true to our roots — bold designs, premium fabric, and a community that wears its identity with pride.
          </p>
          <Link href="/shop" className="inline-flex items-center gap-2 bg-black text-white font-bold px-6 py-3 rounded-full hover:bg-gray-800 transition-colors">
            Shop the Collection <ArrowRight size={16} />
          </Link>
        </div>
        <div className="relative aspect-square rounded-3xl overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=700&q=80"
            alt="Our Story"
            fill
            className="object-cover"
          />
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black">What We Stand For</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-white rounded-2xl p-6 text-center">
                <div className="text-4xl mb-4">{v.emoji}</div>
                <h3 className="font-bold mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { num: "10K+", label: "Happy Customers" },
            { num: "50+", label: "Unique Designs" },
            { num: "4.8★", label: "Average Rating" },
            { num: "2-5", label: "Days Delivery" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-4xl font-black text-yellow-400 mb-2">{s.num}</div>
              <div className="text-gray-400 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
