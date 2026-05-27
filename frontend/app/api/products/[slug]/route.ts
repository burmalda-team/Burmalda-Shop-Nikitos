import { NextResponse } from "next/server";
import { supabasePublic } from "@/lib/supabase/public";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { data: product, error } = await supabasePublic
      .from("products")
      .select("*, category:categories(*)")
      .eq("slug", params.slug)
      .single();

    if (error || !product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (err: any) {
    console.error("Product slug API error:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
