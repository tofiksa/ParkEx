import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { incCounter } from "@/lib/metrics";

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
  if (!supabase) {
    incCounter("api_requests_total", { route: "garages_post", status: 500 });
    return NextResponse.json({ error: "Supabase config missing" }, { status: 500 });
  }
  const { data: userRes, error: userErr } = await supabase.auth.getUser();

  if (userErr || !userRes?.user) {
    incCounter("api_requests_total", { route: "garages_post", status: 401 });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as Payload;
  if (!body.title || !body.size || !body.address || !body.startPrice) {
    incCounter("api_requests_total", { route: "garages_post", status: 400 });
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const bidEndAt = body.bidEndAt ? new Date(body.bidEndAt) : null;
  if (bidEndAt && Number.isNaN(bidEndAt.getTime())) {
    incCounter("api_requests_total", { route: "garages_post", status: 400 });
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
    incCounter("api_requests_total", { route: "garages_post", status: 500 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  incCounter("api_requests_total", { route: "garages_post", status: 200 });
  return NextResponse.json({ ok: true });
}

export async function GET(request: Request) {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    incCounter("api_requests_total", { route: "garages_get", status: 500 });
    return NextResponse.json({ error: "Supabase config missing" }, { status: 500 });
  }
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit")) || 20;

  const { data, error } = await supabase
    .from("garages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(Math.min(limit, 50));

  if (error) {
    incCounter("api_requests_total", { route: "garages_get", status: 500 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  incCounter("api_requests_total", { route: "garages_get", status: 200 });
  return NextResponse.json({ data });
}

