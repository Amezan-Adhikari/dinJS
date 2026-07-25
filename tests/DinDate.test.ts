import { describe, it, expect } from "vitest";
import { DinDate } from "../src/DinDate";
import { dinjs } from "../src/dinjs";
import { bsDateTimeToUtcMs, utcMsToBsDateTime, NEPAL_OFFSET_MS } from "../src/core/time";
import { bsToDayIndex, dayIndexToBs, getDaysInBsMonth } from "../src/core/day-index";

// ── Helpers ─────────────────────────────────────────────────────

/** Get the UTC ms at Nepal midnight on a given AD date. */
function nepalMidnightUtcMs(y: number, m: number, d: number): number {
  const wallMs = Date.UTC(y, m - 1, d, 0, 0, 0, 0);
  return wallMs - NEPAL_OFFSET_MS;
}

// ═══════════════════════════════════════════════════════════════
// DinDate — Construction
// ═══════════════════════════════════════════════════════════════

describe("DinDate construction", () => {
  it("default constructor → now", () => {
    const before = Date.now();
    const d = new DinDate();
    const after = Date.now();
    expect(d.valueOf()).toBeGreaterThanOrEqual(before);
    expect(d.valueOf()).toBeLessThanOrEqual(after);
  });

  it("constructor from utcMs", () => {
    const ms = nepalMidnightUtcMs(2024, 11, 26);
    const d = new DinDate(ms);
    expect(d.valueOf()).toBe(ms);
  });

  it("constructor from Date", () => {
    const date = new Date(2024, 10, 26, 0, 0, 0, 0); // Nov 26 2024 UTC
    const d = new DinDate(date);
    expect(d.valueOf()).toBe(date.getTime());
  });

  it("DinDate.from BS → correct utcMs", () => {
    // BS 2081-08-11 = Nov 26 2024 in Nepal
    const expected = nepalMidnightUtcMs(2024, 11, 26);
    const d = DinDate.from({ year: 2081, month: 8, day: 11, calendar: "bs" });
    expect(d.valueOf()).toBe(expected);
  });

  it("DinDate.from AD → correct utcMs", () => {
    const expected = nepalMidnightUtcMs(2024, 11, 26);
    const d = DinDate.from({ year: 2024, month: 11, day: 26, calendar: "ad" });
    expect(d.valueOf()).toBe(expected);
  });

  it("DinDate.from with time", () => {
    // BS 2081-08-11 14:30:00
    const bsDt = { year: 2081, month: 8, day: 11, hour: 14, minute: 30, second: 0, ms: 0, calendar: "bs" as const };
    const d = DinDate.from(bsDt);
    const bs = d.bs();
    expect(bs.hour).toBe(14);
    expect(bs.minute).toBe(30);
  });

  it("DinDate.from invalid BS date → RangeError", () => {
    expect(() => DinDate.from({ year: 2081, month: 13, day: 1, calendar: "bs" })).toThrow(RangeError);
  });

  it("DinDate.from invalid BS day → RangeError", () => {
    // BS 2081-02 (Jestha) has 32 days, so 33 is invalid
    expect(() => DinDate.from({ year: 2081, month: 2, day: 33, calendar: "bs" })).toThrow(RangeError);
  });

  it("DinDate.from invalid AD year → RangeError", () => {
    expect(() => DinDate.from({ year: 0, month: 1, day: 1, calendar: "ad" })).toThrow(RangeError);
  });
});

// ═══════════════════════════════════════════════════════════════
// DinDate — BS getters
// ═══════════════════════════════════════════════════════════════

