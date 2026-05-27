import { NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { normalizeProduct } from "@/lib/api";

async function getSession(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  return { session, supabase };
}

function toSnakeCasePayload(body: any) {
  return {
    name: body.name,
    slug: body.slug,
    description: body.description,
    price: body.price,
    old_price: body.oldPrice ?? null,
    images: body.images || [],
    sizes: body.sizes || [],
    colors: body.colors || [],
    category_id: body.categoryId,
    in_stock: body.inStock ?? true,
    is_new: body.isNew ?? false,
    is_bestseller: body.isBestseller ?? false,
  };
}

export async function POST(request: NextRequest) {
  const { session } = await getSession(request);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const payload = toSnakeCasePayload(body);

    const { createClient } = await import("@supabase/supabase-js");
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabaseAdmin
      .from("products")
      .insert(payload)
      .select("*, categories(*)")
      .single();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    return NextResponse.json(normalizeProduct(data), { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const { session } = await getSession(request);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, ...body } = await request.json();
    const payload = toSnakeCasePayload(body);

    const { createClient } = await import("@supabase/supabase-js");
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabaseAdmin
      .from("products")
      .update(payload)
      .eq("id", id)
      .select("*, categories(*)")
      .single();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    return NextResponse.json(normalizeProduct(data));
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
