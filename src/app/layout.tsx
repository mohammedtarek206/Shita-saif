import type { Metadata } from "next";
import { Cairo, Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import AuthProvider from "@/providers/AuthProvider";

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
  title: "الشتاء والصيف | Winter & Summer - الأجهزة المنزلية المميزة",
  description: "معرض الشتاء والصيف للأجهزة الكهربائية والمنزلية. جودة عالية وأفضل الأسعار.",
  keywords: ["أجهزة منزلية", "أدوات كهربائية", "تكييفات", "غسالات", "ثلاجات", "Winter Summer"],
  icons: {
    icon: "/Logo-removebg-preview.png",
    apple: "/Logo-removebg-preview.png",
  },
};

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
        <AuthProvider>
          <ThemeProvider>
            <LanguageProvider>
              <CartProvider>
                <WishlistProvider>
                  {children}
                </WishlistProvider>
              </CartProvider>
            </LanguageProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}


