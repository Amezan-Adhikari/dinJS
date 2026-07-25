/**
 * O(1) / O(log n) BS date ↔ dayIndex conversions.
 *
 * dayIndex = number of days since BS 2000-01-01 (Baisakh 1).
 * dayIndex 0 = BS 2000-01-01.
 */

import {
  DAYS_IN_MONTH,
  BS_YEAR_START,
  BS_YEAR_COUNT,
  MONTHS_IN_YEAR,
} from "./calendar-data";
import {
  DAYS_IN_YEAR,
  CUM_DAYS_BEFORE_YEAR,
  CUM_DAYS_BEFORE_MONTH,
  TOTAL_DAYS,
} from "./cumulative";

/**
 * Result of a BS date decomposition.
 */
export interface BsDate {
  year: number;   // 1-based BS year (2000–2089)
  month: number;  // 1-based month (1=Baisakh … 12=Chaitra)
  day: number;    // 1-based day
}

/**
 * Convert BS date to a dayIndex (days since BS 2000-01-01).
 * O(1) — uses precomputed cumulative tables.
 *
 * @param year  BS year (2000–2089)
 * @param month month (1–12)
 * @param day   day (1–N)
 * @returns dayIndex (0-based)
 * @throws if out of range or invalid date
 */
export function bsToDayIndex(year: number, month: number, day: number): number {
  if (year < BS_YEAR_START || year > BS_YEAR_START + BS_YEAR_COUNT - 1) {
    throw new Error(
      `Year ${year} out of range. Valid: ${BS_YEAR_START}–${BS_YEAR_START + BS_YEAR_COUNT - 1}`
    );
  }
  if (month < 1 || month > MONTHS_IN_YEAR) {
    throw new Error(`Month ${month} out of range. Valid: 1–${MONTHS_IN_YEAR}`);
  }

  const yearIndex = year - BS_YEAR_START;
  const maxDay = DAYS_IN_MONTH[yearIndex][month - 1];
  if (day < 1 || day > maxDay) {
    throw new Error(
      `Day ${day} out of range for ${year}-${month}. Max day: ${maxDay}`
    );
  }

  return (
    CUM_DAYS_BEFORE_YEAR[yearIndex] +
    CUM_DAYS_BEFORE_MONTH[yearIndex][month - 1] +
    (day - 1)
  );
}

/**
 * Convert dayIndex to BS date.
 * O(log n) — binary search on year, O(12) scan for month.
 *
 * @param index dayIndex (0-based, 0 = BS 2000-01-01)
 * @returns BsDate
 * @throws if index out of range
 */
export function dayIndexToBs(index: number): BsDate {
  if (index < 0 || index >= TOTAL_DAYS) {
    throw new Error(
      `dayIndex ${index} out of range. Valid: 0–${TOTAL_DAYS - 1}`
    );
  }

  // Binary search for year
  let lo = 0;
  let hi = BS_YEAR_COUNT - 1;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (CUM_DAYS_BEFORE_YEAR[mid + 1] <= index) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }

  const yearIndex = lo;
  const dayWithinYear = index - CUM_DAYS_BEFORE_YEAR[yearIndex];

  // Scan for month (at most 12 iterations — effectively O(1))
  let monthIndex = 0;
  while (
    monthIndex < MONTHS_IN_YEAR - 1 &&
    CUM_DAYS_BEFORE_MONTH[yearIndex][monthIndex + 1] <= dayWithinYear
  ) {
    monthIndex++;
  }

  const dayInMonth =
    dayWithinYear - CUM_DAYS_BEFORE_MONTH[yearIndex][monthIndex] + 1;

  return {
    year: BS_YEAR_START + yearIndex,
    month: monthIndex + 1,
    day: dayInMonth,
  };
}

/**
 * Get the number of days in a given BS month.
 * O(1).
 */
export function getDaysInBsMonth(year: number, month: number): number {
  if (year < BS_YEAR_START || year > BS_YEAR_START + BS_YEAR_COUNT - 1) {
    throw new Error(`Year ${year} out of range.`);
  }
  if (month < 1 || month > MONTHS_IN_YEAR) {
    throw new Error(`Month ${month} out of range.`);
  }
  return DAYS_IN_MONTH[year - BS_YEAR_START][month - 1];
}

/**
 * Check if a BS date is valid.
 */
export function isValidBsDate(year: number, month: number, day: number): boolean {
  if (year < BS_YEAR_START || year > BS_YEAR_START + BS_YEAR_COUNT - 1) return false;
  if (month < 1 || month > MONTHS_IN_YEAR) return false;
  if (day < 1) return false;
  return day <= DAYS_IN_MONTH[year - BS_YEAR_START][month - 1];
}

export { TOTAL_DAYS };