describe("DinDate BS accessors", () => {
  it("BS 2081-08-11 → bsYear/bsMonth/bsDate", () => {
    const d = DinDate.from({ year: 2081, month: 8, day: 11, calendar: "bs" });
    expect(d.bsYear()).toBe(2081);
    expect(d.bsMonth()).toBe(8);
    expect(d.bsDate()).toBe(11);
  });

  it("BS 2000-01-01 → bsYear/bsMonth/bsDate", () => {
    const d = DinDate.from({ year: 2000, month: 1, day: 1, calendar: "bs" });
    expect(d.bsYear()).toBe(2000);
    expect(d.bsMonth()).toBe(1);
    expect(d.bsDate()).toBe(1);
  });

  it("bs() returns full decomposition", () => {
    const d = DinDate.from({ year: 2081, month: 8, day: 11, hour: 14, minute: 30, second: 45, ms: 123, calendar: "bs" });
    const bs = d.bs();
    expect(bs).toEqual({ year: 2081, month: 8, day: 11, hour: 14, minute: 30, second: 45, ms: 123 });
  });

  it("ad() returns Nepal civil date+time", () => {
    const d = DinDate.from({ year: 2081, month: 8, day: 11, calendar: "bs" });
    const ad = d.ad();
    expect(ad.year).toBe(2024);
    expect(ad.month).toBe(11);
    expect(ad.day).toBe(26);
  });

  it("monthName en", () => {
    const d = DinDate.from({ year: 2081, month: 8, day: 11, calendar: "bs" });
    expect(d.monthName("en")).toBe("Mangsir");
  });

  it("monthName ne", () => {
    const d = DinDate.from({ year: 2081, month: 1, day: 1, calendar: "bs" });
    expect(d.monthName("ne")).toBe("\u0935\u0948\u0936\u093e\u0916");
  });
});

// ═══════════════════════════════════════════════════════════════
// DinDate — Date-like getters (AD Nepal wall)
// ═══════════════════════════════════════════════════════════════

describe("DinDate AD getters", () => {
  it("getFullYear / getMonth / getDate", () => {
    const d = DinDate.from({ year: 2081, month: 8, day: 11, calendar: "bs" });
    expect(d.getFullYear()).toBe(2024);
    expect(d.getMonth()).toBe(10); // 0-based (November)
    expect(d.getDate()).toBe(26);
  });

  it("getHours / getMinutes / getSeconds / getMilliseconds", () => {
    const d = DinDate.from({ year: 2081, month: 8, day: 11, hour: 14, minute: 30, second: 45, ms: 123, calendar: "bs" });
    expect(d.getHours()).toBe(14);
    expect(d.getMinutes()).toBe(30);
    expect(d.getSeconds()).toBe(45);
    expect(d.getMilliseconds()).toBe(123);
  });

  it("getDay → weekday", () => {
    // Nov 26 2024 is Tuesday = 2 (0=Sun)
    const d = DinDate.from({ year: 2081, month: 8, day: 11, calendar: "bs" });
    expect(d.getDay()).toBe(2);
  });
});

// ═══════════════════════════════════════════════════════════════
// DinDate — Conversions
// ═══════════════════════════════════════════════════════════════

describe("DinDate conversions", () => {
  it("valueOf returns utcMs", () => {
    const ms = nepalMidnightUtcMs(2024, 11, 26);
    const d = new DinDate(ms);
    expect(d.valueOf()).toBe(ms);
  });

  it("toDate returns native Date", () => {
    const ms = nepalMidnightUtcMs(2024, 11, 26);
    const d = new DinDate(ms);
    const native = d.toDate();
    expect(native).toBeInstanceOf(Date);
    expect(native.getTime()).toBe(ms);
  });

  it("toISOString", () => {
    const ms = nepalMidnightUtcMs(2024, 11, 26);
    const d = new DinDate(ms);
    expect(d.toISOString()).toBe(new Date(ms).toISOString());
  });

  it("toString → ISO string", () => {
    const ms = nepalMidnightUtcMs(2024, 11, 26);
    const d = new DinDate(ms);
    expect(d.toString()).toBe(new Date(ms).toISOString());
  });

  it("toJSON → ISO string", () => {
    const ms = nepalMidnightUtcMs(2024, 11, 26);
    const d = new DinDate(ms);
    expect(d.toJSON()).toBe(new Date(ms).toISOString());
  });
});

