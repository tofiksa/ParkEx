import { describe, expect, it } from "vitest";
import { GET as healthGET } from "../app/api/health/route";

describe("health api", () => {
	it("returns health status with database check", async () => {
		const res = await healthGET();
		const json = (await res.json()) as {
			status: string;
			checks: Record<string, string | boolean>;
		};

		expect(json).toHaveProperty("status");
		expect(json).toHaveProperty("checks");
		expect(json.checks).toHaveProperty("timestamp");
		expect(json.checks).toHaveProperty("database");

		// Status should be "ok" or "degraded" depending on DB config
		expect(["ok", "degraded"]).toContain(json.status);

		// If degraded, should return 503
		if (json.status === "degraded") {
			expect(res.status).toBe(503);
		} else {
			expect(res.status).toBe(200);
		}
	});
});
