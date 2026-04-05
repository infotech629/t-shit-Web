"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAdmin } from "@/context/AdminContext";
import { CheckCircle } from "lucide-react";

export default function CheckoutPage() {
  const { state, total, dispatch } = useCart();
  const { addOrder } = useAdmin();
  const router = useRouter();
  const [placed, setPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [form, setForm] = useState({
    name: "", email: "", phone: "", address: "", city: "", pincode: "", payment: "cod",
  });

  const shipping = total >= 999 ? 0 : 99;
  const grandTotal = total + shipping;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `ORD-${Date.now().toString().slice(-6)}`;
    addOrder({
      id,
      customer: form.name,
      email: form.email,
      phone: form.phone,
      address: `${form.address}, ${form.city} - ${form.pincode}`,
      items: state.items.map((i) => ({ name: i.name, qty: i.quantity, price: i.price, size: i.size, color: i.color })),
      total: grandTotal,
      payment: form.payment === "cod" ? "COD" : "UPI",
      status: "Processing",
      date: new Date().toISOString().split("T")[0],
    });
    dispatch({ type: "CLEAR_CART" });
    setOrderId(id);
    setPlaced(true);
  };

  if (placed) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <CheckCircle size={72} className="text-green-500" />
        <h2 className="text-3xl font-black">Order Placed! 🎉</h2>
        <p className="text-gray-500 max-w-sm">Thank you for your order. Your order <strong>{orderId}</strong> has been placed successfully.</p>
        <p className="text-sm text-gray-400">You'll receive a confirmation shortly.</p>
        <div className="flex gap-3 mt-2">
          <a href={`/track?id=${orderId}`} className="bg-black text-white font-bold px-8 py-3 rounded-full hover:bg-gray-800 transition-colors">
            Track Order
          </a>
          <button onClick={() => router.push("/")} className="border-2 border-black font-bold px-8 py-3 rounded-full hover:bg-black hover:text-white transition-colors">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (state.items.length === 0) {
    router.push("/cart");
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-black mb-10">Checkout</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-50 rounded-2xl p-6">
            <h2 className="font-black text-lg mb-5">Delivery Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: "name", label: "Full Name", type: "text", placeholder: "Your full name" },
                { name: "email", label: "Email", type: "email", placeholder: "your@email.com" },
                { name: "phone", label: "Phone Number", type: "tel", placeholder: "10-digit mobile number" },
                { name: "pincode", label: "Pincode", type: "text", placeholder: "6-digit pincode" },
              ].map((f) => (
                <div key={f.name}>
                  <label className="block text-sm font-semibold mb-1.5">{f.label}</label>
                  <input
                    type={f.type}
                    name={f.name}
                    value={form[f.name as keyof typeof form]}
                    onChange={handleChange}
                    placeholder={f.placeholder}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black"
                  />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold mb-1.5">Address</label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="House no, Street, Area"
                  required
                  rows={2}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">City</label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="City"
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black"
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6">
            <h2 className="font-black text-lg mb-5">Payment Method</h2>
            <div className="space-y-3">
              {[
                { value: "cod", label: "Cash on Delivery", icon: "💵", sub: "Pay when your order arrives" },
                { value: "upi", label: "UPI / Razorpay", icon: "📱", sub: "Pay via UPI, cards, net banking" },
              ].map((p) => (
                <label key={p.value} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${form.payment === p.value ? "border-black bg-white" : "border-gray-200"}`}>
                  <input type="radio" name="payment" value={p.value} checked={form.payment === p.value} onChange={handleChange} className="accent-black" />
                  <span className="text-xl">{p.icon}</span>
                  <div>
                    <p className="font-semibold text-sm">{p.label}</p>
                    <p className="text-xs text-gray-400">{p.sub}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 rounded-2xl p-6 h-fit">
          <h2 className="font-black text-lg mb-5">Order Summary</h2>
          <div className="space-y-3 mb-5">
            {state.items.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex justify-between text-sm">
                <span className="text-gray-600 truncate max-w-[160px]">{item.name} × {item.quantity}</span>
                <span className="font-semibold">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span>₹{total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Shipping</span>
              <span className={shipping === 0 ? "text-green-600 font-semibold" : ""}>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
            </div>
            <div className="flex justify-between font-black text-lg pt-2 border-t border-gray-200">
              <span>Total</span>
              <span>₹{grandTotal}</span>
            </div>
          </div>
          <button type="submit" className="w-full bg-black text-white font-bold py-4 rounded-full mt-6 hover:bg-gray-800 transition-colors">
            Place Order
          </button>
          <p className="text-xs text-center text-gray-400 mt-3">🔒 Secure & encrypted checkout</p>
        </div>
      </form>
    </div>
  );
}
