import { createClient } from "./supabase/client";

export const supabase = createClient();

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  oldPrice: number | null;
  images: string[];
  sizes: string[];
  colors: string[];
  categoryId: string;
  category: Category;
  inStock: boolean;
  isNew: boolean;
  isBestseller: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
}

export interface CartItem {
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

export function normalizeCategory(c: any): Category {
  if (!c) return { id: "", name: "", slug: "", image: null };
  return {
    id: c.id || "",
    name: c.name || "",
    slug: c.slug || "",
    image: c.image ?? null,
  };
}

export function normalizeProduct(p: any): Product {
  if (!p) {
    return {
      id: "",
      name: "",
      slug: "",
      description: "",
      price: 0,
      oldPrice: null,
      images: [],
      sizes: [],
      colors: [],
      categoryId: "",
      category: normalizeCategory(null),
      inStock: true,
      isNew: false,
      isBestseller: false,
      createdAt: "",
    };
  }

  const rawCategory = p.category || p.categories || null;

  return {
    id: p.id || "",
    name: p.name || "",
    slug: p.slug || "",
    description: p.description || "",
    price: p.price || 0,
    oldPrice: p.old_price ?? p.oldPrice ?? null,
    images: p.images || [],
    sizes: p.sizes || [],
    colors: p.colors || [],
    categoryId: p.category_id ?? p.categoryId ?? "",
    category: normalizeCategory(rawCategory),
    inStock: p.in_stock ?? p.inStock ?? true,
    isNew: p.is_new ?? p.isNew ?? false,
    isBestseller: p.is_bestseller ?? p.isBestseller ?? false,
    createdAt: p.created_at ?? p.createdAt ?? "",
  };
}

export function getImageUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (path.startsWith("/uploads/") && supabaseUrl) {
    return `${supabaseUrl}/storage/v1/object/public/products${path}`;
  }
  return path;
}
