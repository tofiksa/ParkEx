import { NextResponse } from "next/server";
import { incCounter } from "@/lib/metrics";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type Payload = {
	garageId: string;
	amount: number;
};

export async function POST(request: Request) {
	const supabase = await getSupabaseServerClient();
	if (!supabase) {
		incCounter("api_requests_total", { route: "bids", status: 500 });
		return NextResponse.json({ error: "Supabase config missing" }, { status: 500 });
	}
	const { data: userRes, error: userErr } = await supabase.auth.getUser();
	if (userErr || !userRes?.user) {
		incCounter("api_requests_total", { route: "bids", status: 401 });
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const body = (await request.json()) as Payload;
	if (!body?.garageId || typeof body.amount !== "number" || Number.isNaN(body.amount)) {
		incCounter("api_requests_total", { route: "bids", status: 400 });
		return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
	}

	const { data: garage, error: garageErr } = await supabase
		.from("garages")
		.select("id, owner_id, start_price, bid_end_at")
		.eq("id", body.garageId)
		.single();

	if (garageErr || !garage) {
		incCounter("api_requests_total", { route: "bids", status: 404 });
		return NextResponse.json({ error: "Garage not found" }, { status: 404 });
	}

	if (garage.owner_id === userRes.user.id) {
		incCounter("api_requests_total", { route: "bids", status: 400 });
		return NextResponse.json({ error: "Cannot bid on own listing" }, { status: 400 });
	}

	const now = new Date();
	if (new Date(garage.bid_end_at) <= now) {
		incCounter("api_requests_total", { route: "bids", status: 400 });
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
		incCounter("api_requests_total", { route: "bids", status: 400 });
		return NextResponse.json(
			{ error: `Bid too low. Minimum required: ${minRequired}` },
			{ status: 400 },
		);
	}

	const { error: insertErr } = await supabase.from("bids").insert({
		garage_id: garage.id,
		bidder_id: userRes.user.id,
		amount: body.amount,
	});

	if (insertErr) {
		incCounter("api_requests_total", { route: "bids", status: 500 });
		return NextResponse.json({ error: insertErr.message }, { status: 500 });
	}

	incCounter("api_requests_total", { route: "bids", status: 200 });
	return NextResponse.json({ ok: true });
}
