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

export function getImageUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (path.startsWith("/uploads/") && supabaseUrl) {
    // Supabase Storage public URL
    return `${supabaseUrl}/storage/v1/object/public/products${path}`;
  }
  return path;
}