// ═══════════════════════════════════════════════════════════════
// DinDate — Immutable arithmetic: add
// ═══════════════════════════════════════════════════════════════

describe("DinDate.add", () => {
  it("add days → new instance, original unchanged", () => {
    const d = DinDate.from({ year: 2081, month: 8, day: 11, calendar: "bs" });
    const d2 = d.add(5, "day");
    expect(d2.bsDate()).toBe(16);
    expect(d.bsDate()).toBe(11); // original unchanged
  });

  it("add 1 month across month boundary", () => {
    // BS 2081-05-15 (Shrawan 15) + 1 month → BS 2081-06-15 (Bhadra 15)
    const d = DinDate.from({ year: 2081, month: 5, day: 15, calendar: "bs" });
    const d2 = d.add(1, "month");
    expect(d2.bsMonth()).toBe(6);
    expect(d2.bsDate()).toBe(15);
  });

  it("add months with day clamp", () => {
    // BS 2081-04-32 (Shrawan 32, max 32) + 1 month → Bhadra 31 (max 31)
    const d = DinDate.from({ year: 2081, month: 4, day: 32, calendar: "bs" });
    const d2 = d.add(1, "month");
    expect(d2.bsMonth()).toBe(5);
    expect(d2.bsDate()).toBe(31); // clamped to Bhadra max
  });

  it("add 1 year", () => {
    const d = DinDate.from({ year: 2081, month: 8, day: 11, calendar: "bs" });
    const d2 = d.add(1, "year");
    expect(d2.bsYear()).toBe(2082);
    expect(d2.bsMonth()).toBe(8);
    expect(d2.bsDate()).toBe(11);
  });

  it("add years with day clamp", () => {
    // BS 2081-12-30 (Chaitra 30) + 1 year → BS 2082-12-30 (Chaitra has 30 in 2082)
    const d = DinDate.from({ year: 2081, month: 12, day: 30, calendar: "bs" });
    const d2 = d.add(1, "year");
    expect(d2.bsYear()).toBe(2082);
    expect(d2.bsMonth()).toBe(12);
  });

  it("add hours", () => {
    const d = DinDate.from({ year: 2081, month: 8, day: 11, hour: 10, calendar: "bs" });
    const d2 = d.add(5, "hour");
    expect(d2.bsHour()).toBe(15);
  });

  it("add minutes", () => {
    const d = DinDate.from({ year: 2081, month: 8, day: 11, hour: 10, minute: 30, calendar: "bs" });
    const d2 = d.add(45, "minute");
    expect(d2.bsHour()).toBe(11);
    expect(d2.bsMinute()).toBe(15);
  });

  it("add with object map", () => {
    const d = DinDate.from({ year: 2081, month: 8, day: 11, calendar: "bs" });
    const d2 = d.add({ years: 1, months: 2, days: 3 });
    expect(d2.bsYear()).toBe(2082);
    expect(d2.bsMonth()).toBe(10);
    expect(d2.bsDate()).toBe(14);
  });

  it("add zero → same value", () => {
    const d = DinDate.from({ year: 2081, month: 8, day: 11, calendar: "bs" });
    const d2 = d.add(0, "day");
    expect(d2.valueOf()).toBe(d.valueOf());
  });
});

// ═══════════════════════════════════════════════════════════════
// DinDate — Immutable arithmetic: subtract
// ═══════════════════════════════════════════════════════════════

