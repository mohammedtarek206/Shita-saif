import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const product = await Product.findById(id).lean() as any;
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Manual population
    if (product.category) {
      const Category = (await import("@/models/Category")).default;
      const categories = await Category.find({}).lean();
      const catMap = new Map();
      categories.forEach((cat: any) => {
        catMap.set(cat._id.toString(), cat);
        if (cat.name?.en) catMap.set(cat.name.en, cat);
        if (cat.name?.ar) catMap.set(cat.name.ar, cat);
        if (cat.slug) catMap.set(cat.slug, cat);
      });
      product.category = catMap.get(product.category.toString()) || product.category;
    }

    // Resolve subCategory name from embedded subCategories
    const cat = product.category as any;
    if (cat && typeof cat === 'object' && product.subCategory && Array.isArray(cat.subCategories)) {
      const sub = cat.subCategories.find(
        (s: any) => s._id?.toString() === product.subCategory?.toString()
      );
      if (sub) {
        (product as any).subCategoryData = { _id: sub._id, name: sub.name };
      }
    }
    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "superadmin" && (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    await Product.findByIdAndDelete(id);
    return NextResponse.json({ message: "Product deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "superadmin" && (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    await connectDB();
    const product = await Product.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
