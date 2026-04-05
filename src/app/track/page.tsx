"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAdmin } from "@/context/AdminContext";
import { Search, Package, Truck, CheckCircle, XCircle, Clock, MapPin, Phone, Mail } from "lucide-react";

const steps = ["Processing", "Shipped", "Delivered"];

const statusConfig: Record<string, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  Processing: { icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-200", label: "Order Processing" },
  Shipped:    { icon: Truck, color: "text-blue-600",   bg: "bg-blue-50 border-blue-200",     label: "Shipped" },
  Delivered:  { icon: CheckCircle, color: "text-green-600", bg: "bg-green-50 border-green-200", label: "Delivered" },
  Cancelled:  { icon: XCircle, color: "text-red-600",  bg: "bg-red-50 border-red-200",       label: "Cancelled" },
};

function TrackContent() {
  const { orders } = useAdmin();
  const searchParams = useSearchParams();
  const [input, setInput] = useState(searchParams.get("id") || "");
  const [searched, setSearched] = useState(!!searchParams.get("id"));
  const [orderId, setOrderId] = useState(searchParams.get("id") || "");

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) { setInput(id); setOrderId(id); setSearched(true); }
  }, [searchParams]);

  const order = orders.find(
    (o) => o.id.toLowerCase() === orderId.toLowerCase()
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderId(input.trim());
    setSearched(true);
  };

  const currentStep = order ? steps.indexOf(order.status) : -1;
  const config = order ? (statusConfig[order.status] ?? statusConfig["Processing"]) : null;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-10">
        <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Package size={26} className="text-white" />
        </div>
        <h1 className="text-3xl font-black">Track Your Order</h1>
        <p className="text-gray-500 mt-2 text-sm">Enter your Order ID to see the latest status</p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-8">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter Order ID (e.g. ORD-504730)"
            className="w-full pl-10 pr-4 py-3.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black transition-colors"
          />
        </div>
        <button
          type="submit"
          className="bg-black text-white font-bold px-6 py-3.5 rounded-xl hover:bg-gray-800 transition-colors whitespace-nowrap"
        >
          Track
        </button>
      </form>

      {/* Not Found */}
      {searched && !order && (
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <XCircle size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="font-bold text-gray-700">Order not found</p>
          <p className="text-sm text-gray-400 mt-1">Please check your Order ID and try again</p>
        </div>
      )}

      {/* Order Found */}
      {order && config && (
        <div className="space-y-5">
          {/* Status Card */}
          <div className={`border-2 rounded-2xl p-5 ${config.bg}`}>
            <div className="flex items-center gap-3">
              <config.icon size={28} className={config.color} />
              <div>
                <p className="font-black text-lg">{config.label}</p>
                <p className="text-sm text-gray-500">Order ID: <span className="font-mono font-bold text-black">{order.id}</span></p>
              </div>
            </div>
          </div>

          {/* Progress Tracker */}
          {order.status !== "Cancelled" && (
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <h3 className="font-black mb-6">Order Progress</h3>
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-200 z-0" />
                <div
                  className="absolute top-5 left-5 h-0.5 bg-black z-0 transition-all duration-500"
                  style={{ width: currentStep >= 0 ? `${(currentStep / (steps.length - 1)) * 100}%` : "0%" }}
                />
                <div className="relative z-10 flex justify-between">
                  {steps.map((step, i) => {
                    const done = i <= currentStep;
                    const active = i === currentStep;
                    return (
                      <div key={step} className="flex flex-col items-center gap-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                          done ? "bg-black border-black" : "bg-white border-gray-200"
                        } ${active ? "ring-4 ring-black/10" : ""}`}>
                          {done
                            ? <CheckCircle size={18} className="text-white" />
                            : <span className="text-xs font-bold text-gray-400">{i + 1}</span>}
                        </div>
                        <span className={`text-xs font-semibold ${done ? "text-black" : "text-gray-400"}`}>{step}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Order Details */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <h3 className="font-black mb-4">Order Details</h3>
            <div className="space-y-2 mb-4">
              {order.items.map((item, i) => (
                <div key={i} className="py-2 border-b border-gray-50 last:border-0">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700 font-medium">{item.name} <span className="text-gray-400">× {item.qty}</span></span>
                    <span className="font-semibold">₹{item.price * item.qty}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {item.size && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-semibold">Size: {item.size}</span>
                    )}
                    {item.color && (
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <span className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: item.color }} />
                        {item.color}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-black text-base pt-2 border-t border-gray-100">
              <span>Total</span>
              <span>₹{order.total}</span>
            </div>
            <div className="mt-3 flex gap-2">
              <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">{order.payment}</span>
              <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">{order.date}</span>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <h3 className="font-black mb-4">Delivery Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold">{order.customer}</p>
                  <p className="text-gray-500">{order.address}</p>
                </div>
              </div>
              {order.phone && (
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-gray-400 shrink-0" />
                  <p className="text-gray-600">{order.phone}</p>
                </div>
              )}
              {order.email && (
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-gray-400 shrink-0" />
                  <p className="text-gray-600">{order.email}</p>
                </div>
              )}
            </div>
          </div>

          {/* Help */}
          <div className="bg-gray-50 rounded-2xl p-5 text-center">
            <p className="text-sm text-gray-500">Need help with your order?</p>
            <a href="/contact" className="text-sm font-bold text-black hover:underline mt-1 inline-block">
              Contact Support →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense>
      <TrackContent />
    </Suspense>
  );
}
