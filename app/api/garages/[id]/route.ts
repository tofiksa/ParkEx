import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { incCounter } from "@/lib/metrics";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
	const supabase = await getSupabaseServerClient();
	if (!supabase) {
		incCounter("api_requests_total", { route: "garage_detail", status: 500 });
		return NextResponse.json({ error: "Supabase config missing" }, { status: 500 });
	}
	const { data: garage, error } = await supabase
		.from("garages")
		.select("*")
		.eq("id", params.id)
		.single();

	if (error) {
		incCounter("api_requests_total", { route: "garage_detail", status: 404 });
		return NextResponse.json({ error: error.message }, { status: 404 });
	}

	const { data: topBid } = await supabase
		.from("bids")
		.select("amount, bidder_id, created_at")
		.eq("garage_id", params.id)
		.order("amount", { ascending: false })
		.limit(1)
		.maybeSingle();

	incCounter("api_requests_total", { route: "garage_detail", status: 200 });
	return NextResponse.json({ garage, topBid });
}
