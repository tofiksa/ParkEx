import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

function getSupabaseServerEnv() {
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
	if (!url || !anonKey) {
		return null;
	}
	return { url, anonKey };
}

export async function getSupabaseServerClient(): Promise<SupabaseClient | null> {
	const env = getSupabaseServerEnv();
	if (!env) return null;
	const cookieStore = await cookies();

	return createServerClient(env.url, env.anonKey, {
		cookies: {
			getAll() {
				return cookieStore.getAll();
			},
			setAll(cookiesToSet) {
				try {
					for (const { name, value, options } of cookiesToSet) {
						cookieStore.set(name, value, options);
					}
				} catch {
					// The `setAll` method was called from a Server Component.
					// This can be ignored if you have middleware refreshing sessions.
				}
			},
		},
	});
}
