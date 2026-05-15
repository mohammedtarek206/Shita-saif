import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  user?: mongoose.Types.ObjectId;
  userEmail: string;
  products: {
    product: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
    title?: { ar: string; en: string };
    image?: string;
  }[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  totalPrice: number;
  couponCode?: string;
  paymentMethod: "stripe" | "paymob_card" | "paymob_wallet" | "paymob_kiosk" | "instapay" | "cod";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentDetails?: {
    transactionId?: string;
    paymentId?: string;
    receiptUrl?: string;
    paymentScreenshot?: string;
    installmentPlan?: {
      months: number;
      monthlyAmount: number;
    };
  };
  shippingAddress: {
    name: string;
    phone: string;
    email: string;
    city: string;
    address: string;
    zipCode?: string;
  };
  status: "pending" | "confirmed" | "preparing" | "processing" | "shipped" | "out_for_delivery" | "delivered" | "cancelled";
  trackingNumber?: string;
  invoiceNumber: string;
  orderNumber: string;
  estimatedDelivery?: string;
  deliveryNotes?: string;
  trackingHistory: {
    status: string;
    timestamp: Date;
    note?: string;
  }[];
  trackingSteps: {
    label: { ar: string; en: string };
    completed: boolean;
    active: boolean;
    date?: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    userEmail: { type: String, required: true },
    products: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        title: {
          ar: String,
          en: String
        },
        image: String
      },
    ],
    subtotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    shippingCost: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },
    couponCode: { type: String },
    paymentMethod: { 
      type: String, 
      enum: ["stripe", "paymob_card", "paymob_wallet", "paymob_kiosk", "instapay", "cod"], 
      required: true 
    },
    paymentStatus: { 
      type: String, 
      enum: ["pending", "paid", "failed", "refunded"], 
      default: "pending" 
    },
    paymentDetails: {
      transactionId: String,
      paymentId: String,
      receiptUrl: String,
      paymentScreenshot: String,
      installmentPlan: {
        months: Number,
        monthlyAmount: Number,
      }
    },
    shippingAddress: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
      city: { type: String, required: true },
      address: { type: String, required: true },
      zipCode: String,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "preparing", "processing", "shipped", "out_for_delivery", "delivered", "cancelled"],
      default: "pending",
    },
    trackingNumber: String,
    invoiceNumber: { type: String, required: true, unique: true },
    orderNumber: { type: String, required: true, unique: true },
    estimatedDelivery: String,
    deliveryNotes: String,
    trackingHistory: [
      {
        status: String,
        timestamp: { type: Date, default: Date.now },
        note: String
      }
    ],
    trackingSteps: [
      {
        label: { ar: String, en: String },
        completed: { type: Boolean, default: false },
        active: { type: Boolean, default: false },
        date: Date
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
