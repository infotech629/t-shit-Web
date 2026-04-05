"use client";
import { useState, use, useMemo } from "react";
import Link from "next/link";
import { Star, ShoppingCart, ArrowLeft, Shield, Truck } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { products } = useAdmin();
  const product = products.find((p) => p.id === id);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { dispatch } = useCart();

  const color = selectedColor || product?.colors[0] || "";

  // Get images for selected color
  const currentImages = useMemo(() => {
    if (!product) return [];
    const colorEntry = product.colorImages?.find((ci) => ci.color === color);
    if (colorEntry && colorEntry.images.length > 0) return colorEntry.images;
    return product.images;
  }, [product, color]);

  // Reset active image when color changes
  const handleColorChange = (c: string) => {
    setSelectedColor(c);
    setActiveImg(0);
  };

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-2xl font-black">Product not found</p>
        <Link href="/shop" className="bg-black text-white px-6 py-3 rounded-full font-bold">Back to Shop</Link>
      </div>
    );
  }

  const size = selectedSize || product.sizes[0];
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleAddToCart = () => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: currentImages[0] || product.images[0],
        size,
        color,
        quantity: qty,
      },
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/shop" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-8">
        <ArrowLeft size={16} /> Back to Shop
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        {/* Images */}
        <div>
          {/* Main Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-3">
            {currentImages[activeImg] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentImages[activeImg]}
                alt={product.name}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
            )}
            {product.badge && (
              <span className="absolute top-4 left-4 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                {product.badge}
              </span>
            )}
            {/* Image count badge */}
            {currentImages.length > 1 && (
              <span className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                {activeImg + 1} / {currentImages.length}
              </span>
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2 flex-wrap">
            {currentImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all ${
                  activeImg === i ? "border-black scale-105" : "border-transparent hover:border-gray-300"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">{product.category}</p>
          <h1 className="text-3xl font-black mb-3">{product.name}</h1>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} className={i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200 fill-gray-200"} />
              ))}
            </div>
            <span className="text-sm text-gray-500">{product.rating} ({product.reviews} reviews)</span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-black">₹{product.price}</span>
            {product.originalPrice && (
              <>
                <span className="text-lg text-gray-400 line-through">₹{product.originalPrice}</span>
                <span className="bg-green-100 text-green-700 text-sm font-bold px-2 py-0.5 rounded-full">{discount}% OFF</span>
              </>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

          {/* Color Picker */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-sm font-semibold">Color</p>
              <span className="text-xs text-gray-400">
                — {product.colorImages?.find((ci) => ci.color === color)?.images.length || 0} photos
              </span>
            </div>
            <div className="flex gap-3">
              {product.colors.map((c) => {
                const imgCount = product.colorImages?.find((ci) => ci.color === c)?.images.length || 0;
                return (
                  <button
                    key={c}
                    onClick={() => handleColorChange(c)}
                    title={`${c} — ${imgCount} photos`}
                    style={{ backgroundColor: c }}
                    className={`w-9 h-9 rounded-full border-4 transition-all ${
                      color === c ? "border-black scale-110 shadow-md" : "border-gray-200 hover:border-gray-400"
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Size */}
          <div className="mb-6">
            <p className="text-sm font-semibold mb-2">Size</p>
            <div className="flex gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`w-12 h-12 rounded-xl text-sm font-semibold border-2 transition-colors ${
                    size === s ? "border-black bg-black text-white" : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Qty */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-3 hover:bg-gray-50 font-bold">−</button>
              <span className="px-4 py-3 font-semibold">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="px-4 py-3 hover:bg-gray-50 font-bold">+</button>
            </div>
          </div>

          <div className="flex gap-3 mb-8">
            <button
              onClick={handleAddToCart}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-full font-bold text-sm transition-all ${
                added ? "bg-green-500 text-white" : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              <ShoppingCart size={18} />
              {added ? "Added to Cart!" : "Add to Cart"}
            </button>
            <Link
              href="/cart"
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-full font-bold text-sm border-2 border-black hover:bg-black hover:text-white transition-colors"
            >
              Buy Now
            </Link>
          </div>

          <div className="flex gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1.5"><Shield size={14} /> Secure Payment</span>
            <span className="flex items-center gap-1.5"><Truck size={14} /> Free Delivery ₹999+</span>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div>
          <h2 className="text-2xl font-black mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
