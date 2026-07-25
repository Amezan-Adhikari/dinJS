import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Duration } from "../src/duration/duration";
import { watchRelative } from "../src/duration/relative";
import { DinDate } from "../src/DinDate";

// ═══════════════════════════════════════════════════════════════
// Duration — construction & getters
// ═══════════════════════════════════════════════════════════════

describe("Duration construction", () => {
  it("fromMs", () => {
    const d = Duration.fromMs(12345);
    expect(d.milliseconds).toBe(12345);
  });

  it("fromSeconds", () => {
    const d = Duration.fromSeconds(5);
    expect(d.milliseconds).toBe(5000);
  });

  it("fromMinutes", () => {
    const d = Duration.fromMinutes(2);
    expect(d.milliseconds).toBe(120000);
  });

  it("fromHours", () => {
    const d = Duration.fromHours(1);
    expect(d.milliseconds).toBe(3600000);
  });

  it("fromDays", () => {
    const d = Duration.fromDays(1);
    expect(d.milliseconds).toBe(86400000);
  });
});

// ═══════════════════════════════════════════════════════════════
// Duration — clock breakdown
// ═══════════════════════════════════════════════════════════════

describe("Duration clock breakdown", () => {
  it("0ms → all zeros", () => {
    const d = Duration.fromMs(0);
    expect(d.days).toBe(0);
    expect(d.hours).toBe(0);
    expect(d.minutes).toBe(0);
    expect(d.seconds).toBe(0);
    expect(d.millisecondsPart).toBe(0);
  });

  it("1 day 2 hours 3 minutes 4 seconds 5ms", () => {
    const ms = 86400000 + 7200000 + 180000 + 4000 + 5;
    const d = Duration.fromMs(ms);
    expect(d.days).toBe(1);
    expect(d.hours).toBe(2);
    expect(d.minutes).toBe(3);
    expect(d.seconds).toBe(4);
    expect(d.millisecondsPart).toBe(5);
  });

  it("negative duration", () => {
    const ms = -(86400000 + 7200000 + 180000 + 4000 + 5);
    const d = Duration.fromMs(ms);
    expect(d.days).toBe(-1);
    expect(d.hours).toBe(2);
    expect(d.minutes).toBe(3);
    expect(d.seconds).toBe(4);
    expect(d.millisecondsPart).toBe(5);
  });
});

// ═══════════════════════════════════════════════════════════════
// Duration — as() conversion
// ═══════════════════════════════════════════════════════════════

describe("Duration.as()", () => {
  it("as millisecond", () => {
    expect(Duration.fromMs(1234).as("millisecond")).toBe(1234);
  });

  it("as second", () => {
    expect(Duration.fromMs(5000).as("second")).toBe(5);
  });

  it("as minute", () => {
    expect(Duration.fromMs(120000).as("minute")).toBe(2);
  });

  it("as hour", () => {
    expect(Duration.fromMs(7200000).as("hour")).toBe(2);
  });

  it("as day", () => {
    expect(Duration.fromMs(172800000).as("day")).toBe(2);
  });

  it("non-time unit → TypeError", () => {
    expect(() => Duration.fromMs(1000).as("year")).toThrow(TypeError);
  });
});

// ═══════════════════════════════════════════════════════════════
// Duration — abs, negate, add, subtract
// ═══════════════════════════════════════════════════════════════

describe("Duration arithmetic", () => {
  it("abs", () => {
    expect(Duration.fromMs(-5000).abs().milliseconds).toBe(5000);
    expect(Duration.fromMs(5000).abs().milliseconds).toBe(5000);
  });

  it("negate", () => {
    expect(Duration.fromMs(5000).negate().milliseconds).toBe(-5000);
    expect(Duration.fromMs(-5000).negate().milliseconds).toBe(5000);
  });

  it("add", () => {
    const a = Duration.fromMs(1000);
    const b = Duration.fromMs(2000);
    expect(a.add(b).milliseconds).toBe(3000);
  });

  it("subtract", () => {
    const a = Duration.fromMs(5000);
    const b = Duration.fromMs(2000);
    expect(a.subtract(b).milliseconds).toBe(3000);
  });
});

// ═══════════════════════════════════════════════════════════════
// Duration — comparison
// ═══════════════════════════════════════════════════════════════

