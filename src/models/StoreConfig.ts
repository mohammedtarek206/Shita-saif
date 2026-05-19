import mongoose, { Schema, Document } from "mongoose";

export interface IStoreConfig extends Document {
  maintenanceMode: boolean;
  seasonalTheme: "none" | "winter" | "summer";
  flashSale: {
    active: boolean;
    expiresAt: Date | null;
    discountPercent: number;
    titleAr: string;
    titleEn: string;
  };
  shippingRules: {
    freeShippingThreshold: number;
    defaultShippingCost: number;
  };
  banners: {
    id: string;
    image: string;
    titleAr: string;
    titleEn: string;
    subtitleAr: string;
    subtitleEn: string;
    link: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const StoreConfigSchema: Schema = new Schema(
  {
    maintenanceMode: { type: Boolean, default: false },
    seasonalTheme: { type: String, enum: ["none", "winter", "summer"], default: "none" },
    flashSale: {
      active: { type: Boolean, default: false },
      expiresAt: { type: Date, default: null },
      discountPercent: { type: Number, default: 0 },
      titleAr: { type: String, default: "" },
      titleEn: { type: String, default: "" },
    },
    shippingRules: {
      freeShippingThreshold: { type: Number, default: 5000 },
      defaultShippingCost: { type: Number, default: 100 },
    },
    banners: [
      {
        id: { type: String, required: true },
        image: { type: String, required: true },
        titleAr: { type: String, default: "" },
        titleEn: { type: String, default: "" },
        subtitleAr: { type: String, default: "" },
        subtitleEn: { type: String, default: "" },
        link: { type: String, default: "" },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.StoreConfig || mongoose.model<IStoreConfig>("StoreConfig", StoreConfigSchema);
