import { NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

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
  return { session };
}

export async function POST(request: NextRequest) {
  const { session } = await getSession(request);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const files = formData.getAll("images") as File[];

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const urls: string[] = [];

    for (const file of files) {
      const fileName = `${Date.now()}-${file.name}`;
      const { error } = await supabaseAdmin.storage
        .from("products")
        .upload(fileName, file);

      if (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
      }

      const { data: publicUrl } = supabaseAdmin.storage
        .from("products")
        .getPublicUrl(fileName);

      urls.push(publicUrl.publicUrl);
    }

    return NextResponse.json({ urls });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
