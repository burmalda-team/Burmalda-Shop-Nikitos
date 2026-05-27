import { NextRequest, NextResponse } from "next/server";
import { supabasePublic } from "@/lib/supabase/public";
import { normalizeProduct } from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    let query = supabasePublic
      .from("products")
      .select("*, categories(*)", { count: "exact" });

    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort") || "created_at";
    const order = searchParams.get("order") || "desc";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    if (category) {
      const { data: cat } = await supabasePublic
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

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: products, error, count } = await query;

    if (error) {
      console.error("Products fetch error:", error);
      return NextResponse.json({ message: error.message, products: [], total: 0, pages: 0, page: 1 }, { status: 500 });
    }

    return NextResponse.json({
      products: (products || []).map(normalizeProduct),
      total: count || 0,
      pages: Math.ceil((count || 0) / limit),
      page,
    });
  } catch (err: any) {
    console.error("Products API error:", err);
    return NextResponse.json({ message: err.message, products: [], total: 0, pages: 0, page: 1 }, { status: 500 });
  }
}
