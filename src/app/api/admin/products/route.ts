import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .lean();

    // Fetch all categories for manual population to avoid CastError on legacy string categories
    const categories = await Category.find({}).lean();
    const catMap = new Map();
    categories.forEach((cat: any) => {
      catMap.set(cat._id.toString(), cat);
      if (cat.name?.en) catMap.set(cat.name.en, cat);
      if (cat.name?.ar) catMap.set(cat.name.ar, cat);
      if (cat.slug) catMap.set(cat.slug, cat);
    });

    // Resolve category and subCategory name manually
    const enriched = products.map((p: any) => {
      let catObj = null;
      if (p.category) {
        // Try to find the category object in our map using the string representation of the category field
        catObj = catMap.get(p.category.toString()) || p.category;
        p.category = catObj;
      }
      
      const cat = p.category;
      if (cat && typeof cat === 'object' && p.subCategory && Array.isArray(cat.subCategories)) {
        const sub = cat.subCategories.find(
          (s: any) => s._id?.toString() === p.subCategory?.toString()
        );
        if (sub) {
          p.subCategoryData = { _id: sub._id, name: sub.name };
        }
      }
      return p;
    });

    return NextResponse.json(enriched);
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
      description: { 
        ar: body.description?.ar || body.nameAr, 
        en: body.description?.en || body.nameEn 
      },
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
