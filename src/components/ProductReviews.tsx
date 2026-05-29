"use client";

import React, { useState, useEffect } from "react";
import { FiStar, FiUser, FiSend } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useSession } from "next-auth/react";

interface Review {
  _id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ProductReviews({ productId }: { productId: string }) {
  const { language } = useLanguage();
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [form, setForm] = useState({ rating: 0, comment: "" });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?product=${productId}`);
      const data = await res.json();
      if (Array.isArray(data)) setReviews(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, [productId]);

  const avgRating = reviews.length > 0 ? reviews.reduce((a, b) => a + b.rating, 0) / reviews.length : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map(r => ({
    rating: r,
    count: reviews.filter(rev => rev.rating === r).length,
    pct: reviews.length > 0 ? (reviews.filter(rev => rev.rating === r).length / reviews.length) * 100 : 0
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) { setError(language === "ar" ? "يجب تسجيل الدخول أولاً" : "Please login first"); return; }
    if (form.rating === 0) { setError(language === "ar" ? "اختر تقييماً" : "Please select a rating"); return; }
    if (!form.comment.trim()) { setError(language === "ar" ? "اكتب تعليقاً" : "Please write a comment"); return; }

    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: productId,
          user: (session.user as any)?.id || session.user?.email,
          userName: session.user?.name || "Anonymous",
          rating: form.rating,
          comment: form.comment,
        }),
      });
      if (res.ok) {
        setSuccess(true);
        setForm({ rating: 0, comment: "" });
        fetchReviews();
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const data = await res.json();
        setError(data.error === "Already reviewed"
          ? (language === "ar" ? "لقد قمت بتقييم هذا المنتج مسبقاً" : "You already reviewed this product")
          : (language === "ar" ? "حدث خطأ، حاول مرة أخرى" : "An error occurred, try again")
        );
      }
    } catch (e) {
      setError(language === "ar" ? "خطأ في الاتصال" : "Connection error");
    } finally {
      setSubmitting(false);
    }
  };

  const t = {
    title: language === "ar" ? "التقييمات والمراجعات" : "Reviews & Ratings",
    writeReview: language === "ar" ? "اكتب مراجعتك" : "Write a Review",
    yourRating: language === "ar" ? "تقييمك" : "Your Rating",
    yourComment: language === "ar" ? "تعليقك" : "Your Comment",
    commentPlaceholder: language === "ar" ? "شاركنا تجربتك مع هذا المنتج..." : "Share your experience with this product...",
    submit: language === "ar" ? "إرسال التقييم" : "Submit Review",
    noReviews: language === "ar" ? "لا توجد مراجعات بعد. كن أول من يقيم!" : "No reviews yet. Be the first to review!",
    basedOn: language === "ar" ? "بناءً على" : "Based on",
    reviewsText: language === "ar" ? "مراجعة" : "reviews",
    loginRequired: language === "ar" ? "سجل دخولك لتتمكن من التقييم" : "Login to leave a review",
  };

  return (
    <section className="mt-20 pt-20 border-t border-gray-100 dark:border-white/10">
      <div className="flex items-center gap-6 mb-12">
        <h2 className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter">{t.title}</h2>
        <div className="flex-1 h-px bg-gray-100 dark:bg-white/10" />
        {reviews.length > 0 && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-3xl font-black text-gray-900 dark:text-white">{avgRating.toFixed(1)}</span>
            <div className="flex text-yellow-400">
              {[1,2,3,4,5].map(s => (
                <FiStar key={s} className={s <= Math.round(avgRating) ? "fill-current" : ""} />
              ))}
            </div>
            <span className="text-gray-500 text-sm font-bold">({reviews.length} {t.reviewsText})</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Rating Summary */}
        {reviews.length > 0 && (
          <div className="space-y-3">
            {ratingCounts.map(({ rating, count, pct }) => (
              <div key={rating} className="flex items-center gap-3">
                <span className="text-sm font-black w-4 text-gray-700 dark:text-gray-300">{rating}</span>
                <FiStar className="text-yellow-400 fill-current shrink-0" />
                <div className="flex-1 h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="h-full bg-yellow-400 rounded-full"
                  />
                </div>
                <span className="text-xs font-bold text-gray-500 w-6">{count}</span>
              </div>
            ))}
          </div>
        )}

        {/* Reviews List */}
        <div className={`space-y-6 ${reviews.length > 0 ? "lg:col-span-2" : "lg:col-span-3"}`}>
          {loading ? (
            <div className="space-y-4">
              {[1,2].map(n => <div key={n} className="h-24 bg-gray-100 dark:bg-white/5 rounded-3xl animate-pulse" />)}
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 dark:bg-white/5 rounded-3xl border-2 border-dashed border-gray-200 dark:border-white/10">
              <FiStar className="text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 font-bold">{t.noReviews}</p>
            </div>
          ) : (
            <AnimatePresence>
              {reviews.map((review, i) => (
                <motion.div
                  key={(review as any)?._id || (review as any)?.id || (review as any)?.slug || (review as any)?.name || (review as any)?.title?.en || (review as any)?.title?.ar || JSON.stringify(review).substring(0, 20)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white dark:bg-white/[0.03] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-black text-lg">
                        {review.userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-black text-sm">{review.userName}</p>
                        <p className="text-gray-400 text-[10px] font-bold">
                          {new Date(review.createdAt).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US", { year: "numeric", month: "long", day: "numeric" })}
                        </p>
                      </div>
                    </div>
                    <div className="flex text-yellow-400">
                      {[1,2,3,4,5].map(s => (
                        <FiStar key={s} size={14} className={s <= review.rating ? "fill-current" : "text-gray-200 dark:text-gray-700"} />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 font-bold text-sm leading-relaxed">{review.comment}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Write Review Form */}
      <div className="mt-12 bg-gray-50 dark:bg-white/[0.02] rounded-[2.5rem] p-8 border border-gray-100 dark:border-white/5">
        <h3 className="text-xl font-black italic uppercase tracking-tight mb-6">{t.writeReview}</h3>
        {!session ? (
          <div className="text-center py-8 text-gray-500 font-bold">{t.loginRequired}</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Star Selector */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3">{t.yourRating}</label>
              <div className="flex gap-2">
                {[1,2,3,4,5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setForm({ ...form, rating: star })}
                    className="text-3xl transition-transform hover:scale-125"
                  >
                    <FiStar className={(hoverRating || form.rating) >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-200 dark:text-gray-700"} />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3">{t.yourComment}</label>
              <textarea
                rows={4}
                placeholder={t.commentPlaceholder}
                value={form.comment}
                onChange={e => setForm({ ...form, comment: e.target.value })}
                className="w-full px-6 py-4 bg-white dark:bg-[#0A0A0A] border border-gray-100 dark:border-white/10 focus:border-primary rounded-2xl outline-none font-bold text-sm resize-none text-gray-900 dark:text-white transition-all"
              />
            </div>

            {error && <p className="text-red-500 font-bold text-sm">{error}</p>}
            {success && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-500 font-black text-sm">
                ✓ {language === "ar" ? "تم إرسال تقييمك بنجاح!" : "Review submitted successfully!"}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-3 px-10 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <FiSend />
              )}
              {t.submit}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