describe("DinDate.subtract", () => {
  it("subtract days", () => {
    const d = DinDate.from({ year: 2081, month: 8, day: 11, calendar: "bs" });
    const d2 = d.subtract(5, "day");
    expect(d2.bsDate()).toBe(6);
  });

  it("subtract months", () => {
    const d = DinDate.from({ year: 2081, month: 8, day: 11, calendar: "bs" });
    const d2 = d.subtract(1, "month");
    expect(d2.bsMonth()).toBe(7);
    expect(d2.bsDate()).toBe(11);
  });

  it("subtract years", () => {
    const d = DinDate.from({ year: 2081, month: 8, day: 11, calendar: "bs" });
    const d2 = d.subtract(1, "year");
    expect(d2.bsYear()).toBe(2080);
  });

  it("subtract with object map", () => {
    const d = DinDate.from({ year: 2082, month: 10, day: 14, calendar: "bs" });
    const d2 = d.subtract({ years: 1, months: 2, days: 3 });
    expect(d2.bsYear()).toBe(2081);
    expect(d2.bsMonth()).toBe(8);
    expect(d2.bsDate()).toBe(11);
  });
});

// ═══════════════════════════════════════════════════════════════
// DinDate — set
// ═══════════════════════════════════════════════════════════════

describe("DinDate.set", () => {
  it("set year", () => {
    const d = DinDate.from({ year: 2081, month: 8, day: 11, calendar: "bs" });
    const d2 = d.set("year", 2085);
    expect(d2.bsYear()).toBe(2085);
    expect(d2.bsMonth()).toBe(8);
    expect(d2.bsDate()).toBe(11);
  });

  it("set month with clamp", () => {
    // BS 2081-04-32 (Shrawan 32) → set month 5 (Bhadra, max 31)
    const d = DinDate.from({ year: 2081, month: 4, day: 32, calendar: "bs" });
    const d2 = d.set("month", 5);
    expect(d2.bsMonth()).toBe(5);
    expect(d2.bsDate()).toBe(31); // clamped
  });

  it("set day", () => {
    const d = DinDate.from({ year: 2081, month: 8, day: 11, calendar: "bs" });
    const d2 = d.set("day", 20);
    expect(d2.bsDate()).toBe(20);
  });

  it("set day out of range → RangeError", () => {
    const d = DinDate.from({ year: 2081, month: 8, day: 11, calendar: "bs" });
    expect(() => d.set("day", 32)).toThrow(RangeError);
  });

  it("set hour", () => {
    const d = DinDate.from({ year: 2081, month: 8, day: 11, hour: 10, calendar: "bs" });
    const d2 = d.set("hour", 22);
    expect(d2.bsHour()).toBe(22);
  });

  it("set minute", () => {
    const d = DinDate.from({ year: 2081, month: 8, day: 11, hour: 10, minute: 30, calendar: "bs" });
    const d2 = d.set("minute", 45);
    expect(d2.bsMinute()).toBe(45);
  });

  it("set second", () => {
    const d = DinDate.from({ year: 2081, month: 8, day: 11, hour: 10, minute: 30, second: 0, calendar: "bs" });
    const d2 = d.set("second", 59);
    expect(d2.bsSecond()).toBe(59);
  });

  it("set millisecond", () => {
    const d = DinDate.from({ year: 2081, month: 8, day: 11, hour: 10, ms: 0, calendar: "bs" });
    const d2 = d.set("millisecond", 999);
    expect(d2.bsMs()).toBe(999);
  });

  it("set preserves other fields", () => {
    const d = DinDate.from({ year: 2081, month: 8, day: 11, hour: 14, minute: 30, second: 45, ms: 123, calendar: "bs" });
    const d2 = d.set("day", 20);
    expect(d2.bsHour()).toBe(14);
    expect(d2.bsMinute()).toBe(30);
    expect(d2.bsSecond()).toBe(45);
    expect(d2.bsMs()).toBe(123);
  });

  it("set returns new instance", () => {
    const d = DinDate.from({ year: 2081, month: 8, day: 11, calendar: "bs" });
    const d2 = d.set("day", 20);
    expect(d2).not.toBe(d);
    expect(d.bsDate()).toBe(11);
  });
});

// ═══════════════════════════════════════════════════════════════
// DinDate — diff
// ═══════════════════════════════════════════════════════════════

