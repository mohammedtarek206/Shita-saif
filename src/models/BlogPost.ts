import mongoose, { Schema, Document } from "mongoose";

export interface IBlogPost extends Document {
  titleAr: string;
  titleEn: string;
  slug: string;
  contentAr: string;
  contentEn: string;
  excerptAr: string;
  excerptEn: string;
  coverImage: string;
  author: string;
  tags: string[];
  metaKeywords: string[];
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema: Schema = new Schema(
  {
    titleAr: { type: String, required: true },
    titleEn: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    contentAr: { type: String, required: true },
    contentEn: { type: String, required: true },
    excerptAr: { type: String, required: true },
    excerptEn: { type: String, required: true },
    coverImage: { type: String, default: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1200&auto=format&fit=crop" },
    author: { type: String, default: "محمد محمد وهبه (Mohamed Wahba)" },
    tags: { type: [String], default: [] },
    metaKeywords: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.BlogPost || mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);
