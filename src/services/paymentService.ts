import axios from "axios";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16" as any,
});

export const paymentService = {
  // Stripe Checkout Session
  createStripeSession: async (orderData: any) => {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: orderData.products.map((item: any) => ({
        price_data: {
          currency: "egp",
          product_data: {
            name: item.title,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/failed`,
      metadata: {
        orderId: orderData.orderId,
      },
    });
    return session;
  },

  // Paymob Integration
  getPaymobToken: async () => {
    const response = await axios.post("https://accept.paymob.com/api/auth/tokens", {
      api_key: process.env.PAYMOB_API_KEY,
    });
    return response.data.token;
  },

  createPaymobOrder: async (token: string, amount: number, orderId: string) => {
    const response = await axios.post("https://accept.paymob.com/api/ecommerce/orders", {
      auth_token: token,
      delivery_needed: "false",
      amount_cents: Math.round(amount * 100),
      currency: "EGP",
      merchant_order_id: orderId,
    });
    return response.data;
  },

  getPaymentKey: async (token: string, orderId: number, amount: number, userData: any, integrationId: string) => {
    const response = await axios.post("https://accept.paymob.com/api/acceptance/payment_keys", {
      auth_token: token,
      amount_cents: Math.round(amount * 100),
      expiration: 3600,
      order_id: orderId,
      billing_data: {
        apartment: "NA",
        email: userData.email,
        floor: "NA",
        first_name: userData.name.split(" ")[0],
        street: userData.address,
        building: "NA",
        phone_number: userData.phone,
        shipping_method: "PKG",
        postal_code: "NA",
        city: userData.city,
        country: "EG",
        last_name: userData.name.split(" ")[1] || "User",
        state: "NA",
      },
      currency: "EGP",
      integration_id: integrationId,
    });
    return response.data.token;
  },
};
