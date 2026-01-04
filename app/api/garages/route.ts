import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type Payload = {
  title: string;
  description?: string;
  size: string;
  address: string;
  startPrice: number;
  bidEndAt?: string;
  images?: string[];
};

export async function POST(request: Request) {
  const supabase = getSupabaseServerClient();
  const { data: userRes, error: userErr } = await supabase.auth.getUser();

  if (userErr || !userRes?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as Payload;
  if (!body.title || !body.size || !body.address || !body.startPrice) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const bidEndAt = body.bidEndAt ? new Date(body.bidEndAt) : null;
  if (bidEndAt && Number.isNaN(bidEndAt.getTime())) {
    return NextResponse.json({ error: "Invalid bidEndAt" }, { status: 400 });
  }

  const { error } = await supabase.from("garages").insert({
    owner_id: userRes.user.id,
    title: body.title,
    description: body.description ?? null,
    size: body.size,
    address: body.address,
    start_price: body.startPrice,
    bid_end_at: bidEndAt ?? undefined,
    images: body.images ?? []
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function GET(request: Request) {
  const supabase = getSupabaseServerClient();
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit")) || 20;

  const { data, error } = await supabase
    .from("garages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(Math.min(limit, 50));

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

