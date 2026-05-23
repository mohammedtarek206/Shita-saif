"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiShoppingCart, FiHeart, FiEye, FiRepeat } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCompare } from "@/context/CompareContext";

import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: {
    _id: string;
    title: { ar: string; en: string };
    price: number;
    discount?: number;
    images: string[];
    category: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const { addToCompare, removeFromCompare, isInCompare, compareList } = useCompare();
  const router = useRouter();
  const hasDiscount = product.discount && product.discount > 0;
  const discountedPrice = hasDiscount ? product.price - (product.price * product.discount! / 100) : product.price;
  const isFavorite = isInWishlist(product._id);
  const inCompare = isInCompare(product._id);
  const compareMaxed = compareList.length >= 3 && !inCompare;

  // Calculate lowest possible installment (assuming 36 months)
  const lowestInstallment = Math.ceil((discountedPrice * 1.15) / 36);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorite) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const getSEOLink = (p: any) => {
    const slug = p.title?.en
      ? p.title.en.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
      : "product";
    return `/products/${slug}-${p._id}`;
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(getSEOLink(product));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group bg-white dark:bg-white/[0.03] rounded-2xl sm:rounded-[2rem] overflow-hidden border border-gray-100 dark:border-white/10 shadow-md hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_rgba(255,255,255,0.04)] transition-all flex flex-col h-full relative"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50/50 dark:bg-white/[0.02]">
        <Link href={getSEOLink(product)} className="block w-full h-full">
          <img
            src={product.images[0]}
            alt={language === "ar" ? product.title.ar : product.title.en}
            className="w-full h-full object-contain p-3 sm:p-6 group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-700 ease-out"
            loading="lazy"
          />
        </Link>
        
        {/* Badges */}
        <div className={cn(
          "absolute top-4 flex flex-col gap-2 z-10",
          language === 'ar' ? 'right-4' : 'left-4'
        )}>
          {hasDiscount && (
            <span className="bg-primary text-white text-[10px] md:text-xs font-black px-3 py-1 rounded-full shadow-lg">
              -{product.discount}%
            </span>
          )}
          <span className="bg-white/80 dark:bg-black/80 backdrop-blur-md text-gray-800 dark:text-gray-200 text-[10px] font-black px-3 py-1 rounded-full border border-gray-200 dark:border-white/10 uppercase">
            {product.category}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 lg:translate-y-4 lg:group-hover:translate-y-0 transition-all duration-300 z-30">
          <button 
            onClick={handleAddToWishlist}
            className={cn(
              "w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center transition-all shadow-xl backdrop-blur-md",
              isFavorite 
                ? "bg-primary text-white" 
                : "bg-white/90 dark:bg-black/90 text-gray-800 dark:text-white hover:bg-primary hover:text-white"
            )}
          >
            <FiHeart className={isFavorite ? 'fill-current' : ''} size={18} />
          </button>
          <button 
            onClick={handleViewDetails}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/90 dark:bg-black/90 text-gray-800 dark:text-white flex items-center justify-center hover:bg-secondary hover:text-white transition-all shadow-xl backdrop-blur-md"
          >
            <FiEye size={15} className="sm:hidden" />
            <FiEye size={18} className="hidden sm:block" />
          </button>
          <button
            onClick={e => { e.preventDefault(); e.stopPropagation(); inCompare ? removeFromCompare(product._id) : addToCompare({ ...product, discount: product.discount ?? 0 }); }}
            disabled={compareMaxed}
            title={compareMaxed ? (language === "ar" ? "الحد الأقصى 3 منتجات" : "Max 3 products") : (inCompare ? (language === "ar" ? "إزالة من المقارنة" : "Remove from compare") : (language === "ar" ? "إضافة للمقارنة" : "Add to compare"))}
            className={cn(
              "w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center transition-all shadow-xl backdrop-blur-md",
              inCompare
                ? "bg-blue-500 text-white"
                : compareMaxed
                  ? "bg-white/50 dark:bg-black/50 text-gray-300 cursor-not-allowed"
                  : "bg-white/90 dark:bg-black/90 text-gray-800 dark:text-white hover:bg-blue-500 hover:text-white"
            )}
          >
            <FiRepeat size={15} className="sm:hidden" />
            <FiRepeat size={18} className="hidden sm:block" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 md:p-5 flex flex-col flex-1">
        <Link href={getSEOLink(product)} className="mb-2">
          <h3 className="text-xs sm:text-sm md:text-base font-black line-clamp-2 hover:text-primary transition-colors leading-tight min-h-[2.2rem] sm:min-h-[2.5rem] md:min-h-[3rem]">
            {language === "ar" ? product.title.ar : product.title.en}
          </h3>
        </Link>
        
        <div className="mb-3">
          <div className="inline-flex items-center gap-1.5 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 px-2 py-1 rounded-lg">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-primary">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-[10px] md:text-xs font-bold text-gray-600 dark:text-gray-300">
              {language === "ar" ? "قسط بـ " : "Install from "}
              <span className="text-primary font-black">{lowestInstallment} {language === "ar" ? "ج.م" : "EGP"}</span>
              {language === "ar" ? " / شهر" : " / mo"}
            </span>
          </div>
        </div>
        
        <div className="mt-auto flex flex-col gap-4">
          <div className="flex items-baseline gap-2">
            <span className="text-base sm:text-lg md:text-2xl font-black text-primary">
              {discountedPrice.toLocaleString()} <span className="text-[10px] md:text-xs">{language === "ar" ? "ج.م" : "EGP"}</span>
            </span>
            {hasDiscount && (
              <span className="text-gray-400 text-xs md:text-sm line-through decoration-primary/50">
                {product.price.toLocaleString()}
              </span>
            )}
          </div>
          
          <button 
            onClick={handleAddToCart}
            className="w-full py-2.5 sm:py-3 bg-secondary text-white rounded-xl sm:rounded-2xl font-black flex items-center justify-center gap-1.5 sm:gap-2 hover:bg-primary transition-all shadow-lg shadow-secondary/20 hover:shadow-primary/40 active:scale-95 group/btn text-xs sm:text-sm"
          >
            <FiShoppingCart className="group-hover/btn:rotate-12 transition-transform" />
            <span className="text-xs md:text-sm">{language === 'ar' ? 'أضف للسلة' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}

export default ProductCard;

