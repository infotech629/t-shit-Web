"use client";
import { useState, useRef } from "react";
import { useAdmin, Banner, PromoBanner } from "@/context/AdminContext";
import { fileToBase64 } from "@/lib/imageUtils";
import { CheckCircle, Eye, Upload } from "lucide-react";

export default function AdminBannersPage() {
  const { banner, updateBanner, promoBanner, updatePromoBanner } = useAdmin();
  const [bannerForm, setBannerForm] = useState<Banner>({ ...banner });
  const [promoForm, setPromoForm] = useState<PromoBanner>({ ...promoBanner });
  const [bannerSaved, setBannerSaved] = useState(false);
  const [promoSaved, setPromoSaved] = useState(false);
  const [activePreview, setActivePreview] = useState<"hero" | "promo">("hero");
  const heroBannerFileRef = useRef<HTMLInputElement>(null);
  const promoBannerFileRef = useRef<HTMLInputElement>(null);

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await fileToBase64(file);
    setBannerForm((f) => ({ ...f, image: base64 }));
  };

  const handlePromoImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await fileToBase64(file);
    setPromoForm((f) => ({ ...f, image: base64 }));
  };

  const handleBannerSave = () => {
    updateBanner(bannerForm);
    setBannerSaved(true);
    setTimeout(() => setBannerSaved(false), 2500);
  };

  const handlePromoSave = () => {
    updatePromoBanner(promoForm);
    setPromoSaved(true);
    setTimeout(() => setPromoSaved(false), 2500);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black">Banners</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your homepage banners. Changes reflect instantly on the website.</p>
      </div>

      {/* Preview Toggle */}
      <div className="flex gap-2 mb-6">
        <button onClick={() => setActivePreview("hero")} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${activePreview === "hero" ? "bg-black text-white" : "bg-white border border-gray-200 text-gray-600"}`}>
          <Eye size={15} /> Hero Banner
        </button>
        <button onClick={() => setActivePreview("promo")} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${activePreview === "promo" ? "bg-black text-white" : "bg-white border border-gray-200 text-gray-600"}`}>
          <Eye size={15} /> Promo Banner
        </button>
      </div>

      {/* ── HERO BANNER ── */}
      {activePreview === "hero" && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-black">Hero Banner Settings</h2>
              {bannerSaved && (
                <span className="flex items-center gap-1.5 text-green-600 text-sm font-semibold">
                  <CheckCircle size={15} /> Saved!
                </span>
              )}
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5">Badge Text</label>
                <input type="text" value={bannerForm.badge} onChange={(e) => setBannerForm({ ...bannerForm, badge: e.target.value })}
                  placeholder="New Collection 2024"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Main Heading</label>
                  <input type="text" value={bannerForm.heading} onChange={(e) => setBannerForm({ ...bannerForm, heading: e.target.value })}
                    placeholder="WEAR YOUR"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Highlighted Word</label>
                  <input type="text" value={bannerForm.highlight} onChange={(e) => setBannerForm({ ...bannerForm, highlight: e.target.value })}
                    placeholder="STYLE."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Subtext</label>
                <textarea value={bannerForm.subtext} onChange={(e) => setBannerForm({ ...bannerForm, subtext: e.target.value })}
                  placeholder="Premium streetwear tees crafted for the bold..." rows={2}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Button Label</label>
                  <input type="text" value={bannerForm.ctaLabel} onChange={(e) => setBannerForm({ ...bannerForm, ctaLabel: e.target.value })}
                    placeholder="Shop Now"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Button Link</label>
                  <input type="text" value={bannerForm.ctaLink} onChange={(e) => setBannerForm({ ...bannerForm, ctaLink: e.target.value })}
                    placeholder="/shop"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black" />
                </div>
              </div>
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold mb-1.5">Background Image</label>
                <input ref={heroBannerFileRef} type="file" accept="image/*" className="hidden" onChange={handleHeroImageUpload} />
                <button type="button" onClick={() => heroBannerFileRef.current?.click()}
                  className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-gray-300 hover:border-black rounded-xl py-3 text-sm font-semibold text-gray-500 hover:text-black transition-colors">
                  <Upload size={15} /> Upload Image from Device
                </button>
                <p className="text-xs text-gray-400 text-center mt-1">or paste URL below</p>
                <input type="text"
                  value={bannerForm.image.startsWith("data:") ? "" : bannerForm.image}
                  onChange={(e) => setBannerForm({ ...bannerForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black mt-2" />
                {bannerForm.image && (
                  <div className="mt-2 h-16 rounded-xl overflow-hidden border border-gray-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={bannerForm.image} alt="preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <button onClick={handleBannerSave} className="w-full bg-black text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 transition-colors">
                Save Hero Banner
              </button>
            </div>
          </div>

          {/* Live Preview */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-black">Live Preview</h2>
              <p className="text-xs text-gray-400 mt-0.5">This is how it looks on the homepage</p>
            </div>
            <div className="p-4">
              <div className="relative h-72 rounded-xl overflow-hidden bg-black">
                {bannerForm.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={bannerForm.image} alt="preview" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                )}
                <div className="relative z-10 p-6 flex flex-col justify-center h-full">
                  <span className="inline-block bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full mb-3 w-fit">
                    {bannerForm.badge || "Badge Text"}
                  </span>
                  <h3 className="text-white font-black text-2xl leading-tight">
                    {bannerForm.heading || "HEADING"}<br />
                    <span className="text-yellow-400">{bannerForm.highlight || "HIGHLIGHT"}</span>
                  </h3>
                  <p className="text-gray-300 text-xs mt-2 max-w-xs line-clamp-2">{bannerForm.subtext}</p>
                  <div className="mt-4">
                    <span className="bg-yellow-400 text-black text-xs font-bold px-4 py-2 rounded-full">
                      {bannerForm.ctaLabel || "Button"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── PROMO BANNER ── */}
      {activePreview === "promo" && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-black">Promo Banner Settings</h2>
              {promoSaved && (
                <span className="flex items-center gap-1.5 text-green-600 text-sm font-semibold">
                  <CheckCircle size={15} /> Saved!
                </span>
              )}
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5">Badge Text</label>
                <input type="text" value={promoForm.badge} onChange={(e) => setPromoForm({ ...promoForm, badge: e.target.value })}
                  placeholder="Limited Edition"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Heading</label>
                <input type="text" value={promoForm.heading} onChange={(e) => setPromoForm({ ...promoForm, heading: e.target.value })}
                  placeholder="New Drop Alert 🔥"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Subtext</label>
                <textarea value={promoForm.subtext} onChange={(e) => setPromoForm({ ...promoForm, subtext: e.target.value })}
                  placeholder="Exclusive graphic tees dropping this week..." rows={2}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Button Label</label>
                  <input type="text" value={promoForm.ctaLabel} onChange={(e) => setPromoForm({ ...promoForm, ctaLabel: e.target.value })}
                    placeholder="Shop Now"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Button Link</label>
                  <input type="text" value={promoForm.ctaLink} onChange={(e) => setPromoForm({ ...promoForm, ctaLink: e.target.value })}
                    placeholder="/shop?category=graphic"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black" />
                </div>
              </div>
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold mb-1.5">Background Image</label>
                <input ref={promoBannerFileRef} type="file" accept="image/*" className="hidden" onChange={handlePromoImageUpload} />
                <button type="button" onClick={() => promoBannerFileRef.current?.click()}
                  className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-gray-300 hover:border-black rounded-xl py-3 text-sm font-semibold text-gray-500 hover:text-black transition-colors">
                  <Upload size={15} /> Upload Image from Device
                </button>
                <p className="text-xs text-gray-400 text-center mt-1">or paste URL below</p>
                <input type="text"
                  value={promoForm.image.startsWith("data:") ? "" : promoForm.image}
                  onChange={(e) => setPromoForm({ ...promoForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black mt-2" />
                {promoForm.image && (
                  <div className="mt-2 h-16 rounded-xl overflow-hidden border border-gray-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={promoForm.image} alt="preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <button onClick={handlePromoSave} className="w-full bg-black text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 transition-colors">
                Save Promo Banner
              </button>
            </div>
          </div>

          {/* Live Preview */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-black">Live Preview</h2>
              <p className="text-xs text-gray-400 mt-0.5">Mid-page promotional banner</p>
            </div>
            <div className="p-4">
              <div className="relative h-56 rounded-xl overflow-hidden bg-black">
                {promoForm.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={promoForm.image} alt="preview" className="absolute inset-0 w-full h-full object-cover opacity-30" />
                )}
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
                  <span className="text-yellow-400 text-xs font-bold uppercase tracking-widest">{promoForm.badge || "Badge"}</span>
                  <h3 className="text-white font-black text-2xl mt-2">{promoForm.heading || "Heading"}</h3>
                  <p className="text-gray-300 text-xs mt-2 max-w-xs line-clamp-2">{promoForm.subtext}</p>
                  <span className="mt-4 bg-yellow-400 text-black text-xs font-bold px-4 py-2 rounded-full">{promoForm.ctaLabel || "Button"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
