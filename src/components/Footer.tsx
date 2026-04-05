import Link from "next/link";
export default function Footer() {
  const socials = [
    { label: "Instagram", href: "#" },
    { label: "Twitter", href: "#" },
    { label: "Facebook", href: "#" },
    { label: "YouTube", href: "#" },
  ];

  return (
    <footer className="bg-black text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="text-2xl font-black tracking-tighter mb-3">
            THREAD<span className="text-yellow-400">CO</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Premium streetwear for the bold. Wear your style, own your story.
          </p>
          <div className="flex gap-3 mt-5">
            {socials.map((s) => (
              <a key={s.label} href={s.href} className="text-xs text-gray-400 hover:text-yellow-400 transition-colors border border-gray-700 px-2 py-1 rounded-lg">
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Shop</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            {["Men", "Women", "Oversized", "Graphic Tees", "New Arrivals"].map((item) => (
              <li key={item}>
                <Link href="/shop" className="hover:text-white transition-colors">{item}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Help</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            {["About Us", "Contact Us", "Size Guide", "Returns & Exchange", "Track Order"].map((item) => (
              <li key={item}>
                <Link href="/contact" className="hover:text-white transition-colors">{item}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Trust</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="flex items-center gap-2">🔒 Secure Payments</li>
            <li className="flex items-center gap-2">🚚 Fast Delivery (2-5 days)</li>
            <li className="flex items-center gap-2">↩️ Easy Returns</li>
            <li className="flex items-center gap-2">✅ 100% Authentic</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-12 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-500">
        <p>© 2024 THREADCO. All rights reserved.</p>
        <p>Made with ❤️ for streetwear lovers</p>
      </div>
    </footer>
  );
}
