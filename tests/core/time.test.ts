/**
 * Phase 2: Timezone + Time Model Tests
 *
 * All tests use UTC ms directly — no dependency on machine timezone.
 * Tests validate:
 *   1. utcMsToNepalParts ↔ nepalPartsToUtcMs round-trip
 *   2. nepalDateToDayIndex ↔ dayIndexToNepalDate round-trip
 *   3. utcMsToBsDateTime ↔ bsDateTimeToUtcMs round-trip
 *   4. Midnight boundary ±1 min
 *   5. 20+ known AD↔BS fixtures
 *   6. Reference epoch anchor
 */
import { describe, it, expect } from "vitest";
import {
  NEPAL_OFFSET_MS,
  NEPAL_TZ,
  utcMsToNepalParts,
  nepalPartsToUtcMs,
  nepalDateToDayIndex,
  dayIndexToNepalDate,
  utcMsToBsDateTime,
  bsDateTimeToUtcMs,
} from "../../src/core/time";
import { bsToDayIndex, dayIndexToBs } from "../../src/core/day-index";

// ── Constants ──────────────────────────────────────────────────────

describe("Phase 2 constants", () => {
  it("NEPAL_OFFSET_MS = 20700000 (5h45m in ms)", () => {
    expect(NEPAL_OFFSET_MS).toBe(20_700_000);
  });

  it("NEPAL_TZ = 'Asia/Kathmandu'", () => {
    expect(NEPAL_TZ).toBe("Asia/Kathmandu");
  });
});

// ── Reference epoch ────────────────────────────────────────────────

describe("reference epoch anchor", () => {
  it("BS 2000-01-01 = AD 1943-04-14 (Nepal civil date)", () => {
    // At Nepal midnight on AD 1943-04-14, utcMsToNepalParts should return that date
    const bs00DayIdx = bsToDayIndex(2000, 1, 1);
    const nepalDate = dayIndexToNepalDate(bs00DayIdx);
    expect(nepalDate).toEqual({ year: 1943, month: 4, day: 14 });
  });

  it("utcMsToNepalParts for epoch gives 1943-04-14 00:00:00", () => {
    // Compute utcMs for AD 1943-04-14 00:00:00 +0545
    const epochUtcMs =
      Date.UTC(1943, 3, 14, 0, 0, 0, 0) - NEPAL_OFFSET_MS;
    const parts = utcMsToNepalParts(epochUtcMs);
    expect(parts).toEqual({
      year: 1943,
      month: 4,
      day: 14,
      hour: 0,
      minute: 0,
      second: 0,
      ms: 0,
    });
  });
});

// ── utcMsToNepalParts ↔ nepalPartsToUtcMs round-trip ──────────────

describe("utcMs ↔ nepalParts round-trip", () => {
  const testCases = [
    // epoch
    { year: 1943, month: 4, day: 14, hour: 0, minute: 0, second: 0, ms: 0 },
    // mid-day
    { year: 2024, month: 6, day: 15, hour: 12, minute: 30, second: 45, ms: 500 },
    // near midnight
    { year: 2081, month: 8, day: 10, hour: 23, minute: 59, second: 59, ms: 999 },
    // midnight exactly
    { year: 2050, month: 1, day: 1, hour: 0, minute: 0, second: 0, ms: 0 },
    // leap year
    { year: 2024, month: 2, day: 29, hour: 14, minute: 0, second: 0, ms: 0 },
    // year boundary
    { year: 2024, month: 12, day: 31, hour: 23, minute: 59, second: 59, ms: 999 },
    { year: 2025, month: 1, day: 1, hour: 0, minute: 0, second: 0, ms: 0 },
  ];

  for (const tc of testCases) {
    const label = `${tc.year}-${String(tc.month).padStart(2, "0")}-${String(tc.day).padStart(2, "0")} ${tc.hour}:${String(tc.minute).padStart(2, "0")}:${String(tc.second).padStart(2, "0")}.${tc.ms}`;
    it(`round-trip: ${label}`, () => {
      const utcMs = nepalPartsToUtcMs(tc);
      const parts = utcMsToNepalParts(utcMs);
      expect(parts).toEqual(tc);
    });
  }
});

// ── nepalDateToDayIndex ↔ dayIndexToNepalDate round-trip ───────────

