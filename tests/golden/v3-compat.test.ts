/**
 * DinJS v3 Golden Tests
 *
 * These tests freeze the CURRENT public behavior of v3, including bugs.
 * They serve as a regression baseline when v4 rewrites internals.
 * BUG annotations mark failures to be fixed in v4.
 *
 * Run: npm test
 */
import { describe, it, expect } from "vitest";
import { dinjs } from "../../src/index";

describe("dinjs v3 constructor", () => {
  it("creates instance with default args (today in BS)", () => {
    const d = new dinjs();
    expect(typeof d.dateInBS).toBe("string");
    expect(d.dateInBS.length).toBeGreaterThan(0);
    expect(d.DATE_OBJECT).toBeDefined();
    expect(d.DATE_OBJECT.YEAR).toBeTypeOf("number");
    expect(d.DATE_OBJECT.MONTH).toBeTypeOf("number");
    expect(d.DATE_OBJECT.DATE).toBeTypeOf("number");
  });

  it("creates from BS date string with isInBS=true", () => {
    const d = new dinjs("2081-08-10", "YYYY-MM-DD", true);
    expect(d.dateInBS).toBe("2081-08-10");
    expect(d.DATE_OBJECT.YEAR).toBe(2081);
    expect(d.DATE_OBJECT.MONTH).toBe(8);
    expect(d.DATE_OBJECT.DATE).toBe(10);
  });

  it("creates from AD date string (converted to BS)", () => {
    const d = new dinjs("2024-11-26", "YYYY-MM-DD");
    // v3 actual: returns 2081-08-11 (off-by-one, likely TZ rounding)
    expect(d.DATE_OBJECT.YEAR).toBe(2081);
    expect(d.DATE_OBJECT.MONTH).toBe(8);
    expect(d.DATE_OBJECT.DATE).toBe(11);
    expect(d.dateInBS).toBe("2081-08-11");
  });

  it("preserves the format string", () => {
    const d = new dinjs("2081-08-10", "YYYY-MM-DD", true);
    expect(d.DATE_FORMAT_STRING).toBe("YYYY-MM-DD");
  });

  it("stores dateInBS in the provided format", () => {
    const d = new dinjs("10/08/2081", "DD/MM/YYYY", true);
    expect(d.dateInBS).toBe("10/08/2081");
    expect(d.DATE_OBJECT.YEAR).toBe(2081);
    expect(d.DATE_OBJECT.MONTH).toBe(8);
    expect(d.DATE_OBJECT.DATE).toBe(10);
  });
});

describe("dinjs v3 date arithmetic (addDate)", () => {
  it("adds days, months, years", () => {
    const d = new dinjs("2081-01-01", "YYYY-MM-DD", true);
    d.addDate(1, 2, 3);
    expect(d.DATE_OBJECT.YEAR).toBe(2082);
    expect(d.DATE_OBJECT.MONTH).toBe(3);
    expect(d.DATE_OBJECT.DATE).toBe(4);
    expect(d.dateInBS).toBe("2082-03-04");
  });

  it("adds only days", () => {
    const d = new dinjs("2081-01-01", "YYYY-MM-DD", true);
    d.addDays(10);
    expect(d.DATE_OBJECT.DATE).toBe(11);
    expect(d.dateInBS).toBe("2081-01-11");
  });

  it("adds only months", () => {
    const d = new dinjs("2081-01-01", "YYYY-MM-DD", true);
    d.addMonths(1);
    expect(d.DATE_OBJECT.MONTH).toBe(2);
    expect(d.dateInBS).toBe("2081-02-01");
  });

  it("adds only years", () => {
    const d = new dinjs("2081-05-15", "YYYY-MM-DD", true);
    d.addYears(2);
    expect(d.DATE_OBJECT.YEAR).toBe(2083);
    expect(d.dateInBS).toBe("2083-05-15");
  });

  it("wraps months across year boundary", () => {
    const d = new dinjs("2081-10-01", "YYYY-MM-DD", true);
    d.addMonths(3);
    expect(d.DATE_OBJECT.YEAR).toBe(2082);
    expect(d.DATE_OBJECT.MONTH).toBe(1);
    expect(d.dateInBS).toBe("2082-01-01");
  });

  /**
   * BUG v3: addDays(30) from 2081-01-01 lands on 2081-01-31, not 2081-02-01.
   * The day loop increments date THEN checks month overflow, causing an
   * off-by-one: it never wraps to the next month when days exactly equal
   * the month length. v4 should fix this with O(1) math.
   */
  it("BUG: carries over excess days to next month (off-by-one)", () => {
    const d = new dinjs("2081-01-01", "YYYY-MM-DD", true);
    d.addDays(30);
    // v3 actual: stays in month 1 at day 31 (Baisakh 2081 has 31 days)
    expect(d.DATE_OBJECT.MONTH).toBe(1);
    expect(d.DATE_OBJECT.DATE).toBe(31);
    expect(d.dateInBS).toBe("2081-01-31");
  });
});

