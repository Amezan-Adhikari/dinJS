/**
 * Exhaustive tests for bsToDayIndex / dayIndexToBs.
 *
 * Validates O(1) implementation against O(n) brute-force oracle
 * for the ENTIRE supported range (BS 2000–2089).
 */
import { describe, it, expect } from "vitest";
import {
  bsToDayIndex,
  dayIndexToBs,
  getDaysInBsMonth,
  isValidBsDate,
  TOTAL_DAYS,
} from "../../src/core/day-index";
import {
  DAYS_IN_MONTH,
  BS_YEAR_START,
  BS_YEAR_COUNT,
  MONTHS_IN_YEAR,
} from "../../src/core/calendar-data";
import { CUM_DAYS_BEFORE_YEAR, DAYS_IN_YEAR } from "../../src/core/cumulative";
import { oracleBsToDayIndex, oracleDayIndexToBs } from "./oracle";

describe("cumulative tables", () => {
  it("CUM_DAYS_BEFORE_YEAR[0] = 0", () => {
    expect(CUM_DAYS_BEFORE_YEAR[0]).toBe(0);
  });

  it("CUM_DAYS_BEFORE_YEAR is monotonically increasing", () => {
    for (let i = 1; i < CUM_DAYS_BEFORE_YEAR.length; i++) {
      expect(CUM_DAYS_BEFORE_YEAR[i]).toBeGreaterThan(CUM_DAYS_BEFORE_YEAR[i - 1]);
    }
  });

  it("DAYS_IN_YEAR values are in valid BS range (354–384)", () => {
    // BS years can have 354-384 days depending on month lengths
    for (let i = 0; i < DAYS_IN_YEAR.length; i++) {
      expect(DAYS_IN_YEAR[i]).toBeGreaterThanOrEqual(354);
      expect(DAYS_IN_YEAR[i]).toBeLessThanOrEqual(384);
    }
  });

  it("every year has exactly 12 months with valid day counts", () => {
    for (let y = 0; y < BS_YEAR_COUNT; y++) {
      expect(DAYS_IN_MONTH[y].length).toBe(MONTHS_IN_YEAR);
      for (let m = 0; m < MONTHS_IN_YEAR; m++) {
        expect(DAYS_IN_MONTH[y][m]).toBeGreaterThanOrEqual(29);
        expect(DAYS_IN_MONTH[y][m]).toBeLessThanOrEqual(32);
      }
    }
  });
});

describe("bsToDayIndex", () => {
  it("BS 2000-01-01 → 0", () => {
    expect(bsToDayIndex(2000, 1, 1)).toBe(0);
  });

  it("BS 2000-01-02 → 1", () => {
    expect(bsToDayIndex(2000, 1, 2)).toBe(1);
  });

  it("BS 2001-01-01 = daysInYear[2000]", () => {
    const daysIn2000 = DAYS_IN_MONTH[0].reduce((s, d) => s + d, 0);
    expect(bsToDayIndex(2001, 1, 1)).toBe(daysIn2000);
  });

  it("throws for year out of range", () => {
    expect(() => bsToDayIndex(1999, 1, 1)).toThrow();
    expect(() => bsToDayIndex(2090, 1, 1)).toThrow();
  });

  it("throws for month out of range", () => {
    expect(() => bsToDayIndex(2000, 0, 1)).toThrow();
    expect(() => bsToDayIndex(2000, 13, 1)).toThrow();
  });

  it("throws for day out of range", () => {
    expect(() => bsToDayIndex(2000, 1, 0)).toThrow();
    expect(() => bsToDayIndex(2000, 1, 31)).toThrow(); // Baisakh 2000 has 30 days
  });
});