describe("nepalDate ↔ dayIndex round-trip", () => {
  it("epoch: AD 1943-04-14 → dayIndex 0", () => {
    expect(nepalDateToDayIndex(1943, 4, 14)).toBe(0);
  });

  it("dayIndex 0 → AD 1943-04-14", () => {
    expect(dayIndexToNepalDate(0)).toEqual({ year: 1943, month: 4, day: 14 });
  });

  it("dayIndex 1 → AD 1943-04-15", () => {
    expect(dayIndexToNepalDate(1)).toEqual({ year: 1943, month: 4, day: 15 });
  });

  const samples = [
    { year: 1943, month: 4, day: 14 },
    { year: 1970, month: 1, day: 1 },
    { year: 2000, month: 1, day: 1 },
    { year: 2024, month: 6, day: 15 },
    { year: 2024, month: 11, day: 26 },
    { year: 2081, month: 8, day: 10 },
    { year: 2089, month: 12, day: 31 },
  ];

  for (const s of samples) {
    it(`round-trip: AD ${s.year}-${s.month}-${s.day}`, () => {
      const idx = nepalDateToDayIndex(s.year, s.month, s.day);
      expect(dayIndexToNepalDate(idx)).toEqual(s);
    });
  }
});

// ── utcMsToBsDateTime ↔ bsDateTimeToUtcMs round-trip ──────────────

describe("utcMs ↔ bsDateTime round-trip", () => {
  const samples = [
    // BS 2000-01-01 00:00:00
    { y: 2000, m: 1, d: 1, h: 0, mi: 0, s: 0, ms: 0 },
    // mid-day
    { y: 2050, m: 6, d: 15, h: 14, mi: 30, s: 0, ms: 0 },
    // near midnight
    { y: 2081, m: 8, d: 10, h: 23, mi: 59, s: 59, ms: 999 },
    // midnight exactly
    { y: 2024, m: 12, d: 30, h: 0, mi: 0, s: 0, ms: 0 },
  ];

  for (const s of samples) {
    it(`round-trip: BS ${s.y}-${s.m}-${s.d} ${s.h}:${s.mi}:${s.s}.${s.ms}`, () => {
      const utcMs = bsDateTimeToUtcMs(s.y, s.m, s.d, s.h, s.mi, s.s, s.ms);
      const bs = utcMsToBsDateTime(utcMs);
      expect(bs).toEqual({
        year: s.y,
        month: s.m,
        day: s.d,
        hour: s.h,
        minute: s.mi,
        second: s.s,
        ms: s.ms,
      });
    });
  }
});

// ── Midnight boundary ±1 min ───────────────────────────────────────

describe("midnight boundary ±1 min", () => {
  // BS 2081-08-11 midnight in Nepal = some UTC time
  // 1 minute before → should still be BS 2081-08-10
  // 1 minute after  → should be BS 2081-08-11

  const midnightNepal = bsDateTimeToUtcMs(2081, 8, 11, 0, 0, 0, 0);

  it("1 minute before midnight → previous BS day", () => {
    const before = utcMsToBsDateTime(midnightNepal - 60_000);
    expect(before.year).toBe(2081);
    expect(before.month).toBe(8);
    expect(before.day).toBe(10);
    expect(before.hour).toBe(23);
    expect(before.minute).toBe(59);
  });

  it("at midnight → current BS day", () => {
    const at = utcMsToBsDateTime(midnightNepal);
    expect(at.year).toBe(2081);
    expect(at.month).toBe(8);
    expect(at.day).toBe(11);
    expect(at.hour).toBe(0);
    expect(at.minute).toBe(0);
  });

  it("1 minute after midnight → current BS day", () => {
    const after = utcMsToBsDateTime(midnightNepal + 60_000);
    expect(after.year).toBe(2081);
    expect(after.month).toBe(8);
    expect(after.day).toBe(11);
    expect(after.hour).toBe(0);
    expect(after.minute).toBe(1);
  });

  // Test multiple midnight boundaries across the range
  const boundaries = [
    { bsY: 2000, bsM: 1, bsD: 2 },   // early range
    { bsY: 2024, bsM: 6, bsD: 1 },   // mid range
    { bsY: 2089, bsM: 12, bsD: 30 }, // end range
  ];

  for (const b of boundaries) {
    it(`midnight boundary BS ${b.bsY}-${b.bsM}-${b.bsD}`, () => {
      const utcMid = bsDateTimeToUtcMs(b.bsY, b.bsM, b.bsD, 0, 0, 0, 0);
      const before = utcMsToBsDateTime(utcMid - 1); // 1 ms before
      const at = utcMsToBsDateTime(utcMid);
      expect(at.day).toBe(b.bsD);
      expect(at.month).toBe(b.bsM);
      expect(at.year).toBe(b.bsY);
      // 1ms before should be previous day
      expect(before.day).toBe(b.bsD - 1 || dayIndexToBs(dayIndexToBs(bsToDayIndex(b.bsY, b.bsM, b.bsD) - 1).year ? bsToDayIndex(b.bsY, b.bsM, b.bsD) - 1 : 0).day);
    });
  }
});

// ── Known AD↔BS fixtures (20+ pairs) ─────────────────────────────

