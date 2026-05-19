import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "superadmin" && (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    await connectDB();
    
    // Transform flat data from UI to nested model structure
    const productData = {
      title: { ar: body.nameAr, en: body.nameEn },
      description: { ar: body.nameAr, en: body.nameEn }, // Fallback
      category: body.category,
      subCategory: body.subCategory,
      brand: body.brand || "WinterSummer",
      SKU: body.SKU,
      colors: body.colors || [],
      warranty: body.warranty,
      shippingStatus: body.shippingStatus || "In Stock",
      price: Number(body.price),
      discount: Number(body.discount || 0),
      stock: Number(body.stock || 0),
      images: body.images && body.images.length > 0 ? body.images : (body.imageUrl ? [body.imageUrl] : []),
      specifications: {
        ar: body.specs || [],
        en: body.specs || []
      }
    };

    const product = await Product.create(productData);
    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
