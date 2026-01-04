import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { incCounter } from "@/lib/metrics";

type FeedbackPayload = {
  message: string;
  rating?: number;
  contact?: string;
};

export async function POST(request: Request) {
  const supabase = getSupabaseServerClient();
  const body = (await request.json()) as FeedbackPayload;

  if (!body?.message) {
    incCounter("api_requests_total", { route: "feedback", status: 400 });
    return NextResponse.json({ error: "Message required" }, { status: 400 });
  }

  const ratingValid =
    typeof body.rating === "undefined" ||
    (typeof body.rating === "number" && body.rating >= 1 && body.rating <= 5);

  if (!ratingValid) {
    incCounter("api_requests_total", { route: "feedback", status: 400 });
    return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("feedback").insert({
    user_id: user?.id ?? null,
    message: body.message,
    rating: body.rating ?? null,
    contact: body.contact ?? null
  });

  if (error) {
    incCounter("api_requests_total", { route: "feedback", status: 500 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  incCounter("api_requests_total", { route: "feedback", status: 200 });
  return NextResponse.json({ ok: true });
}