describe("known AD↔BS fixtures", () => {
  // Each fixture: [AD y, AD m, AD d, BS y, BS m, BS d]
  // Nepal midnight on these AD dates should map to these BS dates.
  // All values verified via nepalDateToDayIndex → dayIndexToBs.
  const fixtures: [number, number, number, number, number, number][] = [
    [1943, 4, 14, 2000, 1, 1],    // reference epoch
    [1943, 4, 15, 2000, 1, 2],
    [1944, 4, 14, 2001, 1, 2],    // ~1 year later
    [1970, 1, 1, 2026, 9, 17],    // Unix epoch
    [2000, 1, 1, 2056, 9, 17],    // Y2K
    [2004, 2, 29, 2060, 11, 17],  // leap day
    [2010, 7, 16, 2067, 3, 32],
    [2015, 8, 17, 2072, 4, 32],
    [2018, 8, 11, 2075, 4, 26],
    [2019, 4, 13, 2075, 12, 30],  // end of BS 2075
    [2020, 4, 13, 2077, 1, 1],
    [2021, 4, 14, 2078, 1, 1],
    [2022, 4, 14, 2079, 1, 1],
    [2023, 4, 14, 2080, 1, 1],
    [2024, 4, 13, 2081, 1, 1],    // BS 2081 Baisakh 1
    [2024, 11, 26, 2081, 8, 11],  // known from v3 test
    [2025, 4, 14, 2082, 1, 1],
    [2026, 7, 25, 2083, 4, 9],    // approximately today
    [2030, 12, 31, 2087, 9, 15],
    [2033, 3, 14, 2089, 11, 29],
  ];

  for (const [adY, adM, adD, bsY, bsM, bsD] of fixtures) {
    it(`AD ${adY}-${String(adM).padStart(2, "0")}-${String(adD).padStart(2, "0")} → BS ${bsY}-${bsM}-${bsD}`, () => {
      const utcMs = nepalPartsToUtcMs({ year: adY, month: adM, day: adD, hour: 0, minute: 0, second: 0, ms: 0 });
      const bs = utcMsToBsDateTime(utcMs);
      expect(bs.year).toBe(bsY);
      expect(bs.month).toBe(bsM);
      expect(bs.day).toBe(bsD);
      expect(bs.hour).toBe(0);
    });
  }

  // Same fixtures at 12:00 Nepal time
  for (const [adY, adM, adD, bsY, bsM, bsD] of fixtures) {
    it(`AD ${adY}-${String(adM).padStart(2, "0")}-${String(adD).padStart(2, "0")} 12:00 → BS ${bsY}-${bsM}-${bsD}`, () => {
      const utcMs = nepalPartsToUtcMs({ year: adY, month: adM, day: adD, hour: 12, minute: 0, second: 0, ms: 0 });
      const bs = utcMsToBsDateTime(utcMs);
      expect(bs.year).toBe(bsY);
      expect(bs.month).toBe(bsM);
      expect(bs.day).toBe(bsD);
      expect(bs.hour).toBe(12);
    });
  }
});

// ── Date input preserves instant ───────────────────────────────────

describe("native Date input preserves instant", () => {
  it("utcMsToBsDateTime(Date.now()) matches utcMsToBsDateTime(new Date().getTime())", () => {
    const now = Date.now();
    const bs1 = utcMsToBsDateTime(now);
    const bs2 = utcMsToBsDateTime(new Date().getTime());
    expect(bs1).toEqual(bs2);
  });

  it("UTC ms from Date.UTC matches our nepalPartsToUtcMs", () => {
    // A known UTC instant
    const utcMs = Date.UTC(2024, 5, 15, 6, 30, 0, 0); // 2024-06-15T06:30:00Z
    const nepal = utcMsToNepalParts(utcMs);
    // In Nepal (+05:45), that's 2024-06-15 12:15:00
    expect(nepal.year).toBe(2024);
    expect(nepal.month).toBe(6);
    expect(nepal.day).toBe(15);
    expect(nepal.hour).toBe(12);
    expect(nepal.minute).toBe(15);
  });
});

// ── Sanity: no DST, fixed offset ───────────────────────────────────

describe("fixed offset (no DST)", () => {
  it("summer and winter offsets are both +05:45", () => {
    // January (winter)
    const janUtcMs = Date.UTC(2024, 0, 15, 0, 0, 0, 0); // 2024-01-15T00:00Z
    const janNepal = utcMsToNepalParts(janUtcMs);
    expect(janNepal.hour).toBe(5);
    expect(janNepal.minute).toBe(45);

    // July (summer)
    const julUtcMs = Date.UTC(2024, 6, 15, 0, 0, 0, 0); // 2024-07-15T00:00Z
    const julNepal = utcMsToNepalParts(julUtcMs);
    expect(julNepal.hour).toBe(5);
    expect(julNepal.minute).toBe(45);
  });
});
