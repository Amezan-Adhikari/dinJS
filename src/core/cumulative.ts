/**
 * Precomputed cumulative tables for O(1) BS date arithmetic.
 *
 * Built once at module init from calendar-data.ts.
 */

import {
  DAYS_IN_MONTH,
  BS_YEAR_START,
  BS_YEAR_COUNT,
  MONTHS_IN_YEAR,
} from "./calendar-data";

/**
 * Total days in each BS year. Index 0 = BS 2000.
 */
export const DAYS_IN_YEAR: readonly number[] = DAYS_IN_MONTH.map((months) =>
  months.reduce((sum, d) => sum + d, 0)
);

/**
 * Cumulative days before each BS year.
 * cumDaysBeforeYear[0] = 0  (before BS 2000)
 * cumDaysBeforeYear[1] = daysInYear[0]  (before BS 2001)
 * ...
 * cumDaysBeforeYear[90] = total days in range (before BS 2090, sentinel)
 */
export const CUM_DAYS_BEFORE_YEAR: readonly number[] = (() => {
  const cum = new Array<number>(BS_YEAR_COUNT + 1);
  cum[0] = 0;
  for (let i = 0; i < BS_YEAR_COUNT; i++) {
    cum[i + 1] = cum[i] + DAYS_IN_YEAR[i];
  }
  return cum;
})();

/**
 * Total days in the entire supported BS range.
 */
export const TOTAL_DAYS: number = CUM_DAYS_BEFORE_YEAR[BS_YEAR_COUNT];

/**
 * cumDaysBeforeMonth[yearIndex][month] = days before month `month` (0-based)
 * in the year at `yearIndex`.
 *
 * Example: cumDaysBeforeMonth[0][0] = 0  (before Baisakh of BS 2000)
 *          cumDaysBeforeMonth[0][1] = 30 (before Jestha of BS 2000)
 */
export const CUM_DAYS_BEFORE_MONTH: readonly (readonly number[])[] =
  DAYS_IN_MONTH.map((months) => {
    const cum = new Array<number>(MONTHS_IN_YEAR + 1);
    cum[0] = 0;
    for (let m = 0; m < MONTHS_IN_YEAR; m++) {
      cum[m + 1] = cum[m] + months[m];
    }
    return cum;
  });
