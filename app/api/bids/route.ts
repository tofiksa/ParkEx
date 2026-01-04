import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type Payload = {
  garageId: string;
  amount: number;
};

export async function POST(request: Request) {
  const supabase = getSupabaseServerClient();
  const { data: userRes, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userRes?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as Payload;
  if (!body?.garageId || typeof body.amount !== "number" || Number.isNaN(body.amount)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { data: garage, error: garageErr } = await supabase
    .from("garages")
    .select("id, owner_id, start_price, bid_end_at")
    .eq("id", body.garageId)
    .single();

  if (garageErr || !garage) {
    return NextResponse.json({ error: "Garage not found" }, { status: 404 });
  }

  if (garage.owner_id === userRes.user.id) {
    return NextResponse.json({ error: "Cannot bid on own listing" }, { status: 400 });
  }

  const now = new Date();
  if (new Date(garage.bid_end_at) <= now) {
    return NextResponse.json({ error: "Bidding closed" }, { status: 400 });
  }

  const { data: topBid } = await supabase
    .from("bids")
    .select("amount")
    .eq("garage_id", body.garageId)
    .order("amount", { ascending: false })
    .limit(1)
    .maybeSingle();

  const minRequired = Math.max(Number(garage.start_price), topBid?.amount ?? 0) + 1;
  if (body.amount < minRequired) {
    return NextResponse.json(
      { error: `Bid too low. Minimum required: ${minRequired}` },
      { status: 400 }
    );
  }

  const { error: insertErr } = await supabase.from("bids").insert({
    garage_id: garage.id,
    bidder_id: userRes.user.id,
    amount: body.amount
  });

  if (insertErr) {
    return NextResponse.json({ error: insertErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

