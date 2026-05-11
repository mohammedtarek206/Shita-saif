import { NextResponse } from "next/server";
import { paymentService } from "@/services/paymentService";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, amount, userData, method } = body;

    // Integration IDs from environment
    const integrationId = method === "paymob_wallet" 
      ? process.env.PAYMOB_WALLET_INTEGRATION_ID 
      : process.env.PAYMOB_CARD_INTEGRATION_ID;

    const token = await paymentService.getPaymobToken();
    const order = await paymentService.createPaymobOrder(token, amount, orderId);
    const paymentKey = await paymentService.getPaymentKey(
      token, 
      order.id, 
      amount, 
      userData, 
      integrationId!
    );

    return NextResponse.json({ paymentKey });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
