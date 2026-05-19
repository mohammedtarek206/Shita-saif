import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Review from "@/models/Review";

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("product");
  if (!productId) return NextResponse.json({ error: "Missing product id" }, { status: 400 });
  const reviews = await Review.find({ product: productId }).sort({ createdAt: -1 });
  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const { product, user, userName, rating, comment } = body;
  if (!product || !user || !userName || !rating || !comment) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  // Prevent duplicate review from same user on same product
  const existing = await Review.findOne({ product, user });
  if (existing) {
    return NextResponse.json({ error: "Already reviewed" }, { status: 409 });
  }
  const review = await Review.create({ product, user, userName, rating, comment });
  return NextResponse.json(review, { status: 201 });
}
