import { NextResponse } from "next/server";
import { supabasePublic } from "@/lib/supabase/public";
import { normalizeProduct } from "@/lib/api";

export async function GET() {
  try {
    const { data: products, error } = await supabasePublic
      .from("products")
      .select("*, categories(*)")
      .eq("is_bestseller", true)
      .limit(8);

    if (error) {
      console.error("Bestsellers API error:", error);
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json((products || []).map(normalizeProduct));
  } catch (err: any) {
    console.error("Bestsellers API error:", err);
    return NextResponse.json([], { status: 200 });
  }
}
