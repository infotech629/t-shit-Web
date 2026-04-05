"use client";
import Link from "next/link";
import { Star, ShoppingCart } from "lucide-react";
import { Product } from "@/lib/data";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }: { product: Product }) {
  const { dispatch } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        size: "M",
        color: product.colors[0],
        quantity: 1,
      },
    });
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-gray-50 aspect-[3/4]">
        {product.images[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">👕</div>
        )}
        {product.badge && (
          <span className="absolute top-3 left-3 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full">
            {product.badge}
          </span>
        )}
        {discount && (
          <span className="absolute top-3 right-3 bg-black text-white text-xs font-bold px-2 py-1 rounded-full">
            -{discount}%
          </span>
        )}
        <button
          onClick={handleQuickAdd}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 whitespace-nowrap"
        >
          <ShoppingCart size={14} /> Quick Add
        </button>
      </div>
      <div className="mt-3 px-1">
        <p className="text-xs text-gray-400 uppercase tracking-wider">{product.category}</p>
        <h3 className="font-semibold text-gray-900 mt-0.5 group-hover:text-yellow-500 transition-colors">{product.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-bold text-gray-900">₹{product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
          )}
        </div>
        <div className="flex items-center gap-1 mt-1">
          <Star size={12} className="fill-yellow-400 text-yellow-400" />
          <span className="text-xs text-gray-500">{product.rating} ({product.reviews})</span>
        </div>
      </div>
    </Link>
  );
}
