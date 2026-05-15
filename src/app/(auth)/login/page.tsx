"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FiMail, FiLock, FiArrowRight, FiShield } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { useLanguage } from "@/context/LanguageContext";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });

    if (result?.error) {
      setError(language === "ar" ? "بيانات الدخول غير صحيحة" : "Invalid credentials. Please try again.");
      setLoading(false);
    } else {
      window.location.href = "/";
    }
  };

  const t = {
    title: language === "ar" ? "مرحباً بك مجدداً" : "Welcome Back",
    subtitle: language === "ar" ? "سجل دخولك للوصول إلى عالم من التميز" : "Sign in to access a world of excellence",
    email: language === "ar" ? "البريد الإلكتروني" : "Email Address",
    password: language === "ar" ? "كلمة المرور" : "Password",
    forgot: language === "ar" ? "نسيت كلمة المرور؟" : "Forgot password?",
    signIn: language === "ar" ? "دخول آمن" : "Secure Sign In",
    or: language === "ar" ? "أو المتابعة بواسطة" : "Or continue with",
    noAccount: language === "ar" ? "ليس لديك حساب؟" : "Don't have an account?",
    create: language === "ar" ? "إنشاء حساب جديد" : "Create an account",
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] relative overflow-hidden p-4">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-secondary/10 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl relative z-10"
      >
        <div className="text-center mb-12">
          <Link href="/" className="inline-block group mb-8">
            <motion.img 
              whileHover={{ scale: 1.1, rotate: 5 }}
              src="/Logo-removebg-preview.png" 
              alt="Logo" 
              className="w-24 h-24 md:w-32 md:h-32 mx-auto drop-shadow-[0_0_30px_rgba(255,20,147,0.3)]" 
            />
          </Link>
          <h1 className="text-4xl md:text-6xl font-black mb-4 italic uppercase tracking-tighter text-white">
            {t.title}
          </h1>
          <p className="text-gray-500 font-bold text-lg md:text-xl">
            {t.subtitle}
          </p>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-3xl p-8 md:p-12 rounded-[4rem] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">{t.email}</label>
              <div className="relative group">
                <FiMail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors text-xl" />
                <input 
                  type="email" 
                  required
                  placeholder="name@premium.com" 
                  className="w-full pl-16 pr-6 py-5 bg-white/5 border border-white/5 focus:border-primary/50 rounded-3xl outline-none transition-all text-white font-bold"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between ml-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400">{t.password}</label>
                <Link href="/forgot-password" className="text-xs text-primary font-black uppercase tracking-tighter hover:opacity-80">
                  {t.forgot}
                </Link>
              </div>
              <div className="relative group">
                <FiLock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors text-xl" />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••" 
                  className="w-full pl-16 pr-6 py-5 bg-white/5 border border-white/5 focus:border-primary/50 rounded-3xl outline-none transition-all text-white font-bold"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-red-500/10 border border-red-500/20 text-red-500 p-5 rounded-3xl text-sm font-black text-center italic">
                {error}
              </motion.div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-6 bg-primary text-white rounded-3xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:opacity-50 text-sm italic"
            >
              {loading ? (
                <div className="w-7 h-7 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <FiShield className="text-xl" />
                  {t.signIn}
                  <FiArrowRight className={language === "ar" ? "rotate-180" : ""} />
                </>
              )}
            </button>
          </form>

          {/* Luxury Divider */}
          <div className="relative my-12">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#0A0A0A] px-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
                {t.or}
              </span>
            </div>
          </div>

          <button 
            type="button"
            onClick={() => signIn("google")}
            className="w-full py-5 bg-white/5 border border-white/5 rounded-3xl font-black uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-white/10 transition-all text-white group"
          >
            <FcGoogle className="text-2xl group-hover:scale-110 transition-transform" />
            <span className="text-xs">{language === "ar" ? "المتابعة بواسطة Google" : "Continue with Google"}</span>
          </button>
        </div>

        <p className="text-center mt-12 text-gray-500 font-bold">
          {t.noAccount}{" "}
          <Link href="/register" className="text-primary font-black uppercase tracking-tighter hover:underline decoration-2 underline-offset-4 ml-2">
            {t.create}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