describe("Duration comparison", () => {
  it("lt / lte", () => {
    expect(Duration.fromMs(1).lt(Duration.fromMs(2))).toBe(true);
    expect(Duration.fromMs(1).lte(Duration.fromMs(1))).toBe(true);
    expect(Duration.fromMs(2).lt(Duration.fromMs(1))).toBe(false);
  });

  it("gt / gte", () => {
    expect(Duration.fromMs(2).gt(Duration.fromMs(1))).toBe(true);
    expect(Duration.fromMs(1).gte(Duration.fromMs(1))).toBe(true);
    expect(Duration.fromMs(1).gt(Duration.fromMs(2))).toBe(false);
  });

  it("eq", () => {
    expect(Duration.fromMs(1000).eq(Duration.fromMs(1000))).toBe(true);
    expect(Duration.fromMs(1000).eq(Duration.fromMs(2000))).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════
// Duration — humanize
// ═══════════════════════════════════════════════════════════════

describe("Duration.humanize()", () => {
  it("a few seconds", () => {
    expect(Duration.fromMs(10000).humanize()).toBe("a few seconds");
  });

  it("a minute", () => {
    expect(Duration.fromMs(60000).humanize()).toBe("a minute");
  });

  it("N minutes", () => {
    expect(Duration.fromMs(5 * 60000).humanize()).toBe("5 minutes");
  });

  it("an hour", () => {
    expect(Duration.fromMs(3600000).humanize()).toBe("an hour");
  });

  it("N hours", () => {
    expect(Duration.fromMs(3 * 3600000).humanize()).toBe("3 hours");
  });

  it("a day", () => {
    expect(Duration.fromMs(86400000).humanize()).toBe("a day");
  });

  it("N days", () => {
    expect(Duration.fromMs(5 * 86400000).humanize()).toBe("5 days");
  });

  it("a month", () => {
    expect(Duration.fromMs(30 * 86400000).humanize()).toBe("a month");
  });

  it("N months", () => {
    expect(Duration.fromMs(6 * 30 * 86400000).humanize()).toBe("6 months");
  });

  it("a year", () => {
    expect(Duration.fromMs(365 * 86400000).humanize()).toBe("a year");
  });

  it("N years", () => {
    expect(Duration.fromMs(3 * 365 * 86400000).humanize()).toBe("3 years");
  });
});

describe("Duration.humanizeAgo()", () => {
  it("just now", () => {
    expect(Duration.fromMs(0).humanizeAgo()).toBe("just now");
  });

  it("past", () => {
    expect(Duration.fromMs(-60000).humanizeAgo()).toBe("a minute ago");
  });

  it("future", () => {
    expect(Duration.fromMs(60000).humanizeAgo()).toBe("in a minute");
  });
});

describe("Duration.humanize() Nepali", () => {
  it("a few seconds ne", () => {
    expect(Duration.fromMs(10000).humanize("ne")).toBe("\u0915\u0947\u0939\u0940 \u0938\u0947\u0915\u0923\u094d\u0921");
  });

  it("a minute ne", () => {
    expect(Duration.fromMs(60000).humanize("ne")).toBe("\u090f\u0915 \u092e\u093f\u0928\u091f");
  });

  it("past ne", () => {
    expect(Duration.fromMs(-60000).humanizeAgo("ne")).toBe("\u090f\u0915 \u092e\u093f\u0928\u091f \u092a\u0939\u093f\u0932\u0947");
  });

  it("future ne", () => {
    expect(Duration.fromMs(60000).humanizeAgo("ne")).toBe("\u090f\u0915 \u092e\u093f\u0928\u091f \u092e\u093e");
  });
});

// ═══════════════════════════════════════════════════════════════
// Duration — refreshIntervalMs
// ═══════════════════════════════════════════════════════════════

describe("Duration.refreshIntervalMs()", () => {
  it("under 1 min → 1s", () => {
    expect(Duration.fromMs(30_000).refreshIntervalMs()).toBe(1_000);
  });

  it("under 2 hours → 1m", () => {
    expect(Duration.fromMs(60 * 60_000).refreshIntervalMs()).toBe(60_000);
  });

  it("under 6 hours → 30m", () => {
    expect(Duration.fromMs(4 * 60 * 60_000).refreshIntervalMs()).toBe(30 * 60_000);
  });

  it("under 12 hours → 1h", () => {
    expect(Duration.fromMs(8 * 60 * 60_000).refreshIntervalMs()).toBe(60 * 60_000);
  });

  it("under 1 day → 2h", () => {
    expect(Duration.fromMs(18 * 60 * 60_000).refreshIntervalMs()).toBe(2 * 60 * 60_000);
  });

  it("1+ day → 1 day", () => {
    expect(Duration.fromMs(2 * 24 * 60 * 60_000).refreshIntervalMs()).toBe(24 * 60 * 60_000);
  });
});

// ═══════════════════════════════════════════════════════════════
// Duration — nextDelay (bucket boundary capping)
// ═══════════════════════════════════════════════════════════════

describe("Duration.nextDelay()", () => {
  it("floor is 100ms", () => {
    expect(Duration.nextDelay(0)).toBeGreaterThanOrEqual(100);
  });

  it("under 1 min returns 1s refresh", () => {
    // 59s remaining → bucket interval is 1s
    const delay = Duration.nextDelay(59_000);
    expect(delay).toBe(1_000);
  });

  it("crossing into under 1 min", () => {
    // 61s remaining → bucket is 1m, boundary to under1min is 1s away
    const delay = Duration.nextDelay(61_000);
    expect(delay).toBe(1_000);
  });

  it("crossing into under 2h", () => {
    // 2h+1s remaining → bucket is 1h, boundary to under2h is 1s away
    const delay = Duration.nextDelay(2 * 60 * 60_000 + 1000);
    expect(delay).toBe(1000);
  });

  it("deep in under-2h bucket → 1m refresh", () => {
    // 90 min remaining → in under-2h bucket, 30 min to next boundary
    const delay = Duration.nextDelay(90 * 60_000);
    expect(delay).toBe(60_000); // bucket interval
  });
});

// ═══════════════════════════════════════════════════════════════
// Duration — serialization
// ═══════════════════════════════════════════════════════════════

describe("Duration serialization", () => {
  it("toJSON", () => {
    const d = Duration.fromMs(90061001);
    const json = d.toJSON();
    expect(json.milliseconds).toBe(90061001);
    expect(json.days).toBe(1);
    expect(json.hours).toBe(1);
    expect(json.minutes).toBe(1);
    expect(json.seconds).toBe(1);
  });

  it("toString", () => {
    expect(Duration.fromMs(1234).toString()).toBe("Duration(1234ms)");
  });

  it("valueOf", () => {
    expect(Duration.fromMs(1234).valueOf()).toBe(1234);
  });
});

// ═══════════════════════════════════════════════════════════════
// DinDate — diffNow, fromNow, from
// ═══════════════════════════════════════════════════════════════

describe("DinDate relative time", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-15T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("diffNow returns Duration", () => {
    const d = DinDate.from({ year: 2025, month: 6, day: 15, calendar: "ad" });
    const diff = d.diffNow();
    expect(diff).toBeInstanceOf(Duration);
  });

  it("diffNow with unit", () => {
    // AD 2025-06-15 00:00 Nepal = Jun 14 18:15 UTC
    // Fake time is Jun 15 12:00 UTC = Jun 15 17:45 Nepal
    // Difference: Jun 15 00:00 Nepal - Jun 15 17:45 Nepal = -17h45m = -63900000ms
    const d = DinDate.from({ year: 2025, month: 6, day: 15, calendar: "ad" });
    const diffMin = d.diffNow("minute");
    expect(typeof diffMin).toBe("number");
  });

  it("fromNow returns string", () => {
    // Future date
    const d = DinDate.from({ year: 2025, month: 12, day: 25, calendar: "ad" });
    expect(d.fromNow()).toContain("in");
  });

  it("fromNow past", () => {
    const d = DinDate.from({ year: 2025, month: 1, day: 1, calendar: "ad" });
    expect(d.fromNow()).toContain("ago");
  });

  it("from(other)", () => {
    const a = DinDate.from({ year: 2025, month: 6, day: 20, calendar: "ad" });
    const b = DinDate.from({ year: 2025, month: 6, day: 15, calendar: "ad" });
    expect(a.from(b)).toContain("in");
    expect(b.from(a)).toContain("ago");
  });
});

// ═══════════════════════════════════════════════════════════════
// watchRelative — live updating
// ═══════════════════════════════════════════════════════════════

describe("watchRelative", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-15T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("calls callback immediately", () => {
    const target = DinDate.from({ year: 2025, month: 6, day: 20, calendar: "ad" });
    const cb = vi.fn();
    const cancel = watchRelative(target, cb);
    expect(cb).toHaveBeenCalledTimes(1);
    const [text, duration] = cb.mock.calls[0];
    expect(typeof text).toBe("string");
    expect(duration).toBeInstanceOf(Duration);
    cancel();
  });

  it("updates after refresh interval", () => {
    // Target is ~30s in the future → refresh interval is 1s
    vi.setSystemTime(new Date("2025-06-15T11:59:30Z"));
    const target = new DinDate(Date.UTC(2025, 5, 15, 12, 0, 0, 0)); // Jun 15 12:00 UTC
    const cb = vi.fn();
    const cancel = watchRelative(target, cb);
    expect(cb).toHaveBeenCalledTimes(1);
    // Advance 1 second
    vi.advanceTimersByTime(1000);
    expect(cb).toHaveBeenCalledTimes(2);
    cancel();
  });

  it("cancel stops updates", () => {
    const target = DinDate.from({ year: 2025, month: 12, day: 25, calendar: "ad" });
    const cb = vi.fn();
    const cancel = watchRelative(target, cb);
    expect(cb).toHaveBeenCalledTimes(1);
    cancel();
    vi.advanceTimersByTime(60000);
    expect(cb).toHaveBeenCalledTimes(1); // no more calls
  });
});
