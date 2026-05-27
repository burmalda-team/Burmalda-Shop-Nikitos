import { NextResponse } from "next/server";
import { supabasePublic } from "@/lib/supabase/public";

export async function GET() {
  try {
    const { data: categories, error } = await supabasePublic
      .from("categories")
      .select("*");

    if (error) {
      console.error("Categories API error:", error);
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(categories || []);
  } catch (err: any) {
    console.error("Categories API error:", err);
    return NextResponse.json([], { status: 200 });
  }
}
