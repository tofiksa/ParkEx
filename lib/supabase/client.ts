import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

function getSupabaseBrowserEnv() {
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
	if (!url || !anonKey) {
		return null;
	}
	return { url, anonKey };
}

export function getSupabaseBrowserClient() {
	if (browserClient) return browserClient;
	const env = getSupabaseBrowserEnv();
	if (!env) return null;
	
	// Use createBrowserClient from @supabase/ssr for proper cookie handling
	browserClient = createBrowserClient(env.url, env.anonKey);
	return browserClient;
}
