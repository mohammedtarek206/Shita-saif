import type { Metadata } from "next";
import { Cairo, Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import AuthProvider from "@/providers/AuthProvider";
import WhatsAppButton from "@/components/WhatsAppButton";
import { RecentlyViewedProvider } from "@/context/RecentlyViewedContext";
import { CompareProvider } from "@/context/CompareContext";
import CompareBar from "@/components/CompareBar";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "معرض الشتاء والصيف | أفضل معرض أجهزة كهربائية وأدوات منزلية",
  description: "اكتشف أفضل عروض الأجهزة الكهربائية والمنزلية من معرض الشتاء والصيف بأفضل الأسعار والجودة في مصر. تأسس تحت إشراف الأستاذ محمد محمد وهبه (Mohamed Wahba).",
  keywords: [
    "معرض الشتاء والصيف",
    "الشتاء والصيف",
    "معرض أجهزة كهربائية",
    "أجهزة كهربائية",
    "أدوات منزلية",
    "عروض الأجهزة الكهربائية",
    "أفضل معرض أجهزة كهربائية",
    "أجهزة منزلية في مصر",
    "أسعار الأجهزة الكهربائية",
    "عروض الشاشات",
    "عروض الغسالات",
    "عروض الثلاجات",
    "تكييفات",
    "بوتاجازات",
    "أجهزة المطبخ",
    "محمد محمد وهبه",
    "Mohamed Mohamed Wahba",
    "Mohamed Wahba",
    "محمد وهبه",
    "محمد طارق",
    "Mohamed Tarek",
    "مطور الشتاء والصيف",
    "Winter Summer Developer",
    "Winter and Summer",
    "Winter & Summer Store",
    "Home Appliances",
    "Electrical Appliances",
    "Electronics Store",
    "Kitchen Appliances",
    "Best Electronics Store"
  ],
  authors: [
    { name: "محمد محمد وهبه (Mohamed Wahba)", url: "https://elshetawelsaif.com/about" },
    { name: "محمد طارق (Mohamed Tarek)", url: "https://elshetawelsaif.com" }
  ],
  creator: "محمد محمد وهبه (Mohamed Wahba) & محمد طارق (Mohamed Tarek)",
  publisher: "معرض الشتاء والصيف",
  alternates: {
    canonical: "https://elshetawelsaif.com",
    languages: {
      "ar-EG": "https://elshetawelsaif.com",
      "en-US": "https://elshetawelsaif.com/en",
    },
  },
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: "https://elshetawelsaif.com",
    siteName: "معرض الشتاء والصيف",
    title: "معرض الشتاء والصيف | أفضل معرض أجهزة كهربائية وأدوات منزلية",
    description: "أفضل عروض الأجهزة الكهربائية والمنزلية من معرض الشتاء والصيف بأفضل الأسعار والجودة في مصر. تأسس تحت إشراف الأستاذ محمد محمد وهبه (Mohamed Wahba).",
    images: [
      {
        url: "https://elshetawelsaif.com/Logo-removebg-preview.png",
        width: 800,
        height: 800,
        alt: "معرض الشتاء والصيف - محمد محمد وهبه",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "معرض الشتاء والصيف | أجهزة كهربائية وأدوات منزلية",
    description: "أفضل عروض الأجهزة الكهربائية والمنزلية من معرض الشتاء والصيف بأفضل الأسعار والجودة في مصر.",
    images: ["https://elshetawelsaif.com/Logo-removebg-preview.png"],
  },
  icons: {
    icon: "/Logo-removebg-preview.png",
    apple: "/Logo-removebg-preview.png",
  },
  verification: {
    google: "0u4uZXTMCMvpnDisJOP8FnppCswNksQ5w7BqHXlYH0Q",
  },
};

import StoreEffectsWrapper from "@/components/StoreEffectsWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${cairo.variable} ${poppins.variable} min-h-screen font-cairo`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              "name": "معرض الشتاء والصيف للأجهزة الكهربائية",
              "url": "https://elshetawelsaif.com",
              "logo": "https://elshetawelsaif.com/Logo-removebg-preview.png",
              "description": "معرض الشتاء والصيف للأجهزة الكهربائية والمنزلية. جودة عالية وأفضل الأسعار.",
              "founder": {
                "@type": "Person",
                "name": "محمد محمد وهبه (Mohamed Mohamed Wahba)",
                "jobTitle": "Founder & Chairman",
                "nationality": "Egyptian"
              },
              "developer": {
                "@type": "Person",
                "name": "محمد طارق (Mohamed Tarek)",
                "jobTitle": "Lead Full-Stack Web Developer",
                "telephone": "+201284621015",
                "url": "https://elshetawelsaif.com"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+201223366046",
                "contactType": "customer service",
                "areaServed": "EG",
                "availableLanguage": ["Arabic", "English"]
              }
            })
          }}
        />
        <AuthProvider>
          <ThemeProvider>
            <LanguageProvider>
              <CartProvider>
                <WishlistProvider>
                  <RecentlyViewedProvider>
                    <CompareProvider>
                      <StoreEffectsWrapper>
                        {children}
                      </StoreEffectsWrapper>
                      <WhatsAppButton />
                      <CompareBar />
                    </CompareProvider>
                  </RecentlyViewedProvider>
                </WishlistProvider>
              </CartProvider>
            </LanguageProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}


