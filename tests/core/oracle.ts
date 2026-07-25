/**
 * Brute-force oracle for BS date ↔ dayIndex conversion.
 *
 * Uses the same day-by-day loop logic as v3, but operates on the numeric
 * calendar data. Used ONLY in tests to validate the O(1) implementation.
 */

import { DAYS_IN_MONTH, BS_YEAR_START, BS_YEAR_COUNT, MONTHS_IN_YEAR } from "../../src/core/calendar-data";

/**
 * Oracle: bsToDayIndex via day-by-day walk from BS 2000-01-01.
 * O(n) where n = number of days from epoch.
 */
export function oracleBsToDayIndex(
  year: number,
  month: number,
  day: number
): number {
  let y = BS_YEAR_START;
  let m = 1;
  let d = 1;
  let index = 0;

  while (y < year || m < month || d < day) {
    d++;
    index++;
    const maxDay = DAYS_IN_MONTH[y - BS_YEAR_START][m - 1];
    if (d > maxDay) {
      d = 1;
      m++;
      if (m > MONTHS_IN_YEAR) {
        m = 1;
        y++;
        if (y > BS_YEAR_START + BS_YEAR_COUNT - 1) {
          throw new Error("Oracle: year exceeds range");
        }
      }
    }
  }

  return index;
}

/**
 * Oracle: dayIndexToBs via day-by-day walk from BS 2000-01-01.
 * O(n) where n = index value.
 */
export function oracleDayIndexToBs(index: number): {
  year: number;
  month: number;
  day: number;
} {
  let y = BS_YEAR_START;
  let m = 1;
  let d = 1;
  let remaining = index;

  while (remaining > 0) {
    d++;
    remaining--;
    const maxDay = DAYS_IN_MONTH[y - BS_YEAR_START][m - 1];
    if (d > maxDay) {
      d = 1;
      m++;
      if (m > MONTHS_IN_YEAR) {
        m = 1;
        y++;
      }
    }
  }

  return { year: y, month: m, day: d };
}
