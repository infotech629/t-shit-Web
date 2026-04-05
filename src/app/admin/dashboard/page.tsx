"use client";
import Link from "next/link";
import { useAdmin } from "@/context/AdminContext";
import { TrendingUp, ShoppingBag, Package, Users, ArrowRight, ArrowUpRight } from "lucide-react";

export default function DashboardPage() {
  const { products, orders } = useAdmin();

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const processing = orders.filter((o) => o.status === "Processing").length;
  const shipped = orders.filter((o) => o.status === "Shipped").length;
  const delivered = orders.filter((o) => o.status === "Delivered").length;

  const stats = [
    { icon: TrendingUp, label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, sub: `${orders.length} orders`, color: "bg-yellow-400", textColor: "text-black" },
    { icon: ShoppingBag, label: "Total Orders", value: orders.length, sub: `${processing} processing`, color: "bg-black", textColor: "text-white" },
    { icon: Package, label: "Products", value: products.length, sub: "In catalogue", color: "bg-gray-800", textColor: "text-white" },
    { icon: Users, label: "Customers", value: orders.length, sub: "Unique buyers", color: "bg-gray-600", textColor: "text-white" },
  ];

  const orderStatusData = [
    { label: "Processing", count: processing, color: "bg-yellow-400" },
    { label: "Shipped", count: shipped, color: "bg-blue-500" },
    { label: "Delivered", count: delivered, color: "bg-green-500" },
    { label: "Cancelled", count: orders.filter((o) => o.status === "Cancelled").length, color: "bg-red-400" },
  ];

  const topProducts = products.slice(0, 5);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map(({ icon: Icon, label, value, sub, color, textColor }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100">
            <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center mb-4`}>
              <Icon size={20} className={textColor} />
            </div>
            <p className="text-2xl font-black">{value}</p>
            <p className="text-sm font-semibold text-gray-700 mt-0.5">{label}</p>
            <p className="text-xs text-gray-400 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Order Status */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h2 className="font-black mb-5">Order Status</h2>
          <div className="space-y-4">
            {orderStatusData.map((s) => (
              <div key={s.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-gray-600">{s.label}</span>
                  <span className="font-bold">{s.count}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${s.color} rounded-full transition-all`}
                    style={{ width: orders.length ? `${(s.count / orders.length) * 100}%` : "0%" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-black">Top Products</h2>
            <Link href="/admin/products" className="text-xs text-gray-400 hover:text-black flex items-center gap-1">
              View All <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-4">
                <span className="text-xs font-bold text-gray-300 w-4">{i + 1}</span>
                <div
                  className="w-10 h-10 rounded-xl bg-gray-100 bg-cover bg-center shrink-0"
                  style={{ backgroundImage: p.images[0] ? `url(${p.images[0]})` : undefined }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{p.name}</p>
                  <p className="text-xs text-gray-400 capitalize">{p.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">₹{p.price}</p>
                  <p className="text-xs text-gray-400">⭐ {p.rating}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {orders.length === 0 && products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <p className="text-4xl mb-4">🚀</p>
          <h3 className="font-black text-lg mb-2">Welcome to THREADCO Admin!</h3>
          <p className="text-gray-500 text-sm mb-6">Start by adding your first product from the Products section.</p>
          <Link href="/admin/products" className="bg-black text-white font-bold px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors inline-flex items-center gap-2">
            <Package size={16} /> Add First Product
          </Link>
        </div>
      ) : (
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-black">Recent Orders</h2>
          <Link href="/admin/orders" className="text-xs text-gray-400 hover:text-black flex items-center gap-1">
            View All <ArrowUpRight size={12} />
          </Link>
        </div>
        {orders.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <ShoppingBag size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No orders yet. Orders will appear here once customers place them.</p>
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["Order ID", "Customer", "Items", "Total", "Payment", "Status", "Date"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.slice(0, 6).map((o) => (
                <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 font-mono text-xs text-gray-500">{o.id}</td>
                  <td className="px-5 py-4">
                    <p className="font-semibold">{o.customer}</p>
                    <p className="text-xs text-gray-400">{o.email}</p>
                  </td>
                  <td className="px-5 py-4 text-gray-500">{o.items.length} item(s)</td>
                  <td className="px-5 py-4 font-bold">₹{o.total}</td>
                  <td className="px-5 py-4">
                    <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-1 rounded-full">{o.payment}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      o.status === "Delivered" ? "bg-green-100 text-green-700"
                      : o.status === "Shipped" ? "bg-blue-100 text-blue-700"
                      : o.status === "Cancelled" ? "bg-red-100 text-red-600"
                      : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-400 text-xs">{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>
      )}
    </div>
  );
}
