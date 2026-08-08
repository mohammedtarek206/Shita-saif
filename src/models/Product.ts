import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  title: {
    ar: string;
    en: string;
  };
  description: {
    ar: string;
    en: string;
  };
  category: mongoose.Types.ObjectId | any;
  subCategory: string | mongoose.Types.ObjectId | any; // The slug or embedded _id of the subcategory
  brand: string;
  SKU: string;
  colors: string[];
  warranty: string;
  shippingStatus: string;
  price: string;
  discount: number;
  stock: number;
  images: string[];
  ratings: number;
  reviews: mongoose.Types.ObjectId[];
  isFeatured: boolean;
  specifications: {
    ar: { key: string; value: string }[];
    en: { key: string; value: string }[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    title: {
      ar: { type: String, required: true },
      en: { type: String, required: true },
    },
    description: {
      ar: { type: String, required: true },
      en: { type: String, required: true },
    },
    category: { type: Schema.Types.Mixed, ref: "Category", required: true },
    subCategory: { type: String },
    brand: { type: String, required: true },
    SKU: { type: String },
    colors: [{ type: String }],
    warranty: { type: String },
    shippingStatus: { type: String, default: "In Stock" },
    price: { type: String, required: true },
    discount: { type: Number, default: 0 },
    stock: { type: Number, required: true, default: 0 },
    images: [{ type: String, required: true }],
    ratings: { type: Number, default: 0 },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    isFeatured: { type: Boolean, default: false },
    specifications: {
      ar: [{ key: String, value: String }],
      en: [{ key: String, value: String }],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
