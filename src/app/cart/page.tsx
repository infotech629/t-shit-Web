"use client";
import Link from "next/link";
import { Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { state, dispatch, total } = useCart();
  const { items } = state;

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
        <ShoppingBag size={64} className="text-gray-200" />
        <h2 className="text-2xl font-black">Your cart is empty</h2>
        <p className="text-gray-500">Looks like you haven't added anything yet.</p>
        <Link href="/shop" className="bg-black text-white font-bold px-8 py-3 rounded-full hover:bg-gray-800 transition-colors">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-black mb-10">Your Cart ({items.length})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4 bg-gray-50 rounded-2xl p-4">
              <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{item.name}</h3>
                <p className="text-sm text-gray-500 mt-0.5">Size: {item.size} · Color: <span className="inline-block w-3 h-3 rounded-full border border-gray-300 align-middle" style={{ backgroundColor: item.color }} /></p>
                <p className="font-bold mt-1">₹{item.price}</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => dispatch({ type: "REMOVE_ITEM", payload: { id: item.id, size: item.size, color: item.color } })}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                  <button
                    onClick={() => {
                      if (item.quantity === 1) dispatch({ type: "REMOVE_ITEM", payload: { id: item.id, size: item.size, color: item.color } });
                      else dispatch({ type: "UPDATE_QTY", payload: { id: item.id, size: item.size, color: item.color, quantity: item.quantity - 1 } });
                    }}
                    className="px-3 py-1.5 hover:bg-gray-50 font-bold text-sm"
                  >−</button>
                  <span className="px-3 py-1.5 text-sm font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => dispatch({ type: "UPDATE_QTY", payload: { id: item.id, size: item.size, color: item.color, quantity: item.quantity + 1 } })}
                    className="px-3 py-1.5 hover:bg-gray-50 font-bold text-sm"
                  >+</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-gray-50 rounded-2xl p-6 h-fit">
          <h2 className="text-xl font-black mb-6">Order Summary</h2>
          <div className="space-y-3 text-sm mb-6">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-semibold">₹{total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Shipping</span>
              <span className="font-semibold text-green-600">{total >= 999 ? "FREE" : "₹99"}</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between font-black text-lg">
              <span>Total</span>
              <span>₹{total >= 999 ? total : total + 99}</span>
            </div>
          </div>
          {total < 999 && (
            <p className="text-xs text-gray-500 mb-4">Add ₹{999 - total} more for free shipping!</p>
          )}
          <Link
            href="/checkout"
            className="w-full bg-black text-white font-bold py-4 rounded-full flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
          >
            Proceed to Checkout <ArrowRight size={18} />
          </Link>
          <Link href="/shop" className="block text-center text-sm text-gray-500 hover:text-black mt-4">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
