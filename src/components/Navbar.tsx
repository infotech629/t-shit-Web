"use client";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Menu, X, Search } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/track", label: "Track Order" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link href="/" className="text-2xl font-black tracking-tighter text-black">
          THREAD<span className="text-yellow-400">CO</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link href="/shop" className="hidden md:block text-gray-500 hover:text-black transition-colors">
            <Search size={20} />
          </Link>
          <Link href="/cart" className="relative text-gray-700 hover:text-black transition-colors">
            <ShoppingCart size={22} />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          <button className="md:hidden text-gray-700" onClick={() => setOpen(!open)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-gray-700 hover:text-black" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