describe("dayIndexToBs", () => {
  it("0 → BS 2000-01-01", () => {
    expect(dayIndexToBs(0)).toEqual({ year: 2000, month: 1, day: 1 });
  });

  it("1 → BS 2000-01-02", () => {
    expect(dayIndexToBs(1)).toEqual({ year: 2000, month: 1, day: 2 });
  });

  it("throws for negative index", () => {
    expect(() => dayIndexToBs(-1)).toThrow();
  });

  it("throws for index >= TOTAL_DAYS", () => {
    expect(() => dayIndexToBs(TOTAL_DAYS)).toThrow();
  });
});

describe("round-trip: bsToDayIndex ↔ dayIndexToBs", () => {
  it("first day", () => {
    const bs = { year: 2000, month: 1, day: 1 };
    expect(dayIndexToBs(bsToDayIndex(bs.year, bs.month, bs.day))).toEqual(bs);
  });

  it("last valid day", () => {
    const lastMonth = 12;
    const lastDay = DAYS_IN_MONTH[BS_YEAR_COUNT - 1][lastMonth - 1];
    const bs = { year: BS_YEAR_START + BS_YEAR_COUNT - 1, month: lastMonth, day: lastDay };
    expect(dayIndexToBs(bsToDayIndex(bs.year, bs.month, bs.day))).toEqual(bs);
  });

  it("sample dates across range", () => {
    const samples = [
      { year: 2000, month: 1, day: 1 },
      { year: 2000, month: 6, day: 15 },
      { year: 2000, month: 12, day: 30 },
      { year: 2020, month: 4, day: 10 },
      { year: 2050, month: 8, day: 20 },
      { year: 2081, month: 8, day: 10 },
      { year: 2087, month: 3, day: 15 },
      { year: 2089, month: 12, day: 30 },
    ];
    for (const bs of samples) {
      const idx = bsToDayIndex(bs.year, bs.month, bs.day);
      expect(dayIndexToBs(idx)).toEqual(bs);
    }
  });
});

describe("EXHAUSTIVE: every valid BS date ↔ dayIndex (oracle comparison)", () => {
  for (let yi = 0; yi < BS_YEAR_COUNT; yi++) {
    const year = BS_YEAR_START + yi;
    describe(`BS ${year}`, () => {
      for (let m = 1; m <= MONTHS_IN_YEAR; m++) {
        const maxDay = DAYS_IN_MONTH[yi][m - 1];
        for (let d = 1; d <= maxDay; d++) {
          it(`${year}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`, () => {
            // O(1) implementation
            const fastIndex = bsToDayIndex(year, m, d);
            const fastBs = dayIndexToBs(fastIndex);

            // Oracle (brute-force)
            const oracleIndex = oracleBsToDayIndex(year, m, d);
            const oracleBs = oracleDayIndexToBs(oracleIndex);

            // They must match
            expect(fastIndex).toBe(oracleIndex);
            expect(fastBs).toEqual(oracleBs);
            expect(fastBs).toEqual({ year, month: m, day: d });
          });
        }
      }
    });
  }
});

describe("getDaysInBsMonth", () => {
  it("returns correct day count for Baisakh 2000", () => {
    expect(getDaysInBsMonth(2000, 1)).toBe(DAYS_IN_MONTH[0][0]);
  });

  it("throws for invalid year", () => {
    expect(() => getDaysInBsMonth(1999, 1)).toThrow();
  });

  it("throws for invalid month", () => {
    expect(() => getDaysInBsMonth(2000, 0)).toThrow();
    expect(() => getDaysInBsMonth(2000, 13)).toThrow();
  });
});

describe("isValidBsDate", () => {
  it("valid dates return true", () => {
    expect(isValidBsDate(2000, 1, 1)).toBe(true);
    expect(isValidBsDate(2089, 12, 30)).toBe(true);
  });

  it("invalid dates return false", () => {
    expect(isValidBsDate(1999, 1, 1)).toBe(false);
    expect(isValidBsDate(2000, 0, 1)).toBe(false);
    expect(isValidBsDate(2000, 1, 0)).toBe(false);
    expect(isValidBsDate(2000, 1, 31)).toBe(false); // Baisakh 2000 has 30 days
  });
});
