"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FiBookOpen, FiCalendar, FiUser, FiSearch, FiArrowRight, FiTag } from "react-icons/fi";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function BlogListing() {
  const { language } = useLanguage();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const t = {
    title: language === "ar" ? "مدونة معرض الشتاء والصيف" : "Winter & Summer Official Blog",
    subtitle: language === "ar" ? "دليلك الشامل لاختيار الأجهزة المنزلية، نصائح الصيانة، وأحدث عروض التكييفات برعاية محمد محمد وهبه" : "Your ultimate guide for choosing home appliances, maintenance tips and exclusive offers co-authored by Mohamed Wahba",
    searchPlaceholder: language === "ar" ? "ابحث عن مقالات، نصائح..." : "Search articles, advice...",
    readMore: language === "ar" ? "اقرأ المقال بالكامل" : "Read Full Article",
    loadingText: language === "ar" ? "جاري تحميل المقالات..." : "Synchronizing articles...",
    noPosts: language === "ar" ? "لا توجد مقالات تطابق بحثك حالياً." : "No articles found matching your query.",
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/blog");
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Default seed posts in case database has no posts yet (perfect for instant SEO bootstrap!)
  const seedPosts = [
    {
      _id: "seed-1",
      titleAr: "كيفية اختيار التكييف المناسب لمساحة غرفتك وكيف توفر الكهرباء؟",
      titleEn: "How to Choose the Right AC Unit for Your Room & Save Electricity?",
      slug: "how-to-choose-the-right-ac-unit-save-electricity",
      excerptAr: "دليل شامل يساعدك على حساب القدرة الحصانية المناسبة للتكييف وتجنب استهلاك الكهرباء الزائد في الصيف.",
      excerptEn: "Comprehensive guide to calculate the exact horsepower needed for your room and optimize summer utility bills.",
      coverImage: "https://images.unsplash.com/photo-1631542171261-267866385732?q=80&w=600&auto=format&fit=crop",
      author: "محمد محمد وهبه (Mohamed Wahba)",
      tags: ["تكييفات", "نصائح"],
      createdAt: new Date().toISOString()
    },
    {
      _id: "seed-2",
      titleAr: "أفضل أنواع الثلاجات المنزلية لعام 2026: مميزات وعيوب كل نوع",
      titleEn: "Best Home Refrigerators in 2026: Pros & Cons of Top Brands",
      slug: "best-home-refrigerators-2026-pros-cons",
      excerptAr: "نستعرض أفضل الثلاجات الذكية وتقنيات النوفرست والمساحات التخزينية المناسبة للعائلات الكبيرة والصغيرة.",
      excerptEn: "Reviewing the top smart refrigerators, No-Frost technologies and the best storage designs for big families.",
      coverImage: "https://images.unsplash.com/photo-1571175432247-fe03a594c6a2?q=80&w=600&auto=format&fit=crop",
      author: "محمد محمد وهبه (Mohamed Wahba)",
      tags: ["ثلاجات", "أجهزة مطبخ"],
      createdAt: new Date().toISOString()
    },
    {
      _id: "seed-3",
      titleAr: "لماذا تعتبر الغسالات الفوق أتوماتيك الخيار الأفضل للأسرة المصرية؟",
      titleEn: "Why Top-Load Washing Machines Are the Smartest Choice for Families?",
      slug: "why-top-load-washing-machines-smartest-choice",
      excerptAr: "مقارنة كاملة بين الغسالات الفوق أتوماتيك والتحميل الأمامي من حيث التكلفة، استهلاك المسحوق، وسهولة الاستخدام.",
      excerptEn: "Full breakdown comparing top-load and front-load washing machines in terms of cost, detergent usage and ease.",
      coverImage: "https://images.unsplash.com/photo-1545173168-9f1947eebb7f?q=80&w=600&auto=format&fit=crop",
      author: "محمد محمد وهبه (Mohamed Wahba)",
      tags: ["غسالات", "أدوات منزلية"],
      createdAt: new Date().toISOString()
    }
  ];

  const activePosts = posts.length > 0 ? posts : seedPosts;

  const filteredPosts = activePosts.filter(p => {
    const title = language === "ar" ? p.titleAr : p.titleEn;
    const excerpt = language === "ar" ? p.excerptAr : p.excerptEn;
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag ? p.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  const allTags = Array.from(new Set(activePosts.flatMap(p => p.tags)));

  return (
    <main className="min-h-screen bg-white dark:bg-[#0A0A0A] text-gray-900 dark:text-white transition-colors duration-500 font-cairo">
      {/* Dynamic JSON-LD SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": t.title,
            "description": t.subtitle,
            "url": "https://wintersummer.com/blog",
            "publisher": {
              "@type": "Organization",
              "name": "معرض الشتاء والصيف",
              "logo": {
                "@type": "ImageObject",
                "url": "https://wintersummer.com/Logo-removebg-preview.png"
              },
              "founder": {
                "@type": "Person",
                "name": "محمد محمد وهبه (Mohamed Wahba)"
              }
            }
          })
        }}
      />

      <Navbar />

      {/* Hero Header */}
      <section className="relative py-20 md:py-32 bg-gray-50/50 dark:bg-white/[0.01] border-b border-gray-100 dark:border-white/5">
        <div className="container mx-auto px-4 md:px-8 text-center max-w-4xl space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-black uppercase tracking-wider"
          >
            <FiBookOpen /> {language === "ar" ? "مدونة الأجهزة المنزلية" : "Appliances Expert Hub"}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-6xl font-black tracking-tight"
          >
            {t.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm md:text-lg text-gray-500 max-w-2xl mx-auto font-bold leading-relaxed"
          >
            {t.subtitle}
          </motion.p>

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="relative w-full max-w-md mx-auto group mt-8"
          >
            <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl pl-12 pr-6 py-4 font-bold outline-none focus:border-primary transition-all shadow-xl"
            />
          </motion.div>

          {/* Tag filters */}
          {allTags.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-2 pt-4"
            >
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  selectedTag === null
                    ? "gradient-primary text-white shadow-lg shadow-primary/20"
                    : "bg-white dark:bg-white/5 text-gray-500 hover:bg-gray-100"
                }`}
              >
                {language === "ar" ? "الكل" : "All"}
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                    selectedTag === tag
                      ? "gradient-primary text-white shadow-lg shadow-primary/20"
                      : "bg-white dark:bg-white/5 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <FiTag /> {tag}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Grid Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8">
          {loading ? (
            <div className="text-center py-20 font-black text-gray-400 animate-pulse uppercase tracking-widest text-sm">
              {t.loadingText}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20 font-bold text-gray-400">
              {t.noPosts}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white dark:bg-white/[0.01] border border-gray-100 dark:border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 flex flex-col group"
                >
                  {/* Cover Image */}
                  <div className="aspect-[16/10] w-full overflow-hidden relative">
                    <img
                      src={post.coverImage}
                      alt={language === "ar" ? post.titleAr : post.titleEn}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    
                    {/* Excerpt/Tag badges */}
                    <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                      {post.tags?.map((t: string) => (
                        <span key={t} className="bg-primary/80 backdrop-blur-md text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-md">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 text-[10px] text-gray-400 font-bold">
                        <span className="flex items-center gap-1">
                          <FiUser /> {post.author || "محمد محمد وهبه"}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiCalendar /> {new Date(post.createdAt).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US")}
                        </span>
                      </div>
                      <h2 className="text-lg md:text-xl font-black text-gray-900 dark:text-white leading-snug group-hover:text-primary transition-colors">
                        {language === "ar" ? post.titleAr : post.titleEn}
                      </h2>
                      <p className="text-xs text-gray-500 font-bold line-clamp-3 leading-relaxed">
                        {language === "ar" ? post.excerptAr : post.excerptEn}
                      </p>
                    </div>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest hover:underline pt-4 border-t border-gray-100 dark:border-white/5 w-full justify-between"
                    >
                      {t.readMore} <FiArrowRight className="group-hover:translate-x-1.5 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
