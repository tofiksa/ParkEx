import { describe, expect, it } from "vitest";
import { formatPrometheus, incCounter } from "../lib/metrics";

describe("metrics", () => {
  it("increments counters and formats prometheus output", () => {
    incCounter("api_requests_total", { route: "health", status: 200 });
    const out = formatPrometheus();
    expect(out).toContain('api_requests_total{route="health",status="200"} 1');
  });
});

