"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Language = "ar" | "en";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>("ar");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as Language;
    if (savedLang) {
      applyLanguage(savedLang);
    } else {
      applyLanguage("ar");
    }
    setMounted(true);
  }, []);

  const applyLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("lang", lang);
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    
    // Update font class on body
    if (lang === "ar") {
      document.body.classList.remove("font-poppins");
      document.body.classList.add("font-cairo");
      document.body.style.fontFamily = "var(--font-cairo), sans-serif";
    } else {
      document.body.classList.remove("font-cairo");
      document.body.classList.add("font-poppins");
      document.body.style.fontFamily = "var(--font-poppins), sans-serif";
    }
  };

  const setLanguage = (lang: Language) => {
    applyLanguage(lang);
  };

  const toggleLanguage = () => {
    const newLang = language === "ar" ? "en" : "ar";
    applyLanguage(newLang);
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage }}>
      {!mounted ? (
        <div style={{ visibility: "hidden" }}>{children}</div>
      ) : (
        <div className={language === "ar" ? "font-cairo" : "font-poppins"} dir={language === "ar" ? "rtl" : "ltr"}>
          {children}
        </div>
      )}
    </LanguageContext.Provider>
  );
};


export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