describe("DinDate.diff", () => {
  it("diff same instant → 0", () => {
    const d = DinDate.from({ year: 2081, month: 8, day: 11, calendar: "bs" });
    expect(d.diff(d, "day")).toBe(0);
    expect(d.diff(d, "millisecond")).toBe(0);
  });

  it("diff days", () => {
    const d1 = DinDate.from({ year: 2081, month: 8, day: 11, calendar: "bs" });
    const d2 = DinDate.from({ year: 2081, month: 8, day: 16, calendar: "bs" });
    expect(d1.diff(d2, "day")).toBe(-5);
    expect(d2.diff(d1, "day")).toBe(5);
  });

  it("diff months", () => {
    const d1 = DinDate.from({ year: 2081, month: 8, day: 11, calendar: "bs" });
    const d2 = DinDate.from({ year: 2081, month: 10, day: 11, calendar: "bs" });
    expect(d1.diff(d2, "month")).toBe(-2);
    expect(d2.diff(d1, "month")).toBe(2);
  });

  it("diff years", () => {
    const d1 = DinDate.from({ year: 2081, month: 8, day: 11, calendar: "bs" });
    const d2 = DinDate.from({ year: 2085, month: 8, day: 11, calendar: "bs" });
    expect(d1.diff(d2, "year")).toBe(-4);
    expect(d2.diff(d1, "year")).toBe(4);
  });

  it("diff hours", () => {
    const d1 = DinDate.from({ year: 2081, month: 8, day: 11, hour: 10, calendar: "bs" });
    const d2 = DinDate.from({ year: 2081, month: 8, day: 11, hour: 15, calendar: "bs" });
    expect(d1.diff(d2, "hour")).toBe(-5);
  });

  it("diff milliseconds", () => {
    const d1 = new DinDate(1000);
    const d2 = new DinDate(3500);
    expect(d1.diff(d2, "millisecond")).toBe(-2500);
  });

  it("full diff result", () => {
    const d1 = DinDate.from({ year: 2081, month: 8, day: 11, hour: 14, minute: 30, second: 45, ms: 0, calendar: "bs" });
    const d2 = DinDate.from({ year: 2081, month: 8, day: 11, hour: 10, minute: 15, second: 30, ms: 500, calendar: "bs" });
    const diff = d1.diff(d2);
    expect(diff.hours).toBe(4);
    expect(diff.minutes).toBe(15);
    expect(diff.seconds).toBe(14);
    expect(diff.milliseconds).toBe(500);
  });
});

// ═══════════════════════════════════════════════════════════════
// DinDate — format
// ═══════════════════════════════════════════════════════════════

describe("DinDate.format", () => {
  it("format AD date", () => {
    const d = DinDate.from({ year: 2024, month: 11, day: 26, hour: 14, minute: 30, second: 45, ms: 123, calendar: "ad" });
    expect(d.format("YYYY-MM-DD")).toBe("2024-11-26");
    expect(d.format("DD/MM/YYYY")).toBe("26/11/2024");
    expect(d.format("HH:mm:ss")).toBe("14:30:45");
    expect(d.format("HH:mm:ss.SSS")).toBe("14:30:45.123");
  });

  it("format BS date with BS marker", () => {
    const d = DinDate.from({ year: 2081, month: 8, day: 11, calendar: "bs" });
    expect(d.format("BS-YYYY-MM-DD")).toBe("BS-2081-08-11");
  });

  it("format with literals in brackets", () => {
    const d = DinDate.from({ year: 2024, month: 11, day: 26, calendar: "ad" });
    expect(d.format("[Today is] YYYY-MM-DD")).toBe("Today is 2024-11-26");
  });

  it("format time only", () => {
    const d = DinDate.from({ year: 2081, month: 8, day: 11, hour: 14, minute: 30, second: 45, ms: 123, calendar: "bs" });
    expect(d.format("HH:mm:ss.SSS")).toBe("14:30:45.123");
  });

  it("format YY", () => {
    const d = DinDate.from({ year: 2024, month: 11, day: 26, calendar: "ad" });
    expect(d.format("YY-MM-DD")).toBe("24-11-26");
  });
});

