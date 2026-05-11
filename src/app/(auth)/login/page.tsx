"use client";

import React from "react";
import Link from "next/link";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { useLanguage } from "@/context/LanguageContext";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const { language } = useLanguage();
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

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
      setError(language === "ar" ? "بيانات الدخول غير صحيحة" : "Invalid email or password");
      setLoading(false);
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-xl">
              S
            </div>
          </Link>
          <h1 className="text-3xl font-black mb-2">
            {language === "ar" ? "مرحباً بك مجدداً" : "Welcome Back"}
          </h1>
          <p className="text-gray-500">
            {language === "ar" ? "قم بتسجيل الدخول للوصول إلى حسابك" : "Sign in to access your account"}
          </p>
        </div>

        <div className="glass p-8 rounded-[2.5rem] border-white/20 shadow-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-bold ml-2">{language === "ar" ? "البريد الإلكتروني" : "Email Address"}</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="email" 
                  required
                  placeholder="name@example.com" 
                  className="w-full pl-12 pr-4 py-4 bg-gray-100 dark:bg-white/5 border border-transparent focus:border-primary rounded-2xl outline-none transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-2">
                <label className="text-sm font-bold">{language === "ar" ? "كلمة المرور" : "Password"}</label>
                <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                  {language === "ar" ? "نسيت كلمة المرور؟" : "Forgot password?"}
                </Link>
              </div>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••" 
                  className="w-full pl-12 pr-4 py-4 bg-gray-100 dark:bg-white/5 border border-transparent focus:border-primary rounded-2xl outline-none transition-all"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-sm font-bold text-center">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {language === "ar" ? "تسجيل الدخول" : "Sign In"}
                  <FiArrowRight className={language === "ar" ? "rotate-180" : ""} />
                </>
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-dark px-2 text-gray-500">{language === "ar" ? "أو" : "Or continue with"}</span>
            </div>
          </div>

          <button 
            type="button"
            onClick={() => signIn("google")}
            className="w-full py-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-50 dark:hover:bg-white/10 transition-all"
          >
            <FcGoogle className="text-xl" />
            <span>Google</span>
          </button>
        </div>


        <p className="text-center mt-8 text-gray-500">
          {language === "ar" ? "ليس لديك حساب؟" : "Don't have an account?"}{" "}
          <Link href="/register" className="text-primary font-bold hover:underline">
            {language === "ar" ? "إنشاء حساب جديد" : "Create an account"}
          </Link>
        </p>
      </div>
    </div>
  );
}
