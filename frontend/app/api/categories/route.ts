import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    const { data: categories, error } = await supabase
      .from("categories")
      .select("*");

    if (error) {
      console.error("Categories error:", error);
      return NextResponse.json({ error: error.message, categories: [] }, { status: 500 });
    }

    return NextResponse.json(categories || []);
  } catch (err: any) {
    console.error("API crash:", err);
    return NextResponse.json({ error: err.message, categories: [] }, { status: 500 });
  }
}