// ═══════════════════════════════════════════════════════════════
// DinDate — factory dinjs()
// ═══════════════════════════════════════════════════════════════

describe("dinjs() factory", () => {
  it("dinjs() → now", () => {
    const before = Date.now();
    const d = dinjs();
    const after = Date.now();
    expect(d.valueOf()).toBeGreaterThanOrEqual(before);
    expect(d.valueOf()).toBeLessThanOrEqual(after);
  });

  it("dinjs(date) → from native Date", () => {
    const date = new Date(2024, 10, 26);
    const d = dinjs(date);
    expect(d.valueOf()).toBe(date.getTime());
  });

  it("dinjs(utcMs)", () => {
    const ms = nepalMidnightUtcMs(2024, 11, 26);
    const d = dinjs(ms);
    expect(d.valueOf()).toBe(ms);
  });

  it("dinjs(str, format) → parse AD string", () => {
    const d = dinjs("2024-11-26", "YYYY-MM-DD");
    expect(d.getFullYear()).toBe(2024);
    expect(d.getMonth()).toBe(10);
    expect(d.getDate()).toBe(26);
  });

  it("dinjs(str, format, { bs: true }) → parse BS string", () => {
    const d = dinjs("2081-08-11", "YYYY-MM-DD", { bs: true });
    expect(d.bsYear()).toBe(2081);
    expect(d.bsMonth()).toBe(8);
    expect(d.bsDate()).toBe(11);
  });

  it("dinjs(str, format) → parse with time", () => {
    const d = dinjs("2024-11-26 14:30", "YYYY-MM-DD HH:mm");
    expect(d.getHours()).toBe(14);
    expect(d.getMinutes()).toBe(30);
  });

  it("dinjs() with invalid args → throws", () => {
    expect(() => (dinjs as any)(true)).toThrow(TypeError);
  });
});

// ═══════════════════════════════════════════════════════════════
// DinDate — immutability guarantee
// ═══════════════════════════════════════════════════════════════

describe("DinDate immutability", () => {
  it("add does not mutate original", () => {
    const d = DinDate.from({ year: 2081, month: 8, day: 11, calendar: "bs" });
    const orig = d.valueOf();
    d.add(10, "day");
    d.add(1, "month");
    d.add(1, "year");
    expect(d.valueOf()).toBe(orig);
  });

  it("subtract does not mutate original", () => {
    const d = DinDate.from({ year: 2081, month: 8, day: 11, calendar: "bs" });
    const orig = d.valueOf();
    d.subtract(10, "day");
    d.subtract(1, "month");
    expect(d.valueOf()).toBe(orig);
  });

  it("set does not mutate original", () => {
    const d = DinDate.from({ year: 2081, month: 8, day: 11, calendar: "bs" });
    const orig = d.valueOf();
    d.set("day", 20);
    d.set("month", 1);
    expect(d.valueOf()).toBe(orig);
  });

  it("bs() returns a copy", () => {
    const d = DinDate.from({ year: 2081, month: 8, day: 11, calendar: "bs" });
    const bs1 = d.bs();
    const bs2 = d.bs();
    expect(bs1).not.toBe(bs2);
    expect(bs1).toEqual(bs2);
  });

  it("ad() returns a copy", () => {
    const d = DinDate.from({ year: 2081, month: 8, day: 11, calendar: "bs" });
    const ad1 = d.ad();
    const ad2 = d.ad();
    expect(ad1).not.toBe(ad2);
    expect(ad1).toEqual(ad2);
  });

  it("all operations return new DinDate instances", () => {
    const d = DinDate.from({ year: 2081, month: 8, day: 11, calendar: "bs" });
    expect(d.add(1, "day")).not.toBe(d);
    expect(d.subtract(1, "day")).not.toBe(d);
    expect(d.set("day", 20)).not.toBe(d);
  });
});

