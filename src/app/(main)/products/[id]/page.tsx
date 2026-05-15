"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FiShoppingCart, FiHeart, FiShield, FiTruck, FiRefreshCw, FiCheck, FiZap, FiInfo, FiTag } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export default function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [cartToast, setCartToast] = useState(false);
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/admin/products/${id}`);
        const data = await res.json();
        if (data && !data.error) setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0A0A0A]">
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center"
      >
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </motion.div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-white dark:bg-[#0A0A0A]">
      <div className="text-8xl text-gray-200"><FiInfo /></div>
      <h1 className="text-3xl font-black italic uppercase tracking-tighter">
        {language === "ar" ? "المنتج غير موجود" : "Product not found"}
      </h1>
      <button onClick={() => router.push("/products")} className="px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest shadow-xl">
        {language === "ar" ? "العودة للمنتجات" : "Back to products"}
      </button>
    </div>
  );

  const discountedPrice = product.discount ? product.price - (product.price * product.discount / 100) : product.price;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        _id: product._id,
        title: product.title,
        price: product.price,
        discount: product.discount,
        images: product.images,
        category: product.category,
      });
    }
    setCartToast(true);
    setTimeout(() => setCartToast(false), 3000);
  };

  const isProductInWishlist = isInWishlist(product._id);

  return (
    <main className="min-h-screen bg-white dark:bg-[#0A0A0A] transition-colors duration-500">
      <Navbar />

      <AnimatePresence>
        {cartToast && (
          <motion.div
            initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 100 }}
            className="fixed top-32 right-8 z-[200] bg-white dark:bg-black p-6 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-primary/20 flex items-center gap-5"
          >
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center text-2xl">
              <FiCheck />
            </div>
            <div>
              <p className="font-black italic uppercase tracking-tight text-sm">
                {language === "ar" ? "تمت الإضافة!" : "Success!"}
              </p>
              <p className="text-xs text-gray-500 font-bold">
                {language === "ar" ? "المنتج متاح الآن في سلتك" : "Product added to your cart"}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="container mx-auto px-4 md:px-8 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Visual Showcase */}
          <div className="space-y-8 sticky top-32">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="aspect-square relative bg-gray-50 dark:bg-white/[0.03] rounded-[4rem] overflow-hidden group border border-gray-100 dark:border-white/5"
            >
              <img 
                src={product.images[selectedImage]} 
                alt="Product" 
                className="w-full h-full object-contain p-12 transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Floating Badges */}
              <div className="absolute top-10 left-10 flex flex-col gap-3">
                {product.discount > 0 && (
                  <div className="px-5 py-2 bg-primary text-white rounded-full font-black text-sm italic shadow-2xl">
                    -{product.discount}%
                  </div>
                )}
                <div className="px-5 py-2 bg-white dark:bg-black rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl">
                  {product.category}
                </div>
              </div>
              
              <button 
                onClick={() => isProductInWishlist ? removeFromWishlist(product._id) : addToWishlist(product)}
                className={cn(
                  "absolute top-10 right-10 p-5 rounded-full shadow-2xl transition-all hover:scale-110",
                  isProductInWishlist ? "bg-primary text-white" : "bg-white dark:bg-black text-gray-400"
                )}
              >
                <FiHeart className={cn("text-2xl", isProductInWishlist && "fill-current")} />
              </button>
            </motion.div>
            
            <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
              {product.images.map((img: string, i: number) => (
                <button 
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    "w-24 h-24 rounded-3xl bg-gray-50 dark:bg-white/5 p-4 flex-shrink-0 transition-all border-2",
                    selectedImage === i ? "border-primary scale-105" : "border-transparent opacity-60"
                  )}
                >
                  <img src={img} alt="Thumb" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* Detailed Info */}
          <div className="space-y-12">
            <div>
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-4 block italic">
                Verified Premium Appliance
              </motion.span>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-black mb-4 italic uppercase tracking-tighter leading-tight">
                {language === "ar" ? product.title.ar : product.title.en}
              </motion.h1>
              <div className="flex items-center gap-4 mb-10">
                <div className="flex items-center gap-1 text-yellow-400">
                  {[1, 2, 3, 4, 5].map(s => <FiStar key={s} className="fill-current" />)}
                </div>
                <span className="text-gray-400 font-bold text-sm uppercase tracking-widest">5.0 | {product.brand}</span>
              </div>
              
              <div className="flex flex-col gap-2 mb-10">
                <div className="flex items-end gap-6">
                  <span className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900 dark:text-white">
                    {discountedPrice.toLocaleString()} <span className="text-2xl italic font-bold text-primary">{language === "ar" ? "ج.م" : "EGP"}</span>
                  </span>
                  {product.discount > 0 && (
                    <span className="text-2xl md:text-3xl text-gray-400 line-through font-bold italic mb-2">
                      {product.price.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Technical Specifications */}
              {product.specs && (
                <div className="bg-gray-50 dark:bg-white/[0.02] rounded-[3rem] p-8 border border-gray-100 dark:border-white/5">
                  <div className="flex items-center gap-3 mb-6">
                    <FiZap className="text-primary text-xl" />
                    <h3 className="font-black uppercase tracking-widest text-xs italic">Technical Highlights</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(language === "ar" ? product.specs.ar : product.specs.en)?.slice(0, 4).map((spec: any, i: number) => (
                      <div key={i} className="flex flex-col gap-1">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{spec.key}</span>
                        <span className="font-bold text-sm">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions Section */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-stretch gap-4">
                <div className="flex items-center gap-6 px-6 py-4 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-2xl font-black hover:text-primary transition-colors"
                  >-</button>
                  <span className="text-2xl font-black tabular-nums min-w-[2ch] text-center">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-2xl font-black hover:text-primary transition-colors"
                  >+</button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 py-6 bg-gray-900 dark:bg-white text-white dark:text-black rounded-3xl font-black uppercase tracking-widest hover:bg-primary dark:hover:bg-primary dark:hover:text-white transition-all shadow-2xl flex items-center justify-center gap-4 group"
                >
                  <FiShoppingCart className="text-2xl group-hover:rotate-12 transition-transform" />
                  {language === "ar" ? "أضف للسلة" : "Acquire Now"}
                </button>
              </div>
              <button 
                onClick={() => { handleAddToCart(); router.push("/checkout"); }}
                className="w-full py-6 bg-primary text-white rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-primary/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 italic"
              >
                <FiZap /> {language === "ar" ? "شراء سريع" : "Express Checkout"}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <FiTruck />, t: language === "ar" ? "شحن سريع" : "Express Delivery", d: "Within 48 hours" },
                { icon: <FiShield />, t: language === "ar" ? "ضمان عامين" : "2 Year Warranty", d: "Full coverage" },
                { icon: <FiRefreshCw />, t: language === "ar" ? "إرجاع سهل" : "Easy Returns", d: "14 day policy" },
                { icon: <FiTag />, t: language === "ar" ? "سعر تنافسي" : "Best Price", d: "Price matched" },
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-4 p-5 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5">
                  <div className="text-2xl text-primary">{badge.icon}</div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest">{badge.t}</h4>
                    <p className="text-[10px] text-gray-500 font-bold">{badge.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Full Specifications Overlay */}
        <section className="mt-32 pt-20 border-t border-gray-100 dark:border-white/10">
          <div className="flex items-center gap-6 mb-16">
            <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter">Full Specifications</h2>
            <div className="flex-1 h-px bg-gray-100 dark:bg-white/10" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {(language === "ar" ? product.specs.ar : product.specs.en)?.map((spec: any, i: number) => (
              <div key={i} className="group border-b border-gray-50 dark:border-white/5 pb-4">
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2 block italic">{spec.key}</span>
                <span className="text-lg font-bold group-hover:translate-x-2 transition-transform inline-block">{spec.value}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
