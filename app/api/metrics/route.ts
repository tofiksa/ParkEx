import { NextResponse } from "next/server";
import { formatPrometheus } from "@/lib/metrics";

export async function GET() {
	const body = formatPrometheus();
	return new NextResponse(body, {
		status: 200,
		headers: {
			"Content-Type": "text/plain",
		},
	});
}
