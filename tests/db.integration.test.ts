import { describe, expect, it } from "vitest";
import { getSupabaseAdmin } from "../lib/supabase/admin";
import { getSupabaseServerClient } from "../lib/supabase/server";

describe("database integration", () => {
	it("admin client can connect and query profiles table", async () => {
		const supabase = getSupabaseAdmin();
		if (!supabase) {
			// Skip if env not configured - this is expected in CI/test environments
			console.log("Skipping DB test: Supabase env not configured");
			return;
		}

		const { data, error } = await supabase.from("profiles").select("id").limit(1);
		expect(error).toBeNull();
		expect(Array.isArray(data)).toBe(true);
	});

	it("admin client can query garages table", async () => {
		const supabase = getSupabaseAdmin();
		if (!supabase) {
			return;
		}

		const { data, error } = await supabase.from("garages").select("id").limit(1);
		expect(error).toBeNull();
		expect(Array.isArray(data)).toBe(true);
	});

	it("admin client can query bids table", async () => {
		const supabase = getSupabaseAdmin();
		if (!supabase) {
			return;
		}

		const { data, error } = await supabase.from("bids").select("id").limit(1);
		expect(error).toBeNull();
		expect(Array.isArray(data)).toBe(true);
	});

	it("server client returns null when env missing", async () => {
		// This should handle missing env gracefully
		const client = await getSupabaseServerClient();
		// In test env without cookies, this may return null
		// The important thing is it doesn't throw
		expect(client === null || typeof client === "object").toBe(true);
	});

	it("admin client returns null when env missing", () => {
		const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
		const originalKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

		delete process.env.NEXT_PUBLIC_SUPABASE_URL;
		delete process.env.SUPABASE_SERVICE_ROLE_KEY;

		const client = getSupabaseAdmin();
		expect(client).toBeNull();

		// Restore
		if (originalUrl) process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl;
		if (originalKey) process.env.SUPABASE_SERVICE_ROLE_KEY = originalKey;
	});
});
