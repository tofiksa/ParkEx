import { describe, expect, it } from "vitest";
import { GET as metricsGET } from "../app/api/metrics/route";
import { incCounter } from "../lib/metrics";

describe("metrics api", () => {
  it("returns text/plain with counters", async () => {
    incCounter("api_requests_total", { route: "test", status: 200 });
    const res = await metricsGET();
    expect(res.headers.get("content-type")).toContain("text/plain");
    const text = await res.text();
    expect(text).toContain("api_requests_total");
  });
});

