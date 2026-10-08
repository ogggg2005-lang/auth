import { z } from "zod";
import fallbackData from "@/data/products-fallback.json";

export const CATEGORIES = [
  "beauty",
  "fragrances",
  "furniture",
  "groceries",
  "home-decoration",
  "kitchen-accessories",
  "laptops",
  "mens-shirts",
  "mens-shoes",
  "mens-watches",
  "mobile-accessories",
  "motorcycle",
  "skin-care",
  "smartphones",
  "sports-accessories",
  "sunglasses",
  "tablets",
  "tops",
  "vehicle",
  "womens-bags",
  "womens-dresses",
  "womens-jewellery",
  "womens-shoes",
  "womens-watches",
] as const;

export const ProductSchema = z.object({
  id: z.number(),
  title: z.string().trim().min(1, "กรุณากรอกชื่อสินค้า"),
  thumbnail: z.string(),
  price: z.number().min(0, "ราคาต้องไม่ติดลบ"),
  stock: z.number().int().min(0, "จำนวนคงเหลือต้องไม่ติดลบ"),
  category: z.string().min(1, "กรุณาเลือกหมวดหมู่"),
});

export const ProductDraftSchema = ProductSchema.omit({ id: true });
export type ProductDraft = z.infer<typeof ProductDraftSchema>;

export const ProductListSchema = z.object({
  products: z.array(ProductSchema),
  total: z.number().optional().default(0),
  skip: z.number().optional().default(0),
  limit: z.number().optional().default(10),
});

export type Product = z.infer<typeof ProductSchema>;
export type ProductList = z.infer<typeof ProductListSchema>;

export const SORT_FIELDS = ["title", "price", "stock", "category"] as const;

export const SearchQuerySchema = z.object({
  q: z.string().trim().default(""),
  limit: z.number().int().min(1).max(30).default(10),
  sortBy: z.enum(SORT_FIELDS).default("title"),
  category: z.string().optional(),
});

export type SearchQuery = z.infer<typeof SearchQuerySchema>;
export type SearchQueryInput = z.input<typeof SearchQuerySchema>;

export const defaultQuery: SearchQuery = {
  q: "",
  limit: 10,
  sortBy: "title",
};

const fallbackProducts = ProductListSchema.parse(fallbackData);

export async function fetchProducts(query: SearchQuery): Promise<ProductList> {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  params.set("limit", String(query.limit));
  params.set("sortBy", query.sortBy);
  if (query.category) params.set("category", query.category);

  try {
    const response = await fetch(`/api/products?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`เรียกข้อมูลสินค้าไม่สำเร็จ (สถานะ ${response.status})`);
    }

    const data: unknown = await response.json();
    return ProductListSchema.parse(data);
  } catch (error) {
    console.error("fetchProducts failed, using fallback data:", error);
    return fallbackProducts;
  }
}
