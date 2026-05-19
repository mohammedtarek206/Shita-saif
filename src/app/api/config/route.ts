import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import StoreConfig from "@/models/StoreConfig";

export async function GET() {
  try {
    await connectDB();
    let config = await StoreConfig.findOne();
    if (!config) {
      config = await StoreConfig.create({
        maintenanceMode: false,
        seasonalTheme: "none",
        flashSale: { active: false, expiresAt: null, discountPercent: 0, titleAr: "", titleEn: "" },
        shippingRules: { freeShippingThreshold: 5000, defaultShippingCost: 100 },
        banners: [
          {
            id: "1",
            image: "/Slider-1.jpg",
            titleAr: "معرض الشتاء والصيف",
            titleEn: "Winter & Summer Exhibition",
            subtitleAr: "أقوى عروض الأجهزة المنزلية والتكييفات",
            subtitleEn: "Best deals on home appliances & ACs",
            link: "/products"
          }
        ]
      });
    }
    return NextResponse.json(config);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
