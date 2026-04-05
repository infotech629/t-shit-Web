"use client";
import { useState, useMemo } from "react";
import { useAdmin } from "@/context/AdminContext";
import { Search, ChevronDown } from "lucide-react";

const statusColors: Record<string, string> = {
  Processing: "bg-yellow-100 text-yellow-700",
  Shipped: "bg-blue-100 text-blue-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-600",
};

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useAdmin();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        o.customer.toLowerCase().includes(search.toLowerCase()) ||
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.email.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === "all" || o.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [orders, search, filterStatus]);

  const totalRevenue = filtered.reduce((s, o) => s + o.total, 0);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black">Orders</h1>
        <p className="text-gray-500 text-sm mt-1">{orders.length} total orders · ₹{orders.reduce((s, o) => s + o.total, 0).toLocaleString()} revenue</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {["Processing", "Shipped", "Delivered", "Cancelled"].map((s) => {
          const count = orders.filter((o) => o.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(filterStatus === s ? "all" : s)}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${filterStatus === s ? "border-black bg-black text-white" : "border-gray-100 bg-white hover:border-gray-300"}`}
            >
              <p className={`text-2xl font-black ${filterStatus === s ? "text-white" : ""}`}>{count}</p>
              <p className={`text-sm mt-0.5 ${filterStatus === s ? "text-gray-300" : "text-gray-500"}`}>{s}</p>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, order ID, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black w-72"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black bg-white"
        >
          <option value="all">All Status</option>
          {["Processing", "Shipped", "Delivered", "Cancelled"].map((s) => <option key={s}>{s}</option>)}
        </select>
        {(search || filterStatus !== "all") && (
          <button onClick={() => { setSearch(""); setFilterStatus("all"); }} className="px-4 py-2.5 text-sm text-gray-500 hover:text-black border border-gray-200 rounded-xl">
            Clear filters
          </button>
        )}
      </div>

      {filtered.length > 0 && (
        <p className="text-sm text-gray-400 mb-4">{filtered.length} orders · ₹{totalRevenue.toLocaleString()} total</p>
      )}

      {/* Orders List */}
      <div className="space-y-3">
        {filtered.map((o) => (
          <div key={o.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {/* Header Row */}
            <div
              className="flex flex-wrap items-center gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpanded(expanded === o.id ? null : o.id)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-mono text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-lg">{o.id}</span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusColors[o.status] || "bg-gray-100 text-gray-600"}`}>
                    {o.status}
                  </span>
                </div>
                <p className="font-semibold mt-1">{o.customer}</p>
                <p className="text-xs text-gray-400">{o.email} · {o.phone}</p>
              </div>
              <div className="text-right">
                <p className="font-black text-lg">₹{o.total}</p>
                <p className="text-xs text-gray-400">{o.payment} · {o.date}</p>
              </div>
              <ChevronDown size={18} className={`text-gray-400 transition-transform ${expanded === o.id ? "rotate-180" : ""}`} />
            </div>

            {/* Expanded Details */}
            {expanded === o.id && (
              <div className="border-t border-gray-100 px-5 py-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Delivery Address</p>
                    <p className="text-sm text-gray-700">{o.address}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Order Items</p>
                    <div className="space-y-2">
                      {o.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm items-start gap-3">
                          <div>
                            <p className="text-gray-800 font-medium">{item.name} × {item.qty}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              {item.size && (
                                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-semibold">
                                  Size: {item.size}
                                </span>
                              )}
                              {item.color && (
                                <span className="flex items-center gap-1 text-xs text-gray-500">
                                  <span className="w-3.5 h-3.5 rounded-full border border-gray-300 inline-block" style={{ backgroundColor: item.color }} />
                                  {item.color}
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="font-semibold shrink-0">₹{item.price * item.qty}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <p className="text-sm font-semibold text-gray-600">Update Status:</p>
                  <div className="flex gap-2 flex-wrap">
                    {["Processing", "Shipped", "Delivered", "Cancelled"].map((s) => (
                      <button
                        key={s}
                        onClick={() => updateOrderStatus(o.id, s)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${o.status === s ? "bg-black text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-black"}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-100">
            No orders found.
          </div>
        )}
      </div>
    </div>
  );
}
