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

    let query = supabase
      .from("products")
      .select("*, categories(*)");

    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort") || "created_at";
    const order = searchParams.get("order") || "desc";

    if (category) {
      const { data: cat } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", category)
        .single();
      if (cat) {
        query = query.eq("category_id", cat.id);
      }
    }

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    if (minPrice) {
      query = query.gte("price", parseFloat(minPrice));
    }

    if (maxPrice) {
      query = query.lte("price", parseFloat(maxPrice));
    }

    query = query.order(sort, { ascending: order === "asc" });

    const { data: products, error } = await query;

    if (error) {
      console.error("Products error:", error);
      return NextResponse.json(
        { message: error.message, products: [], total: 0 },
        { status: 500 }
      );
    }

    const normalized = (products || []).map(normalizeProduct).filter(Boolean);

    return NextResponse.json({
      products: normalized,
      total: normalized.length,
      pages: 1,
      page: 1,
    });
  } catch (err: any) {
    console.error("API crash:", err);
    return NextResponse.json(
      { message: err.message, products: [], total: 0 },
      { status: 500 }
    );
  }
}