// ═══════════════════════════════════════════════════════════════
// DinDate — round-trip: BS → DinDate → BS
// ═══════════════════════════════════════════════════════════════

describe("DinDate BS round-trip", () => {
  const bsDates: [number, number, number][] = [
    [2000, 1, 1],
    [2000, 1, 30],
    [2000, 12, 31],
    [2081, 8, 11],
    [2081, 2, 32],
    [2081, 6, 30],
    [2089, 12, 30],
  ];

  for (const [y, m, d] of bsDates) {
    it(`BS ${y}-${m}-${d} round-trip`, () => {
      const dinDate = DinDate.from({ year: y, month: m, day: d, calendar: "bs" });
      expect(dinDate.bsYear()).toBe(y);
      expect(dinDate.bsMonth()).toBe(m);
      expect(dinDate.bsDate()).toBe(d);
    });
  }
});

// ═══════════════════════════════════════════════════════════════
// DinDate — round-trip: AD → DinDate → AD
// ═══════════════════════════════════════════════════════════════

describe("DinDate AD round-trip", () => {
  const adDates: [number, number, number][] = [
    [1943, 4, 14],
    [2000, 1, 1],
    [2024, 11, 26],
    [2024, 12, 31],
    [1970, 1, 1],
  ];

  for (const [y, m, d] of adDates) {
    it(`AD ${y}-${m}-${d} round-trip`, () => {
      const dinDate = DinDate.from({ year: y, month: m, day: d, calendar: "ad" });
      expect(dinDate.getFullYear()).toBe(y);
      expect(dinDate.getMonth()).toBe(m - 1);
      expect(dinDate.getDate()).toBe(d);
    });
  }
});

// ═══════════════════════════════════════════════════════════════
// DinDate — edge cases
// ═══════════════════════════════════════════════════════════════

describe("DinDate edge cases", () => {
  it("add negative days via subtract", () => {
    const d = DinDate.from({ year: 2081, month: 1, day: 5, calendar: "bs" });
    const d2 = d.subtract(10, "day");
    // BS 2081-01-05 - 10 days → BS 2080-12-25 (Chaitra 25)
    expect(d2.bsYear()).toBe(2080);
    expect(d2.bsMonth()).toBe(12);
    expect(d2.bsDate()).toBe(25);
  });

  it("add large number of days", () => {
    const d = DinDate.from({ year: 2000, month: 1, day: 1, calendar: "bs" });
    const d2 = d.add(32872, "day"); // total days in range
    // Should be near the end of BS range
    expect(d2.bsYear()).toBeGreaterThanOrEqual(2089);
  });

  it("add months crossing year boundary", () => {
    const d = DinDate.from({ year: 2081, month: 11, day: 15, calendar: "bs" });
    const d2 = d.add(3, "month");
    // 11 + 3 = 14 → 14 - 12 = 2, year + 1
    expect(d2.bsYear()).toBe(2082);
    expect(d2.bsMonth()).toBe(2);
    expect(d2.bsDate()).toBe(15);
  });

  it("subtract months crossing year boundary", () => {
    const d = DinDate.from({ year: 2081, month: 2, day: 15, calendar: "bs" });
    const d2 = d.subtract(3, "month");
    // 2 - 3 = -1 → -1 + 12 = 11, year - 1
    expect(d2.bsYear()).toBe(2080);
    expect(d2.bsMonth()).toBe(11);
    expect(d2.bsDate()).toBe(15);
  });

  it("diff across month boundary", () => {
    const d1 = DinDate.from({ year: 2081, month: 1, day: 30, calendar: "bs" });
    const d2 = DinDate.from({ year: 2081, month: 2, day: 1, calendar: "bs" });
    const diffMs = d2.valueOf() - d1.valueOf();
    expect(diffMs).toBeGreaterThan(0);
  });
});