describe("dinjs v3 date subtraction", () => {
  it("subtracts days", () => {
    const d = new dinjs("2081-01-15", "YYYY-MM-DD", true);
    d.subtractDays(5);
    expect(d.DATE_OBJECT.DATE).toBe(10);
    expect(d.dateInBS).toBe("2081-01-10");
  });

  it("subtracts months", () => {
    const d = new dinjs("2081-05-10", "YYYY-MM-DD", true);
    d.subtractMonths(2);
    expect(d.DATE_OBJECT.MONTH).toBe(3);
    expect(d.dateInBS).toBe("2081-03-10");
  });

  it("subtracts years", () => {
    const d = new dinjs("2083-05-10", "YYYY-MM-DD", true);
    d.subtractYears(2);
    expect(d.DATE_OBJECT.YEAR).toBe(2081);
    expect(d.dateInBS).toBe("2081-05-10");
  });

  it("wraps months back across year boundary", () => {
    const d = new dinjs("2082-01-01", "YYYY-MM-DD", true);
    d.subtractMonths(3);
    expect(d.DATE_OBJECT.YEAR).toBe(2081);
    expect(d.DATE_OBJECT.MONTH).toBe(10);
    expect(d.dateInBS).toBe("2081-10-01");
  });

  /**
   * BUG v3: subtractDays(1) from 2081-02-01 lands on 2081-01-31, not 2081-01-30.
   * The subtraction loop sets DATE to daysInMonth of previous month, but
   * Baisakh 2081 has 31 days — v3 lands on 31 instead of going to 30.
   * This is a secondary issue: the real fix is O(1) dayIndex math in v4.
   */
  it("BUG: wraps days back across month boundary (off-by-one)", () => {
    const d = new dinjs("2081-02-01", "YYYY-MM-DD", true);
    d.subtractDays(1);
    // v3 actual: sets to last day of previous month (31) then subtracts to 30
    // but the loop decrements before setting, so lands on 31
    expect(d.DATE_OBJECT.MONTH).toBe(1);
    expect(d.DATE_OBJECT.DATE).toBe(31);
    expect(d.dateInBS).toBe("2081-01-31");
  });
});

describe("dinjs v3 daysDifference", () => {
  it("returns positive when first > second", () => {
    const a = new dinjs("2081-02-10", "YYYY-MM-DD", true);
    const b = new dinjs("2081-02-05", "YYYY-MM-DD", true);
    expect(a.daysDifference(b)).toBe(5);
  });

  it("returns negative when first < second", () => {
    const a = new dinjs("2081-02-05", "YYYY-MM-DD", true);
    const b = new dinjs("2081-02-10", "YYYY-MM-DD", true);
    expect(a.daysDifference(b)).toBe(-5);
  });

  it("returns 0 for same date", () => {
    const a = new dinjs("2081-02-05", "YYYY-MM-DD", true);
    const b = new dinjs("2081-02-05", "YYYY-MM-DD", true);
    expect(a.daysDifference(b)).toBe(0);
  });

  /**
   * BUG v3: Cross-month difference is wrong due to mutation in the diff loop.
   * The diff function mutates its arguments (obj swap) and the day walk loop
   * has the same off-by-one as addDays. v4 uses dayIndex subtraction O(1).
   */
  it("BUG: calculates cross-month difference (off-by-one)", () => {
    const a = new dinjs("2081-03-05", "YYYY-MM-DD", true);
    const b = new dinjs("2081-01-28", "YYYY-MM-DD", true);
    // v3 actual: 40 instead of expected 37
    expect(a.daysDifference(b)).toBe(40);
  });
});

describe("dinjs v3 known AD→BS conversion fixture", () => {
  /**
   * BUG v3: 2024-11-26 AD should be 2081-08-10 BS per calendar data.
   * v3 returns 2081-08-11 — likely caused by host timezone shifting
   * the civil date by +1 day when using new Date(y,m,d) local constructor.
   */
  it("BUG: converts 2024-11-26 AD (off-by-one TZ)", () => {
    const d = new dinjs("2024-11-26", "YYYY-MM-DD");
    expect(d.dateInBS).toBe("2081-08-11");
  });
});
