import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = getSupabaseServerClient();
  const body = await request.json();
  const {
    firstName,
    lastName,
    email,
    role,
    phone,
    address
  }: {
    firstName: string;
    lastName: string;
    email: string;
    role: "buyer" | "seller";
    phone?: string;
    address?: string;
  } = body;

  if (!firstName || !lastName || !email || !role) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const {
    data: { user },
    error: sessionError
  } = await supabase.auth.getUser();

  if (sessionError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      role,
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      address
    })
    .eq("id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

