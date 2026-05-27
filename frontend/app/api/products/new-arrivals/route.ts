import { NextResponse } from "next/server";
import { supabasePublic } from "@/lib/supabase/public";

export async function GET() {
  try {
    const { data: products, error } = await supabasePublic
      .from("products")
      .select("*, category:categories(*)")
      .eq("is_new", true)
      .limit(8);

    if (error) {
      console.error("New arrivals API error:", error);
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(products || []);
  } catch (err: any) {
    console.error("New arrivals API error:", err);
    return NextResponse.json([], { status: 200 });
  }
}
