import { NextResponse } from "next/server";
import { incCounter } from "@/lib/metrics";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
	const timestamp = new Date().toISOString();
	const checks: Record<string, boolean | string> = {
		timestamp,
	};

	// Test database connectivity
	const supabase = getSupabaseAdmin();
	if (!supabase) {
		incCounter("api_requests_total", { route: "health", status: 503 });
		return NextResponse.json(
			{
				status: "degraded",
				timestamp,
				checks: {
					...checks,
					database: "missing_config",
				},
			},
			{ status: 503 },
		);
	}

	try {
		// Test basic query to verify connection and table existence
		const { error } = await supabase.from("profiles").select("id").limit(1);
		if (error) {
			checks.database = `error: ${error.message}`;
			incCounter("api_requests_total", { route: "health", status: 503 });
			return NextResponse.json(
				{
					status: "degraded",
					timestamp,
					checks,
				},
				{ status: 503 },
			);
		}
		checks.database = "ok";
	} catch (err) {
		checks.database = `exception: ${err instanceof Error ? err.message : String(err)}`;
		incCounter("api_requests_total", { route: "health", status: 503 });
		return NextResponse.json(
			{
				status: "degraded",
				timestamp,
				checks,
			},
			{ status: 503 },
		);
	}

	incCounter("api_requests_total", { route: "health", status: 200 });
	return NextResponse.json({
		status: "ok",
		checks,
	});
}
