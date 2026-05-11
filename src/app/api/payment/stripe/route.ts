import { NextResponse } from "next/server";
import { paymentService } from "@/services/paymentService";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, products, totalPrice } = body;

    const session = await paymentService.createStripeSession({
      orderId,
      products,
      totalPrice
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
