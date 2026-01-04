import { NextResponse } from "next/server";
import { incCounter } from "@/lib/metrics";

export async function GET() {
  incCounter("api_requests_total", { route: "health", status: 200 });
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString()
  });
}

