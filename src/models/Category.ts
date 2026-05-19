import mongoose, { Schema, Document } from "mongoose";

export interface ISubCategory {
  name: {
    ar: string;
    en: string;
  };
  slug: string;
}

export interface ICategory extends Document {
  name: {
    ar: string;
    en: string;
  };
  slug: string;
  image: string;
  icon: string;
  description: {
    ar: string;
    en: string;
  };
  subCategories: ISubCategory[];
  createdAt: Date;
  updatedAt: Date;
}

const SubCategorySchema = new Schema({
  name: {
    ar: { type: String, required: true },
    en: { type: String, required: true },
  },
  slug: { type: String, required: true },
});

const CategorySchema: Schema = new Schema(
  {
    name: {
      ar: { type: String, required: true },
      en: { type: String, required: true },
    },
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    icon: { type: String, required: true },
    description: {
      ar: { type: String },
      en: { type: String },
    },
    subCategories: [SubCategorySchema],
  },
  { timestamps: true }
);

export default mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);
