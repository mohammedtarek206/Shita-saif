"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";

export default function PartnersPage() {
  const { language } = useLanguage();
  const [partners, setPartners] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await fetch("/api/admin/partners");
        const data = await res.json();
        if (Array.isArray(data)) {
          setPartners(data);
        }
      } catch (err) {
        console.error("Error fetching partners:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, []);

  return (
    <main className="min-h-screen pt-28">
      <Navbar />
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black mb-4">{language === "ar" ? "شركاؤنا" : "Our Partners"}</h1>
          <p className="text-gray-500 text-xl">{language === "ar" ? "نفخر بشراكاتنا مع أكبر العلامات التجارية العالمية" : "We are proud of our partnerships with the biggest global brands"}</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="h-[300px] bg-gray-100 dark:bg-white/5 rounded-[3rem] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
            {partners.length > 0 ? (
              partners.map((partner, i) => (
                <div key={`item-${i}`} className="glass p-8 rounded-[3rem] text-center border-white/20 hover:scale-105 transition-transform">
                  <div className="h-32 flex items-center justify-center mb-6">
                    <img src={partner.logo} alt={partner.name} className="max-w-full max-h-full object-contain" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{partner.name}</h3>
                  {partner.desc && (
                    <p className="text-gray-500 text-sm">
                      {language === "ar" ? partner.desc.ar : partner.desc.en}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 opacity-50 font-bold">
                {language === "ar" ? "لا يوجد شركاء حالياً" : "No partners found"}
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
