"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiShoppingCart, FiHeart, FiEye } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

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
  const hasDiscount = product.discount && product.discount > 0;
  const discountedPrice = hasDiscount ? product.price - (product.price * product.discount! / 100) : product.price;
  const isFavorite = isInWishlist(product._id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    alert(language === "ar" ? "تمت الإضافة إلى السلة بنجاح!" : "Added to cart successfully!");
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-white dark:bg-white/5 rounded-3xl overflow-hidden border border-gray-100 dark:border-white/10 hover:shadow-2xl transition-all duration-500 relative z-10"
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden z-0">
        <img
          src={product.images[0]}
          alt={language === "ar" ? product.title.ar : product.title.en}
          className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className={`absolute top-4 ${language === 'ar' ? 'right-4' : 'left-4'} flex flex-col gap-2 z-10`}>
          {hasDiscount && (
            <span className="bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full text-center">
              -{product.discount}%
            </span>
          )}
          <span className="bg-secondary text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase text-center">
            {product.category}
          </span>
        </div>

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-dark/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 z-20">
          <button 
            type="button"
            onClick={handleAddToWishlist}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer relative z-30 ${isFavorite ? 'bg-primary text-white' : 'bg-white text-dark hover:bg-primary hover:text-white'}`}
          >
            <FiHeart className={isFavorite ? 'fill-current' : ''} />
          </button>
          <Link href={`/products/${product._id}`} className="w-10 h-10 rounded-full bg-white text-dark flex items-center justify-center hover:bg-secondary hover:text-white transition-colors relative z-30">
            <FiEye />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 relative z-10">
        <h3 className="text-lg font-bold mb-2 line-clamp-1 group-hover:text-primary transition-colors">
          {language === "ar" ? product.title.ar : product.title.en}
        </h3>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-gray-400 text-xs line-through">
                {product.price} {language === "ar" ? "ج.م" : "EGP"}
              </span>
            )}
            <span className="text-xl font-black text-primary">
              {discountedPrice.toFixed(0)} {language === "ar" ? "ج.م" : "EGP"}
            </span>
          </div>
          
          <button 
            type="button"
            onClick={handleAddToCart}
            className="p-3 bg-secondary text-white rounded-xl hover:bg-primary transition-colors shadow-lg shadow-secondary/20 cursor-pointer relative z-30"
          >
            <FiShoppingCart />
          </button>
        </div>
      </div>
    </motion.div>
  );
};


export default ProductCard;

