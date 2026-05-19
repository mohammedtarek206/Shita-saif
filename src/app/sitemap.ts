import { MetadataRoute } from "next";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import BlogPost from "@/models/BlogPost";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://wintersummer.com";

  // 1. Core pages sitemap configuration
  const staticPages = [
    "",
    "/about",
    "/contact",
    "/products",
    "/offers",
    "/blog",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  let productPages: any[] = [];
  let blogPages: any[] = [];

  try {
    await connectDB();
    
    // Fetch products to map SEO friendly slugs
    const products = await Product.find({}, { _id: 1, title: 1, updatedAt: 1 }).lean();
    productPages = products.map((p: any) => {
      const slug = p.title?.en
        ? p.title.en.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
        : "product";
      return {
        url: `${baseUrl}/products/${slug}-${p._id}`,
        lastModified: p.updatedAt || new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      };
    });

    // Fetch blog posts
    const blogs = await BlogPost.find({}, { slug: 1, updatedAt: 1 }).lean();
    blogPages = blogs.map((b: any) => ({
      url: `${baseUrl}/blog/${b.slug}`,
      lastModified: b.updatedAt || new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch (e) {
    console.error("Sitemap dynamic database mapping failed:", e);
  }

  return [...staticPages, ...productPages, ...blogPages];
}
export const dynamic = "force-dynamic";
export const revalidate = 86400; // Cache sitemap for 24 hours
