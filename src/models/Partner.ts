import mongoose, { Schema, Document } from "mongoose";

export interface IPartner extends Document {
  name: string;
  category: string;
  logo: string;
  status: "Active" | "Inactive";
  createdAt: Date;
  updatedAt: Date;
}

const PartnerSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    logo: { type: String, required: true },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  },
  { timestamps: true }
);

export default mongoose.models.Partner || mongoose.model<IPartner>("Partner", PartnerSchema);
