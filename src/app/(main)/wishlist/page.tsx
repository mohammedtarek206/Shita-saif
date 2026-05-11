"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useLanguage } from "@/context/LanguageContext";
import { useWishlist } from "@/context/WishlistContext";

export default function WishlistPage() {
  const { language } = useLanguage();
  const { wishlist } = useWishlist();

  return (
    <main className="min-h-screen pt-28">
      <Navbar />
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-black mb-12">{language === "ar" ? "قائمة الأمنيات" : "My Wishlist"}</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {wishlist.length > 0 ? (
            wishlist.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div className="lg:col-span-4 text-center py-20 glass rounded-[3rem] border-white/20">
              <p className="text-gray-500 text-xl">{language === "ar" ? "قائمة الأمنيات فارغة حالياً" : "Your wishlist is currently empty"}</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
