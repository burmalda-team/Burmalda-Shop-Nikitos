import { NextRequest, NextResponse } from "next/server";
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const sort = searchParams.get("sort") || "created_at";
    const order = searchParams.get("order") || "desc";

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: products, error, count } = await supabase
      .from("products")
      .select("*, categories(*)", { count: "exact" })
      .order(sort, { ascending: order === "asc" })
      .range(from, to);

    if (error) {
      console.error("Products error:", error);
      return NextResponse.json(
        { message: error.message, details: error, products: [], total: 0, pages: 0, page: 1 },
        { status: 500 }
      );
    }

    return NextResponse.json({
      products: (products || []).map(normalizeProduct),
      total: count || 0,
      pages: Math.ceil((count || 0) / limit),
      page,
    });
  } catch (err: any) {
    console.error("API crash:", err);
    return NextResponse.json(
      { message: err.message, stack: err.stack, products: [], total: 0, pages: 0, page: 1 },
      { status: 500 }
    );
  }
}
