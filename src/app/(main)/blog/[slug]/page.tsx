"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FiBookOpen, FiCalendar, FiUser, FiArrowLeft, FiTag, FiClock } from "react-icons/fi";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function BlogPostReader() {
  const { slug } = useParams();
  const router = useRouter();
  const { language } = useLanguage();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fallback seed data in case post is still being fetched or not yet in database
  const seedPosts: { [key: string]: any } = {
    "how-to-choose-the-right-ac-unit-save-electricity": {
      titleAr: "كيفية اختيار التكييف المناسب لمساحة غرفتك وكيف توفر الكهرباء؟",
      titleEn: "How to Choose the Right AC Unit for Your Room & Save Electricity?",
      slug: "how-to-choose-the-right-ac-unit-save-electricity",
      excerptAr: "دليل شامل يساعدك على حساب القدرة الحصانية المناسبة للتكييف وتجنب استهلاك الكهرباء الزائد في الصيف.",
      excerptEn: "Comprehensive guide to calculate the exact horsepower needed for your room and optimize summer utility bills.",
      contentAr: `تعتبر تكييفات الهواء من الأجهزة الأساسية في المنازل المصرية خلال فصل الصيف، ولكن اختيار الجهاز الخاطئ قد يتسبب في استهلاك طاقة هائل وفواتير كهرباء مرتفعة للغاية. برعاية رئيس مجلس الإدارة الأستاذ محمد محمد وهبه، يقدم لكم خبراء معرض الشتاء والصيف هذا الدليل الكامل.

      أولاً: حساب مساحة الغرفة والقدرة الحصانية:
      - مساحة حتى 12 متر مربع: تحتاج تكييف بقوة 1.5 حصان.
      - مساحة من 13 إلى 18 متر مربع: تحتاج تكييف بقوة 2.25 حصان.
      - مساحة من 19 إلى 24 متر مربع: تحتاج تكييف بقوة 3 حصان.
      - مساحة أكبر من ذلك: يفضل استشارة الفني لاختيار أجهزة بقدرات أكبر مثل 4 أو 5 حصان لضمان التبريد الفعال.

      ثانياً: نصائح ذهبية لتقليل استهلاك الكهرباء:
      1. اضبط التكييف على درجة حرارة 24 أو 25 مئوية. هذه هي الدرجة المثالية والمريحة للجسم والصديقة للمحرك (الضاغط).
      2. تأكد من إغلاق النوافذ والأبواب بالكامل لمنع تسرب الهواء البارد ودخول الحرارة الخارجية.
      3. قم بتنظيف فلاتر التكييف مرة كل أسبوعين على الأقل، حيث أن الفلاتر المتسخة تزيد الحمل على المحرك وتستهلك كهرباء بنسبة 15% إضافية.
      4. احرص على تفعيل وضع النوم المريح (Sleep Mode) عند النوم لتقليل الجهد والكهرباء تلقائياً.`,
      contentEn: `Air conditioning is one of the most critical home appliances during the hot summer months. However, choosing the wrong capacity can lead to huge power consumption and astronomical utility bills. Sponsored by our founder Mohamed Mohamed Wahba, the experts at Winter & Summer Store bring you this complete guide.

      First: Room Space to Horsepower Calculation:
      - Up to 12 sqm: Requires 1.5 HP AC.
      - From 13 to 18 sqm: Requires 2.25 HP AC.
      - From 19 to 24 sqm: Requires 3.0 HP AC.
      - Over 24 sqm: Consult our expert technicians to calculate larger capacities or multi-split options.

      Second: Golden Tips to Save Electricity:
      1. Set the AC to 24°C or 25°C. This is the optimal temperature for human comfort and saves massive compressor wear and energy.
      2. Keep doors and windows tightly sealed during AC operations to prevent cooling loss.
      3. Clean dust filters once every two weeks to prevent extra airflow load and keep compressor speed efficient.
      4. Activate the Sleep Mode before sleeping to scale down the fan speed and save up to 20% on nightly energy bills.`,
      coverImage: "https://images.unsplash.com/photo-1631542171261-267866385732?q=80&w=1200&auto=format&fit=crop",
      author: "محمد محمد وهبه (Mohamed Wahba)",
      tags: ["تكييفات", "نصائح"],
      createdAt: new Date().toISOString()
    },
    "best-home-refrigerators-2026-pros-cons": {
      titleAr: "أفضل أنواع الثلاجات المنزلية لعام 2026: مميزات وعيوب كل نوع",
      titleEn: "Best Home Refrigerators in 2026: Pros & Cons of Top Brands",
      slug: "best-home-refrigerators-2026-pros-cons",
      excerptAr: "نستعرض أفضل الثلاجات الذكية وتقنيات النوفرست والمساحات التخزينية المناسبة للعائلات الكبيرة والصغيرة.",
      excerptEn: "Reviewing the top smart refrigerators, No-Frost technologies and the best storage designs for big families.",
      contentAr: `تعد الثلاجة العمود الفقري لكل مطبخ عصري. في عام 2026، تطورت تقنيات التبريد لتشمل أنظمة الحفاظ على رطوبة الخضروات، التحكم باللمس والإنفرتر لتوفير استهلاك الكهرباء. 

      يقدم لكم الأستاذ محمد وهبه هذه المقارنة بين أشهر العلامات التجارية المتوفرة في معرض الشتاء والصيف:
      
      1. ثلاجات شارب (Sharp):
      - المميزات: تقنية البلازما كلاستر لمنع الروائح، متانة فائقة وعمر افتراضي طويل جداً.
      - العيوب: سعرها مرتفع نسبياً مقارنة ببعض البدائل.
      
      2. ثلاجات بيكو (Beko):
      - المميزات: تصميمات أوروبية ممتازة، كفاءة طاقة عالية وتكنولوجيا ثلاثية للتبريد النشط.
      - العيوب: مراكز الصيانة تحتاج مزيداً من الانتشار.
      
      3. ثلاجات إل جي (LG):
      - المميزات: موفرة جداً للكهرباء بتقنية الـ Linear Inverter، تصميمات زجاجية ممتازة وشاشات ذكية.
      - العيوب: أسعار قطع الغيار مرتفعة.`,
      contentEn: `The refrigerator is the true centerpiece of any modern kitchen. In 2026, cooling technology has advanced tremendously, integrating smart touch screens, Inverter compressors for quiet operations, and moisture-controlled crispers.

      Presented by Mr. Mohamed Wahba, here is a detailed comparison of the best refrigerator brands available at Winter & Summer Exhibition:

      1. Sharp Refrigerators:
      - Pros: PlasmaCluster technology to prevent mold and odors, superb durability, and a highly reliable warranty.
      - Cons: Slightly premium pricing.

      2. Beko Refrigerators:
      - Pros: Modern European designs, outstanding energy efficiency ratings, and active multi-zone cooling.
      - Cons: Customer service network is still expanding in some local Egyptian cities.

      3. LG Refrigerators:
      - Pros: Incredibly silent Linear Inverter compressors, elegant double-door styling, and durable glass shelves.
      - Cons: High replacement part costs.`,
      coverImage: "https://images.unsplash.com/photo-1571175432247-fe03a594c6a2?q=80&w=1200&auto=format&fit=crop",
      author: "محمد محمد وهبه (Mohamed Wahba)",
      tags: ["ثلاجات", "أجهزة مطبخ"],
      createdAt: new Date().toISOString()
    }
  };

  useEffect(() => {
    if (!slug) return;
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/blog/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setPost(data);
        } else {
          // If not in database, fallback to seed
          if (seedPosts[slug as string]) {
            setPost(seedPosts[slug as string]);
          }
        }
      } catch (err) {
        console.error(err);
        if (seedPosts[slug as string]) {
          setPost(seedPosts[slug as string]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A0A0A] flex items-center justify-center font-cairo">
        <div className="text-center font-black text-gray-400 animate-pulse text-sm">
          {language === "ar" ? "جاري تحميل المقال..." : "Retrieving full article..."}
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A0A0A] flex items-center justify-center font-cairo">
        <div className="text-center space-y-4">
          <p className="font-bold text-gray-400">
            {language === "ar" ? "المقال غير موجود حالياً" : "Article not found"}
          </p>
          <Link href="/blog" className="text-primary font-black uppercase text-xs tracking-widest hover:underline">
            {language === "ar" ? "العودة للمدونة" : "Return to Hub"}
          </Link>
        </div>
      </div>
    );
  }

  const title = language === "ar" ? post.titleAr : post.titleEn;
  const content = language === "ar" ? post.contentAr : post.contentEn;
  const excerpt = language === "ar" ? post.excerptAr : post.excerptEn;

  return (
    <main className="min-h-screen bg-white dark:bg-[#0A0A0A] text-gray-900 dark:text-white transition-colors duration-500 font-cairo">
      
      {/* 1. Dynamic JSON-LD Article Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            "headline": title,
            "description": excerpt,
            "image": [post.coverImage],
            "datePublished": post.createdAt,
            "dateModified": post.updatedAt || post.createdAt,
            "author": {
              "@type": "Person",
              "name": "محمد محمد وهبه (Mohamed Wahba)",
              "url": "https://wintersummer.com/about"
            },
            "publisher": {
              "@type": "Organization",
              "name": "معرض الشتاء والصيف",
              "logo": {
                "@type": "ImageObject",
                "url": "https://wintersummer.com/Logo-removebg-preview.png"
              }
            }
          })
        }}
      />

      {/* 2. Breadcrumb Structured Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": language === "ar" ? "الرئيسية" : "Home",
                "item": "https://wintersummer.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": language === "ar" ? "المدونة" : "Blog",
                "item": "https://wintersummer.com/blog"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": title,
                "item": `https://wintersummer.com/blog/${post.slug}`
              }
            ]
          })
        }}
      />

      <Navbar />

      {/* Article Header & Image */}
      <article className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-24 space-y-8">
        
        {/* Back Link */}
        <Link 
          href="/blog"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-primary font-black text-xs uppercase tracking-widest transition-colors"
        >
          <FiArrowLeft /> {language === "ar" ? "العودة للمدونة" : "Back to Blog Hub"}
        </Link>

        {/* Title & Metadata */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {post.tags?.map((t: string) => (
              <span key={t} className="px-3 py-1 bg-primary/10 text-primary text-xs font-black uppercase rounded-lg">
                {t}
              </span>
            ))}
          </div>
          <h1 className="text-3xl md:text-6xl font-black tracking-tight leading-tight">
            {title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-xs text-gray-400 font-bold pt-2 border-b border-gray-100 dark:border-white/5 pb-6">
            <span className="flex items-center gap-2">
              <FiUser className="text-primary text-base" /> {post.author || "محمد محمد وهبه"}
            </span>
            <span className="flex items-center gap-2">
              <FiCalendar className="text-primary text-base" /> {new Date(post.createdAt).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US")}
            </span>
            <span className="flex items-center gap-2">
              <FiClock className="text-primary text-base" /> 5 {language === "ar" ? "دقائق قراءة" : "min read"}
            </span>
          </div>
        </div>

        {/* Hero Cover Image */}
        <div className="aspect-[21/10] w-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-100 dark:border-white/5">
          <img 
            src={post.coverImage} 
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none pt-4">
          <div className="text-gray-700 dark:text-gray-300 font-bold leading-[2.1] text-base md:text-lg whitespace-pre-line space-y-6">
            {content}
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}
