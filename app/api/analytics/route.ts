import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type EventPayload = {
  name: string;
  path?: string;
  sessionId?: string;
  props?: Record<string, unknown>;
};

export async function POST(request: Request) {
  const supabase = getSupabaseServerClient();
  const body = (await request.json()) as EventPayload;

  if (!body?.name) {
    return NextResponse.json({ error: "Missing event name" }, { status: 400 });
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("analytics_events").insert({
    name: body.name,
    path: body.path ?? null,
    session_id: body.sessionId ?? null,
    props: body.props ?? {},
    user_id: user?.id ?? null
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

