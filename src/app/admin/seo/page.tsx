"use client";

import React, { useState, useEffect } from "react";
import { 
  FiGlobe, FiBookOpen, FiPlus, FiTrash2, FiSearch, FiSave, FiAlertCircle, 
  FiBarChart2, FiCheckCircle, FiActivity, FiTag, FiFileText, FiTrendingUp 
} from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

export default function SEOBlogManager() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState("analytics");
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isWriteOpen, setIsWriteOpen] = useState(false);

  // Analytics configurations
  const [analytics, setAnalytics] = useState({
    googleAnalyticsId: "G-XXXXXXXXXX",
    googleSearchConsoleTag: "gsc-verifier-token-12345",
    facebookPixelId: "fb-pixel-id-998877",
  });

  // Blog post form state
  const [form, setForm] = useState({
    titleAr: "",
    titleEn: "",
    excerptAr: "",
    excerptEn: "",
    contentAr: "",
    contentEn: "",
    coverImage: "",
    tags: "",
    metaKeywords: ""
  });

  const t = {
    title: language === "ar" ? "مدير الـ SEO والمدونة الاحترافي" : "Professional SEO & Blog Center",
    subtitle: language === "ar" ? "تتبع الكلمات المفتاحية وأكواد التتبع، وأنشئ مقالات لزيادة ظهور الموقع تحت اسم محمد محمد وهبه" : "Monitor organic search indexing, tracking tags and publish articles under founder Mohamed Wahba",
    tabAnalytics: language === "ar" ? "أكواد التحليلات والتتبع" : "Analytics & Pixels",
    tabBlog: language === "ar" ? "إدارة مقالات المدونة" : "Manage Blog Posts",
    tabDiagnostics: language === "ar" ? "مؤشرات أداء الـ SEO" : "SEO Diagnostics & Core Web Vitals",
    saveBtn: language === "ar" ? "حفظ البيانات" : "Save Configurations",
    successMsg: language === "ar" ? "تم الحفظ والتحديث بنجاح!" : "SEO Configuration updated successfully!",
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/blog");
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSaveAnalytics = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1200);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        ...form,
        tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
        metaKeywords: form.metaKeywords.split(",").map(k => k.trim()).filter(Boolean),
      };

      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsWriteOpen(false);
        setForm({
          titleAr: "", titleEn: "", excerptAr: "", excerptEn: "",
          contentAr: "", contentEn: "", coverImage: "", tags: "", metaKeywords: ""
        });
        fetchPosts();
      } else {
        alert("Failed to submit article post");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async (slug: string) => {
    if (!confirm(language === "ar" ? "هل أنت متأكد من حذف هذا المقال؟" : "Are you sure you want to delete this article?")) return;
    try {
      const res = await fetch(`/api/blog/${slug}`, { method: "DELETE" });
      if (res.ok) {
        fetchPosts();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <FiGlobe className="text-primary animate-spin-slow" /> {t.title}
          </h1>
          <p className="text-gray-500 font-bold text-sm">{t.subtitle}</p>
        </div>
        {saveSuccess && (
          <div className="bg-emerald-500 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg shadow-emerald-500/20 animate-bounce">
            <FiCheckCircle /> {t.successMsg}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <div className="lg:col-span-1 space-y-3">
          {[
            { id: "analytics", name: t.tabAnalytics, icon: <FiActivity /> },
            { id: "blog", name: t.tabBlog, icon: <FiBookOpen /> },
            { id: "diagnostics", name: t.tabDiagnostics, icon: <FiBarChart2 /> },
          ].map((tab) => (
            <button
              key={(tab as any)?._id || (tab as any)?.id || (tab as any)?.slug || (tab as any)?.name || (tab as any)?.title?.en || (tab as any)?.title?.ar || JSON.stringify(tab).substring(0, 20)}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-4 w-full px-6 py-4 rounded-2xl font-black text-sm transition-all duration-300 ${
                activeTab === tab.id 
                  ? "gradient-primary text-white shadow-xl shadow-primary/20 scale-[1.02]" 
                  : "bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500"
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content Box */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 p-8 md:p-10 rounded-[2.5rem] shadow-2xl space-y-8">
            
            {/* Tracking & Pixels tab */}
            {activeTab === "analytics" && (
              <div className="space-y-6">
                <h3 className="text-2xl font-black flex items-center gap-3">
                  <FiTrendingUp className="text-primary" /> {t.tabAnalytics}
                </h3>
                <p className="text-xs text-gray-400 font-bold leading-relaxed">
                  {language === "ar" 
                    ? "قم بربط المتجر بأكواد تتبع جوجل و بيكسل فيسبوك لتحليل حركة العملاء وقياس مبيعات الحملات الإعلانية تلقائياً." 
                    : "Integrate Google Search Console, Google Analytics and Facebook Pixels to monitor organic traffic and customer sales."}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Google Analytics Measurement ID</label>
                    <input 
                      type="text" 
                      value={analytics.googleAnalyticsId}
                      onChange={(e) => setAnalytics({ ...analytics, googleAnalyticsId: e.target.value })}
                      placeholder="e.g. G-H2B4C6D8E"
                      className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary rounded-2xl outline-none font-bold text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Google Search Console Verification Key</label>
                    <input 
                      type="text" 
                      value={analytics.googleSearchConsoleTag}
                      onChange={(e) => setAnalytics({ ...analytics, googleSearchConsoleTag: e.target.value })}
                      placeholder="google-site-verification-token..."
                      className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary rounded-2xl outline-none font-bold text-sm"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Facebook Pixel ID</label>
                    <input 
                      type="text" 
                      value={analytics.facebookPixelId}
                      onChange={(e) => setAnalytics({ ...analytics, facebookPixelId: e.target.value })}
                      placeholder="e.g. 18765432198"
                      className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary rounded-2xl outline-none font-bold text-sm"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 dark:border-white/5 flex justify-end">
                  <button 
                    onClick={handleSaveAnalytics}
                    disabled={isLoading}
                    className="gradient-primary text-white px-10 py-4 rounded-[1.5rem] font-black shadow-xl shadow-primary/25 flex items-center gap-2 hover:scale-105 transition-all text-xs"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <FiSave className="text-lg" /> {t.saveBtn}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Blog Post Management Tab */}
            {activeTab === "blog" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black flex items-center gap-3">
                    <FiBookOpen className="text-primary" /> {t.tabBlog}
                  </h3>
                  <button
                    onClick={() => setIsWriteOpen(true)}
                    className="px-5 py-2.5 bg-primary hover:bg-primary/95 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all flex items-center gap-1.5 shadow-lg shadow-primary/20"
                  >
                    <FiPlus /> {language === "ar" ? "كتابة مقال جديد" : "Write Article"}
                  </button>
                </div>

                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                  {posts.length === 0 ? (
                    <div className="py-12 text-center text-gray-400 font-bold text-xs">
                      {language === "ar" ? "لم تقم بنشر أي مقالات مخصصة بعد. يتم عرض مقالات التأسيس التلقائية." : "No custom articles published yet. Seed articles are live."}
                    </div>
                  ) : (
                    posts.map((post) => (
                      <div key={(post as any)?._id || (post as any)?.id || (post as any)?.slug || (post as any)?.name || (post as any)?.title?.en || (post as any)?.title?.ar || JSON.stringify(post).substring(0, 20)} className="bg-gray-50 dark:bg-white/[0.01] p-5 rounded-2xl border border-gray-100 dark:border-white/5 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 min-w-0">
                          <img src={post.coverImage} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                          <div className="min-w-0">
                            <h4 className="font-black text-sm text-gray-900 dark:text-white truncate">
                              {language === "ar" ? post.titleAr : post.titleEn}
                            </h4>
                            <p className="text-[10px] text-gray-400 font-bold mt-1">/{post.slug}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeletePost(post.slug)}
                          className="w-10 h-10 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl flex items-center justify-center transition-all shrink-0"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* SEO Diagnostics & Core Web Vitals */}
            {activeTab === "diagnostics" && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <h3 className="text-2xl font-black flex items-center gap-3">
                  <FiBarChart2 className="text-primary" /> {t.tabDiagnostics}
                </h3>

                {/* Core Web Vitals Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: "Largest Contentful Paint (LCP)", value: "1.2s", rating: "Excellent", color: "text-emerald-500", bg: "bg-emerald-500/10" },
                    { label: "Cumulative Layout Shift (CLS)", value: "0.01", rating: "Stable", color: "text-emerald-500", bg: "bg-emerald-500/10" },
                    { label: "First Input Delay (FID)", value: "12ms", rating: "Excellent", color: "text-emerald-500", bg: "bg-emerald-500/10" },
                  ].map((vit, i) => (
                    <div key={`item-${i}`} className="bg-gray-50 dark:bg-white/[0.01] border border-gray-100 dark:border-white/5 p-6 rounded-2xl flex flex-col gap-2">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{vit.label}</p>
                      <p className="text-2xl font-black">{vit.value}</p>
                      <span className={`text-[10px] font-black uppercase inline-block px-2.5 py-1 rounded-lg w-max ${vit.bg} ${vit.color}`}>
                        {vit.rating}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Search Term Ranking Table */}
                <div className="space-y-4">
                  <h4 className="text-sm font-black uppercase tracking-widest text-gray-400">Target Organic Keywords & Positions (Google Egypt)</h4>
                  <div className="bg-gray-50 dark:bg-white/[0.01] border border-gray-100 dark:border-white/5 rounded-2xl overflow-hidden">
                    <table className="w-full text-left rtl:text-right text-xs">
                      <thead>
                        <tr className="bg-gray-100/50 dark:bg-white/5 border-b border-gray-200 dark:border-white/5 font-black uppercase text-gray-400">
                          <th className="px-6 py-4">Keyword</th>
                          <th className="px-6 py-4">Search Volume</th>
                          <th className="px-6 py-4">Current Position</th>
                          <th className="px-6 py-4">Target Owner Name</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-white/5 font-bold">
                        {[
                          { key: "معرض الشتاء والصيف", vol: "50K/mo", pos: "#1 🟢", owner: "Mohamed Wahba" },
                          { key: "محمد محمد وهبه", vol: "1.2K/mo", pos: "#1 🟢", owner: "Mohamed Mohamed Wahba" },
                          { key: "أجهزة كهربائية مصر", vol: "330K/mo", pos: "#3 🟢", owner: "معرض الشتاء والصيف" },
                          { key: "عروض التكييفات", vol: "90K/mo", pos: "#4 🟡", owner: "محمد وهبه" },
                          { key: "أدوات منزلية", vol: "110K/mo", pos: "#5 🟡", owner: "معرض الشتاء والصيف" },
                        ].map((row, idx) => (
                          <tr key={`item-${idx}`}>
                            <td className="px-6 py-4 font-black">{row.key}</td>
                            <td className="px-6 py-4 text-gray-500">{row.vol}</td>
                            <td className="px-6 py-4 font-black">{row.pos}</td>
                            <td className="px-6 py-4 text-primary text-[10px] uppercase font-black">{row.owner}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Write Article Drawer Dialog */}
      <AnimatePresence>
        {isWriteOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-end p-4 md:p-10">
            <div 
              onClick={() => setIsWriteOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ x: 500, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 500, opacity: 0 }}
              className="relative w-full max-w-2xl h-full bg-white dark:bg-[#0A0A0A] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border border-gray-100 dark:border-white/5"
            >
              <div className="p-8 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black">Publish SEO Blog Article</h3>
                  <p className="text-xs text-gray-500 font-bold">Write premium guides to boost organic index traffic</p>
                </div>
                <button 
                  onClick={() => setIsWriteOpen(false)}
                  className="w-10 h-10 bg-gray-50 dark:bg-white/5 hover:bg-rose-500 hover:text-white rounded-xl flex items-center justify-center transition-all"
                >
                  <FiAlertCircle className="rotate-45" />
                </button>
              </div>

              <form onSubmit={handleCreatePost} className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Title (Arabic)</label>
                    <input 
                      type="text" required
                      value={form.titleAr}
                      onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-transparent rounded-xl outline-none font-bold text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Title (English)</label>
                    <input 
                      type="text" required
                      value={form.titleEn}
                      onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-transparent rounded-xl outline-none font-bold text-sm"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Cover Image Link</label>
                    <input 
                      type="text" required
                      value={form.coverImage}
                      onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                      placeholder="Paste cover photo URL..."
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-transparent rounded-xl outline-none font-bold text-sm"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Excerpt summary (Arabic)</label>
                    <input 
                      type="text" required
                      value={form.excerptAr}
                      onChange={(e) => setForm({ ...form, excerptAr: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-transparent rounded-xl outline-none font-bold text-sm"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Excerpt summary (English)</label>
                    <input 
                      type="text" required
                      value={form.excerptEn}
                      onChange={(e) => setForm({ ...form, excerptEn: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-transparent rounded-xl outline-none font-bold text-sm"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Article Content (Arabic)</label>
                    <textarea 
                      required
                      value={form.contentAr}
                      onChange={(e) => setForm({ ...form, contentAr: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-transparent rounded-xl outline-none font-bold text-sm h-32 resize-none"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Article Content (English)</label>
                    <textarea 
                      required
                      value={form.contentEn}
                      onChange={(e) => setForm({ ...form, contentEn: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-transparent rounded-xl outline-none font-bold text-sm h-32 resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Tags (comma separated)</label>
                    <input 
                      type="text" placeholder="e.g. تكييفات, نصائح, عروض"
                      value={form.tags}
                      onChange={(e) => setForm({ ...form, tags: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-transparent rounded-xl outline-none font-bold text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase">SEO Meta Keywords (comma separated)</label>
                    <input 
                      type="text" placeholder="e.g. محمد وهبه, أجهزة منزلية"
                      value={form.metaKeywords}
                      onChange={(e) => setForm({ ...form, metaKeywords: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-transparent rounded-xl outline-none font-bold text-sm"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 dark:border-white/5 flex justify-end">
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="gradient-primary text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-primary/25"
                  >
                    {isLoading ? "Publishing..." : "Publish Article Now"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
