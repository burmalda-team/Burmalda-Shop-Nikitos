import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const supabase = createClient();
  const { data: product, error } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("slug", params.slug)
    .single();

  if (error || !product) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}
