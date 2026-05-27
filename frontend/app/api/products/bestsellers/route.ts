import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function normalizeProduct(p: any) {
  if (!p) return null;
  return {
    id: p.id || "",
    name: p.name || "",
    slug: p.slug || "",
    description: p.description || "",
    price: p.price || 0,
    oldPrice: p.old_price ?? null,
    images: p.images || [],
    sizes: p.sizes || [],
    colors: p.colors || [],
    categoryId: p.category_id ?? "",
    category: p.categories ? {
      id: p.categories.id || "",
      name: p.categories.name || "",
      slug: p.categories.slug || "",
      image: p.categories.image ?? null,
    } : { id: "", name: "", slug: "", image: null },
    inStock: p.in_stock ?? true,
    isNew: p.is_new ?? false,
    isBestseller: p.is_bestseller ?? false,
    createdAt: p.created_at ?? "",
  };
}

export async function GET() {
  try {
    const { data: products, error } = await supabase
      .from("products")
      .select("*, categories(*)")
      .eq("is_bestseller", true)
      .limit(8);

    if (error) {
      console.error("Bestsellers error:", error);
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json((products || []).map(normalizeProduct));
  } catch (err: any) {
    console.error("API crash:", err);
    return NextResponse.json([], { status: 200 });
  }
}
