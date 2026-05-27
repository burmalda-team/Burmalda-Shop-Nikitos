import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createClient();
  const { data: products, error } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("isBestseller", true)
    .limit(8);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json(products || []);
}
