import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const { filename } = (await request.json()) as { filename?: string };
  if (!filename) {
    return NextResponse.json({ error: "filename required" }, { status: 400 });
  }

  const path = `garage-images/${filename}`;
  const { data, error } = await supabaseAdmin.storage
    .from("garage-images")
    .createSignedUploadUrl(path);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    path,
    signedUrl: data.signedUrl,
    token: data.token
  });
}

