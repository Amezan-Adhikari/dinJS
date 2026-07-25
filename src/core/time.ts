/**
 * Nepal timezone utilities and AD ↔ dayIndex conversion.
 *
 * All civil date math uses fixed UTC+05:45 (no DST).
 * Nepal civil date = UTC ms + NEPAL_OFFSET, truncated to date.
 */

import { REFERENCE_AD_YEAR, REFERENCE_AD_MONTH, REFERENCE_AD_DAY } from "./calendar-data";
import { bsToDayIndex, dayIndexToBs, BsDate } from "./day-index";

// ── Constants ──────────────────────────────────────────────────────

/** Nepal timezone offset in milliseconds: +05:45 = 20,700,000 ms */
export const NEPAL_OFFSET_MS = (5 * 60 + 45) * 60 * 1000; // 20_700_000

/** IANA-style timezone identifier */
export const NEPAL_TZ = "Asia/Kathmandu";

/** Days in each month of a Gregorian year (index 0 = January) */
const GREG_DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// ── Epoch anchor ───────────────────────────────────────────────────
// BS 2000-01-01 (Baisakh 1) = AD 1943-04-14 in Nepal civil date.
// At Nepal midnight on 1943-04-14, the UTC time is:
//   1943-04-14 00:00:00 +0545  →  1943-04-13 18:45:00 UTC

const epochUtcMs =
  Date.UTC(REFERENCE_AD_YEAR, REFERENCE_AD_MONTH - 1, REFERENCE_AD_DAY, 0, 0, 0, 0) -
  NEPAL_OFFSET_MS;

// ── Nepali parts (AD wall in Nepal TZ) ─────────────────────────────

export interface NepaliParts {
  year: number;    // AD year
  month: number;   // 1-based (1 = January)
  day: number;     // 1-based
  hour: number;    // 0–23
  minute: number;  // 0–59
  second: number;  // 0–59
  ms: number;      // 0–999
}

/**
 * Convert UTC milliseconds to Nepal civil date+time.
 * O(1).
 */
export function utcMsToNepalParts(utcMs: number): NepaliParts {
  // Get Nepal wall time
  const wallMs = utcMs + NEPAL_OFFSET_MS;

  // Days since Unix epoch (1970-01-01 UTC)
  const daysSinceEpoch = Math.floor(wallMs / 86400000);
  const timeOfDay = wallMs - daysSinceEpoch * 86400000;

  const hour = Math.floor(timeOfDay / 3600000);
  const minute = Math.floor((timeOfDay % 3600000) / 60000);
  const second = Math.floor((timeOfDay % 60000) / 1000);
  const ms = timeOfDay % 1000;

  // Civil date from day count (algorithm from Howard Hinnant)
  const z = daysSinceEpoch + 719468;
  const era = Math.floor((z >= 0 ? z : z - 146096) / 146097);
  const doe = z - era * 146097;
  const yoe = Math.floor((doe - Math.floor(doe / 1460) + Math.floor(doe / 36524) - Math.floor(doe / 146096)) / 365);
  const y = yoe + era * 400;
  const doy = doe - (365 * yoe + Math.floor(yoe / 4) - Math.floor(yoe / 100));
  const mp = Math.floor((5 * doy + 2) / 153);
  const d = doy - Math.floor((153 * mp + 2) / 5) + 1;
  const m = mp + (mp < 10 ? 3 : -9);

  return {
    year: y + (m <= 2 ? 1 : 0),
    month: m,
    day: d,
    hour,
    minute,
    second,
    ms,
  };
}

/**
 * Convert Nepal civil date+time parts to UTC milliseconds.
 * O(1).
 */
export function nepalPartsToUtcMs(parts: NepaliParts): number {
  const { year, month, day, hour = 0, minute = 0, second = 0, ms = 0 } = parts;

  // Gregorian civil date → day count (Howard Hinnant algorithm)
  const m = month;
  const y = year - (m <= 2 ? 1 : 0);
  const era = Math.floor(y / 400);
  const yoe = y - era * 400;
  const doy =
    Math.floor((153 * (m + (m > 2 ? -3 : 9)) + 2) / 5) + day - 1;
  const doe = yoe * 365 + Math.floor(yoe / 4) - Math.floor(yoe / 100) + doy;
  const daysSinceUnixEpoch = era * 146097 + doe - 719468;

  // Nepal wall midnight in UTC ms
  const wallMidnightUtcMs = daysSinceUnixEpoch * 86400000 + hour * 3600000 + minute * 60000 + second * 1000 + ms;

  return wallMidnightUtcMs - NEPAL_OFFSET_MS;
}

