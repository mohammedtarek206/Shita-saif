import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import StoreConfig from "@/models/StoreConfig";
import { logActivity } from "@/services/logService";

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

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as any).role;
    if (role !== "superadmin" && role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Prevent non-superadmins from changing maintenanceMode or seasonalTheme
    if (role !== "superadmin") {
      delete body.maintenanceMode;
      delete body.seasonalTheme;
    }

    await connectDB();
    let config = await StoreConfig.findOne();
    if (!config) {
      config = new StoreConfig();
    }

    // Update config fields
    Object.assign(config, body);
    await config.save();

    await logActivity(req, "UPDATE_CONFIG", "StoreConfig", config._id.toString(), `Updated global store configurations: ${Object.keys(body).join(", ")}`);

    return NextResponse.json(config);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
