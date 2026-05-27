import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const supabase = createClient();

  let query = supabase
    .from("products")
    .select("*, category:categories(*)", { count: "exact" });

  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const sort = searchParams.get("sort") || "createdAt";
  const order = searchParams.get("order") || "desc";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");

  if (category) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", category)
      .single();
    if (cat) {
      query = query.eq("categoryId", cat.id);
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
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({
    products: products || [],
    total: count || 0,
    pages: Math.ceil((count || 0) / limit),
    page,
  });
}
