import mongoose, { Schema, Document } from "mongoose";

export interface IActivityLog extends Document {
  adminId: mongoose.Types.ObjectId;
  adminName: string;
  adminEmail: string;
  action: string;
  targetType: string;
  targetId?: string;
  details: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

const ActivityLogSchema: Schema = new Schema(
  {
    adminId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    adminName: { type: String, required: true },
    adminEmail: { type: String, required: true },
    action: { type: String, required: true }, // e.g. "CREATE_PRODUCT", "UPDATE_ORDER", "DELETE_COUPON"
    targetType: { type: String, required: true }, // e.g. "Product", "Order", "Coupon", "User"
    targetId: { type: String },
    details: { type: String, required: true }, // Stringified or text description of changes
    ipAddress: { type: String },
    userAgent: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.models.ActivityLog || mongoose.model<IActivityLog>("ActivityLog", ActivityLogSchema);
