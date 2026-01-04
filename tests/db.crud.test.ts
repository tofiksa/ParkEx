import { describe, expect, it } from "vitest";
import { getSupabaseAdmin } from "../lib/supabase/admin";

const supabase = getSupabaseAdmin();
const shouldSkip = !supabase;

describe.skipIf(shouldSkip)("database CRUD operations", () => {
	it("can read from profiles table", async () => {
		const { data, error } = await supabase.from("profiles").select("id, role, email").limit(5);
		expect(error).toBeNull();
		expect(Array.isArray(data)).toBe(true);
	});

	it("can read from garages table", async () => {
		const { data, error } = await supabase
			.from("garages")
			.select("id, title, start_price, bid_end_at")
			.limit(5);
		expect(error).toBeNull();
		expect(Array.isArray(data)).toBe(true);
	});

	it("can read from bids table", async () => {
		const { data, error } = await supabase
			.from("bids")
			.select("id, garage_id, amount, created_at")
			.order("created_at", { ascending: false })
			.limit(5);
		expect(error).toBeNull();
		expect(Array.isArray(data)).toBe(true);
	});

	it("can query garages with bid_end_at filter", async () => {
		const { data, error } = await supabase
			.from("garages")
			.select("id, title, bid_end_at")
			.gt("bid_end_at", new Date().toISOString())
			.limit(5);
		expect(error).toBeNull();
		expect(Array.isArray(data)).toBe(true);
		// All returned garages should have bid_end_at in the future
		if (data && data.length > 0) {
			data.forEach((garage) => {
				expect(new Date(garage.bid_end_at).getTime()).toBeGreaterThan(Date.now());
			});
		}
	});

	it("can query bids ordered by amount descending", async () => {
		const { data, error } = await supabase
			.from("bids")
			.select("id, garage_id, amount")
			.order("amount", { ascending: false })
			.limit(5);
		expect(error).toBeNull();
		expect(Array.isArray(data)).toBe(true);
		// Verify ordering (if we have multiple bids)
		if (data && data.length > 1) {
			for (let i = 0; i < data.length - 1; i++) {
				expect(Number(data[i].amount)).toBeGreaterThanOrEqual(Number(data[i + 1].amount));
			}
		}
	});
});
