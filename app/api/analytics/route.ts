import { NextResponse } from "next/server";
import { incCounter } from "@/lib/metrics";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type EventPayload = {
	name: string;
	path?: string;
	sessionId?: string;
	props?: Record<string, unknown>;
};

export async function POST(request: Request) {
	const supabase = await getSupabaseServerClient();
	if (!supabase) {
		incCounter("api_requests_total", { route: "analytics", status: 500 });
		return NextResponse.json({ error: "Supabase config missing" }, { status: 500 });
	}
	const body = (await request.json()) as EventPayload;

	if (!body?.name) {
		incCounter("api_requests_total", { route: "analytics", status: 400 });
		return NextResponse.json({ error: "Missing event name" }, { status: 400 });
	}

	const {
		data: { user },
	} = await supabase.auth.getUser();

	const { error } = await supabase.from("analytics_events").insert({
		name: body.name,
		path: body.path ?? null,
		session_id: body.sessionId ?? null,
		props: body.props ?? {},
		user_id: user?.id ?? null,
	});

	if (error) {
		incCounter("api_requests_total", { route: "analytics", status: 500 });
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	incCounter("api_requests_total", { route: "analytics", status: 200 });
	return NextResponse.json({ ok: true });
}