// ── Nepal civil date ↔ dayIndex ────────────────────────────────────

/**
 * Convert AD civil date (in Nepal TZ) to dayIndex.
 * dayIndex 0 = BS 2000-01-01 = AD 1943-04-14 (Nepal civil date).
 *
 * O(1).
 */
export function nepalDateToDayIndex(year: number, month: number, day: number): number {
  // Days since Unix epoch for the Nepal civil date
  const m = month;
  const y = year - (m <= 2 ? 1 : 0);
  const era = Math.floor(y / 400);
  const yoe = y - era * 400;
  const doy =
    Math.floor((153 * (m + (m > 2 ? -3 : 9)) + 2) / 5) + day - 1;
  const doe = yoe * 365 + Math.floor(yoe / 4) - Math.floor(yoe / 100) + doy;
  const daysSinceUnixEpoch = era * 146097 + doe - 719468;

  // daysSinceUnixEpoch for reference date (AD 1943-04-14)
  const refM = REFERENCE_AD_MONTH;
  const refY = REFERENCE_AD_YEAR - (refM <= 2 ? 1 : 0);
  const refEra = Math.floor(refY / 400);
  const refYoe = refY - refEra * 400;
  const refDoy =
    Math.floor((153 * (refM + (refM > 2 ? -3 : 9)) + 2) / 5) + REFERENCE_AD_DAY - 1;
  const refDoe = refYoe * 365 + Math.floor(refYoe / 4) - Math.floor(refYoe / 100) + refDoy;
  const refDaysSinceUnixEpoch = refEra * 146097 + refDoe - 719468;

  return daysSinceUnixEpoch - refDaysSinceUnixEpoch;
}

/**
 * Convert dayIndex to AD civil date in Nepal TZ.
 * O(1).
 */
export function dayIndexToNepalDate(index: number): { year: number; month: number; day: number } {
  // Reference date day count
  const refM = REFERENCE_AD_MONTH;
  const refY = REFERENCE_AD_YEAR - (refM <= 2 ? 1 : 0);
  const refEra = Math.floor(refY / 400);
  const refYoe = refY - refEra * 400;
  const refDoy =
    Math.floor((153 * (refM + (refM > 2 ? -3 : 9)) + 2) / 5) + REFERENCE_AD_DAY - 1;
  const refDoe = refYoe * 365 + Math.floor(refYoe / 4) - Math.floor(refYoe / 100) + refDoy;
  const refDaysSinceUnixEpoch = refEra * 146097 + refDoe - 719468;

  const daysSinceUnixEpoch = refDaysSinceUnixEpoch + index;

  // Day count → civil date
  const z = daysSinceUnixEpoch + 719468;
  const era = Math.floor((z >= 0 ? z : z - 146096) / 146097);
  const doe = z - era * 146097;
  const yoe = Math.floor((doe - Math.floor(doe / 1460) + Math.floor(doe / 36524) - Math.floor(doe / 146096)) / 365);
  const y = yoe + era * 400;
  const doy = doe - (365 * yoe + Math.floor(yoe / 4) - Math.floor(yoe / 100));
  const mp = Math.floor((5 * doy + 2) / 153);
  const d = doy - Math.floor((153 * mp + 2) / 5) + 1;
  const mo = mp + (mp < 10 ? 3 : -9);

  return {
    year: y + (mo <= 2 ? 1 : 0),
    month: mo,
    day: d,
  };
}

// ── Full conversion: utcMs ↔ BS + time ─────────────────────────────

export interface BsDateTime extends BsDate {
  hour: number;
  minute: number;
  second: number;
  ms: number;
}

/**
 * Convert UTC milliseconds to BS date+time (Nepal wall time).
 */
export function utcMsToBsDateTime(utcMs: number): BsDateTime {
  const nepal = utcMsToNepalParts(utcMs);
  const dayIdx = nepalDateToDayIndex(nepal.year, nepal.month, nepal.day);
  const bs = dayIndexToBs(dayIdx);
  return {
    ...bs,
    hour: nepal.hour,
    minute: nepal.minute,
    second: nepal.second,
    ms: nepal.ms,
  };
}

/**
 * Convert BS date+time to UTC milliseconds.
 * Hour/minute/second/ms default to Nepal midnight if not provided.
 */
export function bsDateTimeToUtcMs(
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
  second = 0,
  ms = 0
): number {
  const dayIdx = bsToDayIndex(year, month, day);
  const nepalDate = dayIndexToNepalDate(dayIdx);
  return nepalPartsToUtcMs({
    year: nepalDate.year,
    month: nepalDate.month,
    day: nepalDate.day,
    hour,
    minute,
    second,
    ms,
  });
}
