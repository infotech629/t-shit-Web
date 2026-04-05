"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard, Package, Image, ShoppingBag, LogOut, ExternalLink, Star,
} from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/banners", label: "Banners", icon: Image },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="w-64 min-h-screen bg-black text-white flex flex-col fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <div className="text-xl font-black tracking-tighter">
          THREAD<span className="text-yellow-400">CO</span>
        </div>
        <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                active
                  ? "bg-yellow-400 text-black"
                  : "text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-400 hover:bg-white/10 hover:text-white transition-all"
        >
          <ExternalLink size={18} />
          View Website
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-all"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
