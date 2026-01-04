import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const { filename } = (await request.json()) as { filename?: string };
  if (!filename) {
    return NextResponse.json({ error: "filename required" }, { status: 400 });
  }

  const path = `garage-images/${filename}`;
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase admin credentials missing" },
      { status: 500 }
    );
  }

  const { data, error } = await supabaseAdmin.storage.from("garage-images").createSignedUploadUrl(path);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    path,
    signedUrl: data.signedUrl,
    token: data.token
  });
}

