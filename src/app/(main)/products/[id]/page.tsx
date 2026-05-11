"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FiShoppingCart, FiHeart, FiShield, FiTruck, FiRefreshCw, FiCheck } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";

import ProductCard from "@/components/ProductCard";

export default function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [inWishlist, setInWishlist] = useState(false);
  const [cartToast, setCartToast] = useState(false);
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const router = useRouter();

  React.useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/admin/products/${id}`);
        const data = await res.json();
        if (data && !data.error) {
          setProduct(data);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">{language === "ar" ? "المنتج غير موجود" : "Product not found"}</h1>
      <button onClick={() => router.push("/products")} className="text-primary font-bold">
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
    setTimeout(() => setCartToast(false), 2500);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  const handleWishlist = () => {
    setInWishlist(!inWishlist);
  };

  return (
    <main className="min-h-screen pt-28">
      <Navbar />

      <AnimatePresence>
        {cartToast && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-28 left-1/2 -translate-x-1/2 z-[100] bg-green-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold"
          >
            <FiCheck className="text-xl" />
            {language === "ar" ? "تمت الإضافة إلى السلة!" : "Added to cart successfully!"}
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Image Gallery */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-square glass rounded-[3rem] overflow-hidden p-8 flex items-center justify-center border-white/20 relative"
            >
              <div className={`absolute top-8 ${language === 'ar' ? 'right-8' : 'left-8'} flex flex-col gap-2 z-10`}>
                <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">-{product.discount}%</span>
                <span className="bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full uppercase">{product.category}</span>
              </div>
              <img 
                src={product.images[selectedImage]} 
                alt="Product" 
                className="max-w-full max-h-full object-contain hover:scale-110 transition-transform duration-500"
              />
            </motion.div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map((img: string, i: number) => (
                <button 
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-24 h-24 rounded-2xl glass p-2 flex-shrink-0 border-2 transition-all ${
                    selectedImage === i ? "border-primary" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="Thumb" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl md:text-5xl font-black mb-2 leading-tight">
                {language === "ar" ? product.title.ar : product.title.en}
              </h1>
              <p className="text-gray-400 font-bold mb-6">{product.brand} - {product._id}</p>
              
              <div className="flex flex-col gap-2 mb-8">
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-black text-primary">
                    {discountedPrice.toFixed(0)} {language === "ar" ? "ج.م" : "EGP"}
                  </span>
                  {product.discount > 0 && (
                    <span className="text-2xl text-gray-400 line-through">
                      {product.price} {language === "ar" ? "ج.م" : "EGP"}
                    </span>
                  )}
                </div>
                <div className="text-green-500 font-bold flex items-center gap-2">
                  <FiCheck /> {language === "ar" ? "حالة التوفر: متوفر في المخزون" : "Availability: In Stock"}
                </div>
              </div>

              {/* Specs Table */}
              {product.specs && (
                <div className="border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden mb-8">
                  <table className="w-full text-right rtl:text-right ltr:text-left">
                    <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                      {(language === "ar" ? product.specs.ar : product.specs.en)?.map((spec: any, i: number) => (
                        <tr key={i} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 font-bold bg-gray-50/50 dark:bg-white/2 w-1/3">{spec.key}</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center gap-4 p-2 bg-gray-100 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center font-bold hover:text-primary transition-colors text-xl"
                  >-</button>
                  <span className="w-8 text-center font-black text-xl">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center font-bold hover:text-primary transition-colors text-xl"
                  >+</button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 w-full py-5 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 text-lg"
                >
                  <FiShoppingCart className="text-2xl" />
                  {language === "ar" ? "إضافة إلى السلة" : "Add to Cart"}
                </button>
              </div>
              <button 
                onClick={handleBuyNow}
                className="w-full py-5 bg-secondary text-white rounded-2xl font-bold shadow-xl shadow-secondary/20 hover:scale-[1.02] transition-all text-lg uppercase tracking-widest"
              >
                {language === "ar" ? "اشترِ الآن" : "Buy Now"}
              </button>
            </div>

            {/* Delivery Info */}
            <div className="p-6 bg-green-50 dark:bg-green-500/5 border border-green-200 dark:border-green-500/20 rounded-3xl flex items-center gap-4">
              <FiTruck className="text-3xl text-green-500" />
              <div>
                <p className="font-bold text-green-700 dark:text-green-400">
                  {language === "ar" ? "طلبك يوصل في خلال" : "Your order will arrive in"} Fri 2026/05/15
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <section className="border-t border-gray-100 dark:border-white/10 pt-20">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-black">{language === "ar" ? "منتجات مشابهة" : "Related Products"}</h2>
            <div className="h-[2px] flex-1 bg-gray-100 dark:bg-white/10 mx-8 hidden md:block" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {/* You can fetch related products here later */}
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
