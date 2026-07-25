"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  BS_YEAR_COUNT: () => BS_YEAR_COUNT,
  BS_YEAR_END: () => BS_YEAR_END,
  BS_YEAR_START: () => BS_YEAR_START,
  DinDate: () => DinDate,
  Duration: () => Duration,
  NEPAL_OFFSET_MS: () => NEPAL_OFFSET_MS,
  NEPAL_TZ: () => NEPAL_TZ,
  TOTAL_DAYS: () => TOTAL_DAYS,
  dinjs: () => dinjs,
  dinjs_v3: () => dinjs_v3,
  getDaysInBsMonth: () => getDaysInBsMonth,
  getMonthNameEn: () => getMonthNameEn,
  getMonthNameNe: () => getMonthNameNe,
  isValidBsDate: () => isValidBsDate,
  watchRelative: () => watchRelative
});
module.exports = __toCommonJS(src_exports);

// src/core/calendar-data.ts
var DAYS_IN_MONTH = [
  [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 31, 32, 31, 32, 30, 30, 29, 30, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  [30, 32, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 31, 32, 31, 32, 30, 30, 29, 30, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  [31, 31, 31, 32, 31, 31, 29, 30, 29, 30, 29, 31],
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30],
  [31, 32, 31, 32, 30, 31, 30, 30, 29, 30, 30, 30],
  [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  [31, 31, 32, 31, 31, 31, 30, 30, 30, 30, 30, 30],
  [30, 31, 32, 32, 30, 31, 30, 30, 29, 30, 30, 30],
  [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30]
];
var BS_YEAR_START = 2e3;
var BS_YEAR_END = 2089;
var BS_YEAR_COUNT = 90;
var MONTHS_IN_YEAR = 12;
var REFERENCE_AD_YEAR = 1943;
var REFERENCE_AD_MONTH = 4;
var REFERENCE_AD_DAY = 14;

// src/core/cumulative.ts
var DAYS_IN_YEAR = DAYS_IN_MONTH.map(
  (months) => months.reduce((sum, d) => sum + d, 0)
);
var CUM_DAYS_BEFORE_YEAR = (() => {
  const cum = new Array(BS_YEAR_COUNT + 1);
  cum[0] = 0;
  for (let i = 0; i < BS_YEAR_COUNT; i++) {
    cum[i + 1] = cum[i] + DAYS_IN_YEAR[i];
  }
  return cum;
})();
var TOTAL_DAYS = CUM_DAYS_BEFORE_YEAR[BS_YEAR_COUNT];
var CUM_DAYS_BEFORE_MONTH = DAYS_IN_MONTH.map((months) => {
  const cum = new Array(MONTHS_IN_YEAR + 1);
  cum[0] = 0;
  for (let m = 0; m < MONTHS_IN_YEAR; m++) {
    cum[m + 1] = cum[m] + months[m];
  }
  return cum;
});

// src/core/day-index.ts
function bsToDayIndex(year, month, day) {
  if (year < BS_YEAR_START || year > BS_YEAR_START + BS_YEAR_COUNT - 1) {
    throw new Error(
      `Year ${year} out of range. Valid: ${BS_YEAR_START}\u2013${BS_YEAR_START + BS_YEAR_COUNT - 1}`
    );
  }
  if (month < 1 || month > MONTHS_IN_YEAR) {
    throw new Error(`Month ${month} out of range. Valid: 1\u2013${MONTHS_IN_YEAR}`);
  }
  const yearIndex = year - BS_YEAR_START;
  const maxDay = DAYS_IN_MONTH[yearIndex][month - 1];
  if (day < 1 || day > maxDay) {
    throw new Error(
      `Day ${day} out of range for ${year}-${month}. Max day: ${maxDay}`
    );
  }
  return CUM_DAYS_BEFORE_YEAR[yearIndex] + CUM_DAYS_BEFORE_MONTH[yearIndex][month - 1] + (day - 1);
}
function dayIndexToBs(index) {
  if (index < 0 || index >= TOTAL_DAYS) {
    throw new Error(
      `dayIndex ${index} out of range. Valid: 0\u2013${TOTAL_DAYS - 1}`
    );
  }
  let lo = 0;
  let hi = BS_YEAR_COUNT - 1;
  while (lo < hi) {
    const mid = lo + hi >>> 1;
    if (CUM_DAYS_BEFORE_YEAR[mid + 1] <= index) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }
  const yearIndex = lo;
  const dayWithinYear = index - CUM_DAYS_BEFORE_YEAR[yearIndex];
  let monthIndex = 0;
  while (monthIndex < MONTHS_IN_YEAR - 1 && CUM_DAYS_BEFORE_MONTH[yearIndex][monthIndex + 1] <= dayWithinYear) {
    monthIndex++;
  }
  const dayInMonth = dayWithinYear - CUM_DAYS_BEFORE_MONTH[yearIndex][monthIndex] + 1;
  return {
    year: BS_YEAR_START + yearIndex,
    month: monthIndex + 1,
    day: dayInMonth
  };
}
function getDaysInBsMonth(year, month) {
  if (year < BS_YEAR_START || year > BS_YEAR_START + BS_YEAR_COUNT - 1) {
    throw new Error(`Year ${year} out of range.`);
  }
  if (month < 1 || month > MONTHS_IN_YEAR) {
    throw new Error(`Month ${month} out of range.`);
  }
  return DAYS_IN_MONTH[year - BS_YEAR_START][month - 1];
}
function isValidBsDate(year, month, day) {
  if (year < BS_YEAR_START || year > BS_YEAR_START + BS_YEAR_COUNT - 1) return false;
  if (month < 1 || month > MONTHS_IN_YEAR) return false;
  if (day < 1) return false;
  return day <= DAYS_IN_MONTH[year - BS_YEAR_START][month - 1];
}

// src/core/time.ts
var NEPAL_OFFSET_MS = (5 * 60 + 45) * 60 * 1e3;
var NEPAL_TZ = "Asia/Kathmandu";
var epochUtcMs = Date.UTC(REFERENCE_AD_YEAR, REFERENCE_AD_MONTH - 1, REFERENCE_AD_DAY, 0, 0, 0, 0) - NEPAL_OFFSET_MS;
function utcMsToNepalParts(utcMs) {
  const wallMs = utcMs + NEPAL_OFFSET_MS;
  const daysSinceEpoch = Math.floor(wallMs / 864e5);
  const timeOfDay = wallMs - daysSinceEpoch * 864e5;
  const hour = Math.floor(timeOfDay / 36e5);
  const minute = Math.floor(timeOfDay % 36e5 / 6e4);
  const second = Math.floor(timeOfDay % 6e4 / 1e3);
  const ms = timeOfDay % 1e3;
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
    ms
  };
}
function nepalPartsToUtcMs(parts) {
  const { year, month, day, hour = 0, minute = 0, second = 0, ms = 0 } = parts;
  const m = month;
  const y = year - (m <= 2 ? 1 : 0);
  const era = Math.floor(y / 400);
  const yoe = y - era * 400;
  const doy = Math.floor((153 * (m + (m > 2 ? -3 : 9)) + 2) / 5) + day - 1;
  const doe = yoe * 365 + Math.floor(yoe / 4) - Math.floor(yoe / 100) + doy;
  const daysSinceUnixEpoch = era * 146097 + doe - 719468;
  const wallMidnightUtcMs = daysSinceUnixEpoch * 864e5 + hour * 36e5 + minute * 6e4 + second * 1e3 + ms;
  return wallMidnightUtcMs - NEPAL_OFFSET_MS;
}
function nepalDateToDayIndex(year, month, day) {
  const m = month;
  const y = year - (m <= 2 ? 1 : 0);
  const era = Math.floor(y / 400);
  const yoe = y - era * 400;
  const doy = Math.floor((153 * (m + (m > 2 ? -3 : 9)) + 2) / 5) + day - 1;
  const doe = yoe * 365 + Math.floor(yoe / 4) - Math.floor(yoe / 100) + doy;
  const daysSinceUnixEpoch = era * 146097 + doe - 719468;
  const refM = REFERENCE_AD_MONTH;
  const refY = REFERENCE_AD_YEAR - (refM <= 2 ? 1 : 0);
  const refEra = Math.floor(refY / 400);
  const refYoe = refY - refEra * 400;
  const refDoy = Math.floor((153 * (refM + (refM > 2 ? -3 : 9)) + 2) / 5) + REFERENCE_AD_DAY - 1;
  const refDoe = refYoe * 365 + Math.floor(refYoe / 4) - Math.floor(refYoe / 100) + refDoy;
  const refDaysSinceUnixEpoch = refEra * 146097 + refDoe - 719468;
  return daysSinceUnixEpoch - refDaysSinceUnixEpoch;
}
function dayIndexToNepalDate(index) {
  const refM = REFERENCE_AD_MONTH;
  const refY = REFERENCE_AD_YEAR - (refM <= 2 ? 1 : 0);
  const refEra = Math.floor(refY / 400);
  const refYoe = refY - refEra * 400;
  const refDoy = Math.floor((153 * (refM + (refM > 2 ? -3 : 9)) + 2) / 5) + REFERENCE_AD_DAY - 1;
  const refDoe = refYoe * 365 + Math.floor(refYoe / 4) - Math.floor(refYoe / 100) + refDoy;
  const refDaysSinceUnixEpoch = refEra * 146097 + refDoe - 719468;
  const daysSinceUnixEpoch = refDaysSinceUnixEpoch + index;
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
    day: d
  };
}
function utcMsToBsDateTime(utcMs) {
  const nepal = utcMsToNepalParts(utcMs);
  const dayIdx = nepalDateToDayIndex(nepal.year, nepal.month, nepal.day);
  const bs = dayIndexToBs(dayIdx);
  return {
    ...bs,
    hour: nepal.hour,
    minute: nepal.minute,
    second: nepal.second,
    ms: nepal.ms
  };
}
function bsDateTimeToUtcMs(year, month, day, hour = 0, minute = 0, second = 0, ms = 0) {
  const dayIdx = bsToDayIndex(year, month, day);
  const nepalDate = dayIndexToNepalDate(dayIdx);
  return nepalPartsToUtcMs({
    year: nepalDate.year,
    month: nepalDate.month,
    day: nepalDate.day,
    hour,
    minute,
    second,
    ms
  });
}

// src/core/month-names.ts
var MONTH_NAMES_NE = [
  "\u0935\u0948\u0936\u093E\u0916",
  // Baisakh
  "\u091C\u0947\u0920",
  // Jestha
  "\u0905\u0938\u093E\u0930",
  // Asadh
  "\u0938\u093E\u0909\u0928",
  // Shrawan
  "\u092D\u0926\u094C",
  // Bhadra
  "\u0905\u0938\u094B\u091C",
  // Ashwin
  "\u0915\u093E\u0930\u094D\u0924\u093F\u0915",
  // Kartik
  "\u092E\u0902\u0938\u093F\u0930",
  // Mangsir
  "\u092A\u0941\u0937",
  // Poush
  "\u092E\u093E\u0918",
  // Magh
  "\u092B\u093E\u0917\u0941\u0928",
  // Falgun
  "\u091A\u0948\u0924"
  // Chaitra
];
var MONTH_NAMES_EN = [
  "Baisakh",
  "Jestha",
  "Asadh",
  "Shrawan",
  "Bhadra",
  "Ashwin",
  "Kartik",
  "Mangsir",
  "Poush",
  "Magh",
  "Falgun",
  "Chaitra"
];
function getMonthNameNe(month) {
  if (month < 1 || month > 12) throw new Error(`Invalid month: ${month}`);
  return MONTH_NAMES_NE[month - 1];
}
function getMonthNameEn(month) {
  if (month < 1 || month > 12) throw new Error(`Invalid month: ${month}`);
  return MONTH_NAMES_EN[month - 1];
}

// src/duration/duration.ts
var MS_PER_SECOND = 1e3;
var MS_PER_MINUTE = 60 * MS_PER_SECOND;
var MS_PER_HOUR = 60 * MS_PER_MINUTE;
var MS_PER_DAY = 24 * MS_PER_HOUR;
var Duration = class _Duration {
  #ms;
  constructor(ms) {
    this.#ms = ms;
  }
  // ── Source of truth ───────────────────────────────────────────
  /** Signed total milliseconds. */
  get milliseconds() {
    return this.#ms;
  }
  // ── Clock breakdown (trunc toward 0) ──────────────────────────
  /** Whole days (trunc toward 0). */
  get days() {
    return Math.trunc(this.#ms / MS_PER_DAY);
  }
  /** Whole hours (0–23 after days). */
  get hours() {
    const rem = Math.abs(this.#ms) - Math.abs(this.days) * MS_PER_DAY;
    return Math.trunc(rem / MS_PER_HOUR);
  }
  /** Whole minutes (0–59 after hours). */
  get minutes() {
    const rem = Math.abs(this.#ms) - Math.abs(this.days) * MS_PER_DAY - Math.abs(this.hours) * MS_PER_HOUR;
    return Math.trunc(rem / MS_PER_MINUTE);
  }
  /** Whole seconds (0–59 after minutes). */
  get seconds() {
    const rem = Math.abs(this.#ms) - Math.abs(this.days) * MS_PER_DAY - Math.abs(this.hours) * MS_PER_HOUR - Math.abs(this.minutes) * MS_PER_MINUTE;
    return Math.trunc(rem / MS_PER_SECOND);
  }
  /** Remaining milliseconds (0–999 after seconds). */
  get millisecondsPart() {
    const rem = Math.abs(this.#ms) - Math.abs(this.days) * MS_PER_DAY - Math.abs(this.hours) * MS_PER_HOUR - Math.abs(this.minutes) * MS_PER_MINUTE - Math.abs(this.seconds) * MS_PER_SECOND;
    return rem;
  }
  // ── Conversion ────────────────────────────────────────────────
  /** Convert to any unit. */
  as(unit) {
    switch (unit) {
      case "millisecond":
        return this.#ms;
      case "second":
        return this.#ms / MS_PER_SECOND;
      case "minute":
        return this.#ms / MS_PER_MINUTE;
      case "hour":
        return this.#ms / MS_PER_HOUR;
      case "day":
        return this.#ms / MS_PER_DAY;
      default:
        throw new TypeError(`Cannot convert Duration to ${unit} (non-time unit)`);
    }
  }
  // ── Absolute value ────────────────────────────────────────────
  abs() {
    return new _Duration(Math.abs(this.#ms));
  }
  // ── Negate ────────────────────────────────────────────────────
  negate() {
    return new _Duration(-this.#ms);
  }
  // ── Add / subtract durations ──────────────────────────────────
  add(other) {
    return new _Duration(this.#ms + other.#ms);
  }
  subtract(other) {
    return new _Duration(this.#ms - other.#ms);
  }
  // ── Comparison ────────────────────────────────────────────────
  lt(other) {
    return this.#ms < other.#ms;
  }
  lte(other) {
    return this.#ms <= other.#ms;
  }
  gt(other) {
    return this.#ms > other.#ms;
  }
  gte(other) {
    return this.#ms >= other.#ms;
  }
  eq(other) {
    return this.#ms === other.#ms;
  }
  // ── Humanize ──────────────────────────────────────────────────
  humanize(locale = "en") {
    const abs = Math.abs(this.#ms);
    const sign = this.#ms < 0 ? -1 : this.#ms > 0 ? 1 : 0;
    if (abs < 45e3) {
      return locale === "ne" ? "\u0915\u0947\u0939\u0940 \u0938\u0947\u0915\u0923\u094D\u0921" : "a few seconds";
    }
    if (abs < 9e4) {
      return locale === "ne" ? "\u090F\u0915 \u092E\u093F\u0928\u091F" : "a minute";
    }
    if (abs < 45 * MS_PER_MINUTE) {
      const m = Math.round(abs / MS_PER_MINUTE);
      return locale === "ne" ? `${m} \u092E\u093F\u0928\u091F` : `${m} minutes`;
    }
    if (abs < 90 * MS_PER_MINUTE) {
      return locale === "ne" ? "\u090F\u0915 \u0918\u0923\u094D\u091F\u093E" : "an hour";
    }
    if (abs < 22 * MS_PER_HOUR) {
      const h = Math.round(abs / MS_PER_HOUR);
      return locale === "ne" ? `${h} \u0918\u0923\u094D\u091F\u093E` : `${h} hours`;
    }
    if (abs < 36 * MS_PER_HOUR) {
      return locale === "ne" ? "\u090F\u0915 \u0926\u093F\u0928" : "a day";
    }
    if (abs < 25 * MS_PER_DAY) {
      const d = Math.round(abs / MS_PER_DAY);
      return locale === "ne" ? `${d} \u0926\u093F\u0928` : `${d} days`;
    }
    if (abs < 31 * MS_PER_DAY) {
      return locale === "ne" ? "\u090F\u0915 \u092E\u0939\u0940\u0928\u093E" : "a month";
    }
    if (abs < 345 * MS_PER_DAY) {
      const mo = Math.round(abs / (30 * MS_PER_DAY));
      return locale === "ne" ? `${mo} \u092E\u0939\u0940\u0928\u093E` : `${mo} months`;
    }
    if (abs < 545 * MS_PER_DAY) {
      return locale === "ne" ? "\u090F\u0915 \u0935\u0930\u094D\u0937" : "a year";
    }
    const y = Math.round(abs / (365 * MS_PER_DAY));
    return locale === "ne" ? `${y} \u0935\u0930\u094D\u0937` : `${y} years`;
  }
  humanizeAgo(locale = "en") {
    const h = this.humanize(locale);
    if (this.#ms === 0) return locale === "ne" ? "\u0905\u092D\u093F" : "just now";
    if (this.#ms < 0) {
      return locale === "ne" ? `${h} \u092A\u0939\u093F\u0932\u0947` : `${h} ago`;
    }
    return locale === "ne" ? `${h} \u092E\u093E` : `in ${h}`;
  }
  // ── Refresh interval ──────────────────────────────────────────
  /**
   * Adaptive refresh interval for live-updating UIs.
   * Returns milliseconds until the next update should fire.
   */
  refreshIntervalMs() {
    return _Duration.refreshForRemaining(Math.abs(this.#ms));
  }
  static refreshForRemaining(absMs) {
    if (absMs < 6e4) return 1e3;
    if (absMs < 2 * MS_PER_HOUR) return 6e4;
    if (absMs < 6 * MS_PER_HOUR) return 30 * 6e4;
    if (absMs < 12 * MS_PER_HOUR) return MS_PER_HOUR;
    if (absMs < 24 * MS_PER_HOUR) return 2 * MS_PER_HOUR;
    return MS_PER_DAY;
  }
  /**
   * Compute next delay, capped to the next bucket boundary.
   */
  static nextDelay(remainingMs) {
    const abs = Math.abs(remainingMs);
    const bucket = _Duration.refreshForRemaining(abs);
    const boundary = _Duration.msUntilNextBucket(abs);
    return Math.max(100, Math.min(bucket, boundary));
  }
  static msUntilNextBucket(absMs) {
    if (absMs < 6e4) {
      return absMs;
    }
    if (absMs < 2 * MS_PER_HOUR) {
      return absMs - 6e4;
    }
    if (absMs < 6 * MS_PER_HOUR) {
      return absMs - 2 * MS_PER_HOUR;
    }
    if (absMs < 12 * MS_PER_HOUR) {
      return absMs - 6 * MS_PER_HOUR;
    }
    if (absMs < 24 * MS_PER_HOUR) {
      return absMs - 12 * MS_PER_HOUR;
    }
    return absMs - 24 * MS_PER_HOUR;
  }
  // ── Serialization ─────────────────────────────────────────────
  toJSON() {
    return {
      milliseconds: this.#ms,
      days: this.days,
      hours: this.hours,
      minutes: this.minutes,
      seconds: this.seconds
    };
  }
  toString() {
    return `Duration(${this.#ms}ms)`;
  }
  valueOf() {
    return this.#ms;
  }
  // ── Factory ───────────────────────────────────────────────────
  static fromMs(ms) {
    return new _Duration(ms);
  }
  static fromSeconds(s) {
    return new _Duration(s * MS_PER_SECOND);
  }
  static fromMinutes(m) {
    return new _Duration(m * MS_PER_MINUTE);
  }
  static fromHours(h) {
    return new _Duration(h * MS_PER_HOUR);
  }
  static fromDays(d) {
    return new _Duration(d * MS_PER_DAY);
  }
};

// src/duration/relative.ts
function watchRelative(target, callback, options) {
  const locale = options?.locale ?? "en";
  let cancelled = false;
  let timerId;
  const getBase = () => {
    if (options?.base) {
      return typeof options.base === "function" ? options.base() : options.base;
    }
    return new target.constructor();
  };
  const tick = () => {
    if (cancelled) return;
    const now = getBase();
    const diffMs = target.valueOf() - now.valueOf();
    const duration = Duration.fromMs(diffMs);
    const text = duration.humanizeAgo(locale);
    callback(text, duration);
    const delay = Duration.nextDelay(diffMs);
    timerId = setTimeout(tick, delay);
  };
  tick();
  return () => {
    cancelled = true;
    if (timerId !== void 0) {
      clearTimeout(timerId);
      timerId = void 0;
    }
  };
}

// src/DinDate.ts
var MS_PER_SECOND2 = 1e3;
var MS_PER_MINUTE2 = 60 * MS_PER_SECOND2;
var MS_PER_HOUR2 = 60 * MS_PER_MINUTE2;
var MS_PER_DAY2 = 24 * MS_PER_HOUR2;
function isValidBsParts(year, month, day) {
  return isValidBsDate(year, month, day);
}
var DinDate = class _DinDate {
  #utcMs;
  // Lazy caches (set via Object.defineProperty or cast)
  #nepalParts;
  #bsParts;
  #dayIndex;
  #nepalDate;
  constructor(input) {
    if (input === void 0) {
      this.#utcMs = Date.now();
    } else if (input instanceof Date) {
      this.#utcMs = input.getTime();
    } else {
      this.#utcMs = input;
    }
  }
  // ── Lazy getters ──────────────────────────────────────────────
  get _nepalParts() {
    if (!this.#nepalParts) {
      this.#nepalParts = utcMsToNepalParts(this.#utcMs);
    }
    return this.#nepalParts;
  }
  get _bsParts() {
    if (!this.#bsParts) {
      this.#bsParts = utcMsToBsDateTime(this.#utcMs);
    }
    return this.#bsParts;
  }
  get _dayIndex() {
    if (this.#dayIndex === void 0) {
      const nepal = this._nepalParts;
      this.#dayIndex = nepalDateToDayIndex(nepal.year, nepal.month, nepal.day);
    }
    return this.#dayIndex;
  }
  get _nepalDate() {
    if (!this.#nepalDate) {
      const nepal = this._nepalParts;
      this.#nepalDate = { year: nepal.year, month: nepal.month, day: nepal.day };
    }
    return this.#nepalDate;
  }
  // ── Factory / static ─────────────────────────────────────────
  static from(input) {
    const { year, month, day, hour = 0, minute = 0, second = 0, ms = 0 } = input;
    if (input.calendar === "bs") {
      if (!isValidBsParts(year, month, day)) {
        throw new RangeError(`Invalid BS date: ${year}-${month}-${day}`);
      }
      const utcMs2 = bsDateTimeToUtcMs(year, month, day, hour, minute, second, ms);
      return new _DinDate(utcMs2);
    }
    if (year < 1 || year > 9999) {
      throw new RangeError(`Year ${year} out of range (1\u20139999)`);
    }
    if (month < 1 || month > 12) {
      throw new RangeError(`Month ${month} out of range (1\u201312)`);
    }
    if (day < 1 || day > 31) {
      throw new RangeError(`Day ${day} out of range (1\u201331)`);
    }
    const utcMs = nepalPartsToUtcMs({ year, month, day, hour, minute, second, ms });
    return new _DinDate(utcMs);
  }
  add(valueOrMap, unit) {
    if (typeof valueOrMap === "number" && unit) {
      return this._addUnit(unit, valueOrMap);
    }
    if (typeof valueOrMap === "object" && valueOrMap !== null) {
      let result = this;
      for (const [u, v] of Object.entries(valueOrMap)) {
        if (v !== 0) result = result._addUnit(u, v);
      }
      return result;
    }
    throw new TypeError("Invalid arguments to add()");
  }
  subtract(valueOrMap, unit) {
    if (typeof valueOrMap === "number" && unit) {
      return this._addUnit(unit, -valueOrMap);
    }
    if (typeof valueOrMap === "object" && valueOrMap !== null) {
      let result = this;
      for (const [u, v] of Object.entries(valueOrMap)) {
        if (v !== 0) result = result._addUnit(u, -v);
      }
      return result;
    }
    throw new TypeError("Invalid arguments to subtract()");
  }
  _addUnit(unit, amount) {
    const u = unit.endsWith("s") && unit !== "millisecond" ? unit.slice(0, -1) : unit;
    if (u === "day" || u === "hour" || u === "minute" || u === "second" || u === "millisecond") {
      const ms = u === "day" ? amount * MS_PER_DAY2 : u === "hour" ? amount * MS_PER_HOUR2 : u === "minute" ? amount * MS_PER_MINUTE2 : u === "second" ? amount * MS_PER_SECOND2 : amount;
      return new _DinDate(this.#utcMs + ms);
    }
    if (u === "month" || u === "year") {
      const bs = this._bsParts;
      let newMonth = bs.month;
      let newYear = bs.year;
      if (u === "year") {
        newYear += amount;
      } else {
        newMonth += amount;
      }
      while (newMonth > 12) {
        newMonth -= 12;
        newYear += 1;
      }
      while (newMonth < 1) {
        newMonth += 12;
        newYear -= 1;
      }
      const maxDay = getDaysInBsMonth(newYear, newMonth);
      const newDay = Math.min(bs.day, maxDay);
      return _DinDate.from({
        year: newYear,
        month: newMonth,
        day: newDay,
        hour: bs.hour,
        minute: bs.minute,
        second: bs.second,
        ms: bs.ms,
        calendar: "bs"
      });
    }
    throw new TypeError(`Unknown unit: ${unit}`);
  }
  // ── Immutability: set ─────────────────────────────────────────
  set(unit, value) {
    const bs = this._bsParts;
    const nepal = this._nepalParts;
    switch (unit) {
      case "year":
        return _DinDate.from({ year: value, month: bs.month, day: Math.min(bs.day, getDaysInBsMonth(value, bs.month)), hour: bs.hour, minute: bs.minute, second: bs.second, ms: bs.ms, calendar: "bs" });
      case "month": {
        const maxDay = getDaysInBsMonth(bs.year, value);
        return _DinDate.from({ year: bs.year, month: value, day: Math.min(bs.day, maxDay), hour: bs.hour, minute: bs.minute, second: bs.second, ms: bs.ms, calendar: "bs" });
      }
      case "day": {
        const maxDay = getDaysInBsMonth(bs.year, bs.month);
        if (value < 1 || value > maxDay) throw new RangeError(`Day ${value} out of range for BS ${bs.year}-${bs.month} (1\u2013${maxDay})`);
        return _DinDate.from({ year: bs.year, month: bs.month, day: value, hour: bs.hour, minute: bs.minute, second: bs.second, ms: bs.ms, calendar: "bs" });
      }
      case "hour":
        return new _DinDate(nepalPartsToUtcMs({ ...nepal, hour: value }));
      case "minute":
        return new _DinDate(nepalPartsToUtcMs({ ...nepal, minute: value }));
      case "second":
        return new _DinDate(nepalPartsToUtcMs({ ...nepal, second: value }));
      case "millisecond":
        return new _DinDate(nepalPartsToUtcMs({ ...nepal, ms: value }));
      default:
        throw new TypeError(`Unknown unit: ${unit}`);
    }
  }
  diff(other, unit) {
    const msDiff = this.#utcMs - other.#utcMs;
    if (unit) {
      switch (unit) {
        case "millisecond":
          return msDiff;
        case "second":
          return Math.trunc(msDiff / MS_PER_SECOND2);
        case "minute":
          return Math.trunc(msDiff / MS_PER_MINUTE2);
        case "hour":
          return Math.trunc(msDiff / MS_PER_HOUR2);
        case "day":
          return this._dayIndex - other._dayIndex;
        case "month": {
          const a = this._bsParts;
          const b = other._bsParts;
          return (a.year - b.year) * 12 + (a.month - b.month);
        }
        case "year":
          return this._bsParts.year - other._bsParts.year;
        default: {
          const _exhaustive = unit;
          throw new TypeError(`Unknown unit: ${_exhaustive}`);
        }
      }
    }
    const absMs = Math.abs(msDiff);
    const sign = msDiff < 0 ? -1 : 1;
    const totalDays = Math.floor(absMs / MS_PER_DAY2);
    const remMs = absMs - totalDays * MS_PER_DAY2;
    const hours = Math.floor(remMs / MS_PER_HOUR2);
    const remAfterHours = remMs - hours * MS_PER_HOUR2;
    const minutes = Math.floor(remAfterHours / MS_PER_MINUTE2);
    const remAfterMinutes = remAfterHours - minutes * MS_PER_MINUTE2;
    const seconds = Math.floor(remAfterMinutes / MS_PER_SECOND2);
    const milliseconds = remAfterMinutes - seconds * MS_PER_SECOND2;
    const aBs = this._bsParts;
    const bBs = other._bsParts;
    let yearDiff = aBs.year - bBs.year;
    let monthDiff = aBs.month - bBs.month;
    if (monthDiff < 0) {
      yearDiff -= 1;
      monthDiff += 12;
    }
    const aDay = aBs.day;
    const bDay = bBs.day;
    let dayDiff = aDay - bDay;
    if (dayDiff < 0) {
      monthDiff -= 1;
      if (monthDiff < 0) {
        yearDiff -= 1;
        monthDiff += 12;
      }
      const targetMonth = bBs.month + (aBs.month - bBs.month);
      const normalizedMonth = (targetMonth - 1) % 12 + 1;
      const targetYear = bBs.year + Math.floor((targetMonth - 1) / 12);
      const maxDay = getDaysInBsMonth(targetYear, normalizedMonth);
      dayDiff += maxDay;
    }
    return {
      years: yearDiff,
      months: monthDiff,
      days: totalDays * sign,
      hours: hours * sign,
      minutes: minutes * sign,
      seconds: seconds * sign,
      milliseconds: milliseconds * sign
    };
  }
  // ── Format ────────────────────────────────────────────────────
  format(pattern) {
    const nepal = this._nepalParts;
    const bs = this._bsParts;
    const adYYYY = String(nepal.year).padStart(4, "0");
    const adYY = adYYYY.slice(-2);
    const adMM = String(nepal.month).padStart(2, "0");
    const adDD = String(nepal.day).padStart(2, "0");
    const bsYYYY = String(bs.year).padStart(4, "0");
    const bsYY = bsYYYY.slice(-2);
    const bsMM = String(bs.month).padStart(2, "0");
    const bsDD = String(bs.day).padStart(2, "0");
    const HH = String(nepal.hour).padStart(2, "0");
    const mm = String(nepal.minute).padStart(2, "0");
    const ss = String(nepal.second).padStart(2, "0");
    const SSS = String(nepal.ms).padStart(3, "0");
    let result = "";
    let i = 0;
    while (i < pattern.length) {
      if (pattern[i] === "[") {
        const end = pattern.indexOf("]", i);
        if (end === -1) {
          result += pattern.slice(i + 1);
          i = pattern.length;
        } else {
          result += pattern.slice(i + 1, end);
          i = end + 1;
        }
      } else if (pattern.slice(i, i + 4) === "YYYY") {
        result += pattern.includes("BS") ? bsYYYY : adYYYY;
        i += 4;
      } else if (pattern.slice(i, i + 2) === "YY") {
        result += pattern.includes("BS") ? bsYY : adYY;
        i += 2;
      } else if (pattern.slice(i, i + 2) === "MM") {
        result += pattern.includes("BS") ? bsMM : adMM;
        i += 2;
      } else if (pattern.slice(i, i + 2) === "DD") {
        result += pattern.includes("BS") ? bsDD : adDD;
        i += 2;
      } else if (pattern.slice(i, i + 2) === "HH") {
        result += HH;
        i += 2;
      } else if (pattern.slice(i, i + 2) === "mm") {
        result += mm;
        i += 2;
      } else if (pattern.slice(i, i + 2) === "ss") {
        result += ss;
        i += 2;
      } else if (pattern.slice(i, i + 3) === "SSS") {
        result += SSS;
        i += 3;
      } else {
        result += pattern[i];
        i++;
      }
    }
    return result;
  }
  // ── Conversions ───────────────────────────────────────────────
  valueOf() {
    return this.#utcMs;
  }
  toDate() {
    return new Date(this.#utcMs);
  }
  toISOString() {
    return this.toDate().toISOString();
  }
  toString() {
    return this.toISOString();
  }
  toJSON() {
    return this.toISOString();
  }
  // ── Date-like getters (AD wall in Nepal TZ) ───────────────────
  getTime() {
    return this.#utcMs;
  }
  getFullYear() {
    return this._nepalParts.year;
  }
  getMonth() {
    return this._nepalParts.month - 1;
  }
  getDate() {
    return this._nepalParts.day;
  }
  getDay() {
    const dayIdx = this._dayIndex;
    return (dayIdx % 7 + 3) % 7;
  }
  getHours() {
    return this._nepalParts.hour;
  }
  getMinutes() {
    return this._nepalParts.minute;
  }
  getSeconds() {
    return this._nepalParts.second;
  }
  getMilliseconds() {
    return this._nepalParts.ms;
  }
  // ── BS accessors ──────────────────────────────────────────────
  bsYear() {
    return this._bsParts.year;
  }
  bsMonth() {
    return this._bsParts.month;
  }
  bsDate() {
    return this._bsParts.day;
  }
  bsHour() {
    return this._bsParts.hour;
  }
  bsMinute() {
    return this._bsParts.minute;
  }
  bsSecond() {
    return this._bsParts.second;
  }
  bsMs() {
    return this._bsParts.ms;
  }
  monthName(locale = "en") {
    return locale === "ne" ? getMonthNameNe(this._bsParts.month) : getMonthNameEn(this._bsParts.month);
  }
  // ── Full decomposition ────────────────────────────────────────
  bs() {
    return { ...this._bsParts };
  }
  ad() {
    return { ...this._nepalParts };
  }
  // ── Day index (for internal use / advanced) ───────────────────
  dayIndex() {
    return this._dayIndex;
  }
  diffNow(unit) {
    const now = Date.now();
    const diffMs = this.#utcMs - now;
    if (unit) {
      switch (unit) {
        case "millisecond":
          return diffMs;
        case "second":
          return Math.trunc(diffMs / 1e3);
        case "minute":
          return Math.trunc(diffMs / 6e4);
        case "hour":
          return Math.trunc(diffMs / 36e5);
        case "day":
          return this._dayIndex - nepalDateToDayIndex(
            ...(() => {
              const p = utcMsToNepalParts(now);
              return [p.year, p.month, p.day];
            })()
          );
        default:
          throw new TypeError(`Cannot use unit "${unit}" with diffNow`);
      }
    }
    return Duration.fromMs(diffMs);
  }
  /** Humanized string for time ago / time from now. */
  fromNow(locale = "en") {
    return this.diffNow().humanizeAgo(locale);
  }
  /** Humanized string from other to this. */
  from(other, locale = "en") {
    const diffMs = this.#utcMs - other.#utcMs;
    return Duration.fromMs(diffMs).humanizeAgo(locale);
  }
  /** Watch this date with live-updating relative text. */
  watchRelative(callback, options) {
    return watchRelative(this, callback, options);
  }
};

// src/dinjs.ts
function dinjs(input, format, options) {
  if (input === void 0) {
    return new DinDate();
  }
  if (input instanceof Date) {
    return new DinDate(input);
  }
  if (typeof input === "number") {
    return new DinDate(input);
  }
  if (typeof input === "string") {
    return parseString(input, format || "YYYY-MM-DD", options?.bs ?? false);
  }
  throw new TypeError("Invalid arguments to dinjs()");
}
function parseString(input, format, isBs) {
  const parts = extractParts(input, format);
  const year = parseInt(parts.YYYY ?? parts.YY ?? "0", 10);
  const month = parseInt(parts.MM ?? "1", 10);
  const day = parseInt(parts.DD ?? "1", 10);
  const hour = parseInt(parts.HH ?? "0", 10);
  const minute = parseInt(parts.mm ?? "0", 10);
  const second = parseInt(parts.ss ?? "0", 10);
  const ms = parseInt(parts.SSS ?? "0", 10);
  if (isBs) {
    return DinDate.from({ year, month, day, hour, minute, second, ms, calendar: "bs" });
  }
  return DinDate.from({ year, month, day, hour, minute, second, ms, calendar: "ad" });
}
function extractParts(input, format) {
  const result = {};
  let fi = 0;
  let ii = 0;
  while (fi < format.length && ii < input.length) {
    if (format[fi] === "[") {
      const end = format.indexOf("]", fi);
      const literal = end === -1 ? format.slice(fi + 1) : format.slice(fi + 1, end);
      ii += literal.length;
      fi = end === -1 ? format.length : end + 1;
    } else if (format.slice(fi, fi + 4) === "YYYY") {
      result.YYYY = input.slice(ii, ii + 4);
      fi += 4;
      ii += 4;
    } else if (format.slice(fi, fi + 2) === "YY") {
      result.YY = input.slice(ii, ii + 2);
      fi += 2;
      ii += 2;
    } else if (format.slice(fi, fi + 2) === "MM") {
      result.MM = input.slice(ii, ii + 2);
      fi += 2;
      ii += 2;
    } else if (format.slice(fi, fi + 2) === "DD") {
      result.DD = input.slice(ii, ii + 2);
      fi += 2;
      ii += 2;
    } else if (format.slice(fi, fi + 2) === "HH") {
      result.HH = input.slice(ii, ii + 2);
      fi += 2;
      ii += 2;
    } else if (format.slice(fi, fi + 2) === "mm") {
      result.mm = input.slice(ii, ii + 2);
      fi += 2;
      ii += 2;
    } else if (format.slice(fi, fi + 2) === "ss") {
      result.ss = input.slice(ii, ii + 2);
      fi += 2;
      ii += 2;
    } else if (format.slice(fi, fi + 3) === "SSS") {
      result.SSS = input.slice(ii, ii + 3);
      fi += 3;
      ii += 3;
    } else {
      fi++;
      ii++;
    }
  }
  return result;
}

// src/data/nepaliCalenderData.ts
var dinjs_NEPALI_CALENDER = {
  dinjs_CALENDER_YEAR_START: 2e3,
  dinjs_CALENDER_YEAR_END: 2089,
  dinjs_REFRENCEDATE_BAISAKH_1_YEAR_START: "1943-04-14",
  dinjs_DATA: [
    {
      "\u0935\u0948\u0936\u093E\u0916": 30,
      "\u091C\u0947\u0920": 32,
      "\u0905\u0938\u093E\u0930": 31,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 30,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 30,
      "\u092A\u0941\u0937": 29,
      "\u092E\u093E\u0918": 30,
      "\u092B\u093E\u0917\u0941\u0928": 29,
      "\u091A\u0948\u0924": 31
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 31,
      "\u0905\u0938\u093E\u0930": 32,
      "\u0938\u093E\u0909\u0928": 31,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 31,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 29,
      "\u092A\u0941\u0937": 30,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 31,
      "\u0905\u0938\u093E\u0930": 32,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 30,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 29,
      "\u092A\u0941\u0937": 30,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 32,
      "\u0905\u0938\u093E\u0930": 31,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 30,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 30,
      "\u092A\u0941\u0937": 29,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 31
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 30,
      "\u091C\u0947\u0920": 32,
      "\u0905\u0938\u093E\u0930": 31,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 30,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 30,
      "\u092A\u0941\u0937": 29,
      "\u092E\u093E\u0918": 30,
      "\u092B\u093E\u0917\u0941\u0928": 29,
      "\u091A\u0948\u0924": 31
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 31,
      "\u0905\u0938\u093E\u0930": 32,
      "\u0938\u093E\u0909\u0928": 31,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 31,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 29,
      "\u092A\u0941\u0937": 30,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 31,
      "\u0905\u0938\u093E\u0930": 32,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 30,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 29,
      "\u092A\u0941\u0937": 30,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 32,
      "\u0905\u0938\u093E\u0930": 31,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 30,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 30,
      "\u092A\u0941\u0937": 29,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 31
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 31,
      "\u0905\u0938\u093E\u0930": 31,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 31,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 29,
      "\u092E\u0902\u0938\u093F\u0930": 30,
      "\u092A\u0941\u0937": 30,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 29,
      "\u091A\u0948\u0924": 31
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 31,
      "\u0905\u0938\u093E\u0930": 32,
      "\u0938\u093E\u0909\u0928": 31,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 31,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 29,
      "\u092A\u0941\u0937": 30,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 31,
      "\u0905\u0938\u093E\u0930": 32,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 30,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 29,
      "\u092A\u0941\u0937": 30,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 32,
      "\u0905\u0938\u093E\u0930": 31,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 30,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 30,
      "\u092A\u0941\u0937": 29,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 31
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 31,
      "\u0905\u0938\u093E\u0930": 31,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 31,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 29,
      "\u092E\u0902\u0938\u093F\u0930": 30,
      "\u092A\u0941\u0937": 30,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 31,
      "\u0905\u0938\u093E\u0930": 32,
      "\u0938\u093E\u0909\u0928": 31,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 31,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 29,
      "\u092A\u0941\u0937": 30,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 31,
      "\u0905\u0938\u093E\u0930": 32,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 30,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 29,
      "\u092A\u0941\u0937": 30,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 32,
      "\u0905\u0938\u093E\u0930": 31,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 30,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 30,
      "\u092A\u0941\u0937": 29,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 31
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 31,
      "\u0905\u0938\u093E\u0930": 31,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 31,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 29,
      "\u092E\u0902\u0938\u093F\u0930": 30,
      "\u092A\u0941\u0937": 30,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 31,
      "\u0905\u0938\u093E\u0930": 32,
      "\u0938\u093E\u0909\u0928": 31,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 31,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 29,
      "\u092A\u0941\u0937": 30,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 32,
      "\u0905\u0938\u093E\u0930": 31,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 30,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 29,
      "\u092A\u0941\u0937": 30,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 32,
      "\u0905\u0938\u093E\u0930": 31,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 30,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 30,
      "\u092A\u0941\u0937": 29,
      "\u092E\u093E\u0918": 30,
      "\u092B\u093E\u0917\u0941\u0928": 29,
      "\u091A\u0948\u0924": 31
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 31,
      "\u0905\u0938\u093E\u0930": 31,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 31,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 29,
      "\u092A\u0941\u0937": 30,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 31,
      "\u0905\u0938\u093E\u0930": 32,
      "\u0938\u093E\u0909\u0928": 31,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 31,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 29,
      "\u092A\u0941\u0937": 30,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 32,
      "\u0905\u0938\u093E\u0930": 31,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 30,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 30,
      "\u092A\u0941\u0937": 29,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 32,
      "\u0905\u0938\u093E\u0930": 31,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 30,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 30,
      "\u092A\u0941\u0937": 29,
      "\u092E\u093E\u0918": 30,
      "\u092B\u093E\u0917\u0941\u0928": 29,
      "\u091A\u0948\u0924": 31
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 31,
      "\u0905\u0938\u093E\u0930": 31,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 31,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 29,
      "\u092A\u0941\u0937": 30,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 31,
      "\u0905\u0938\u093E\u0930": 32,
      "\u0938\u093E\u0909\u0928": 31,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 31,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 29,
      "\u092A\u0941\u0937": 30,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 32,
      "\u0905\u0938\u093E\u0930": 31,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 30,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 30,
      "\u092A\u0941\u0937": 29,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 31
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 30,
      "\u091C\u0947\u0920": 32,
      "\u0905\u0938\u093E\u0930": 31,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 30,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 30,
      "\u092A\u0941\u0937": 29,
      "\u092E\u093E\u0918": 30,
      "\u092B\u093E\u0917\u0941\u0928": 29,
      "\u091A\u0948\u0924": 31
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 31,
      "\u0905\u0938\u093E\u0930": 32,
      "\u0938\u093E\u0909\u0928": 31,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 31,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 29,
      "\u092A\u0941\u0937": 30,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 31,
      "\u0905\u0938\u093E\u0930": 32,
      "\u0938\u093E\u0909\u0928": 31,
      "\u092D\u0926\u094C": 32,
      "\u0905\u0938\u094B\u091C": 30,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 29,
      "\u092A\u0941\u0937": 30,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 32,
      "\u0905\u0938\u093E\u0930": 31,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 30,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 30,
      "\u092A\u0941\u0937": 29,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 31
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 30,
      "\u091C\u0947\u0920": 32,
      "\u0905\u0938\u093E\u0930": 31,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 30,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 30,
      "\u092A\u0941\u0937": 29,
      "\u092E\u093E\u0918": 30,
      "\u092B\u093E\u0917\u0941\u0928": 29,
      "\u091A\u0948\u0924": 31
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 31,
      "\u0905\u0938\u093E\u0930": 32,
      "\u0938\u093E\u0909\u0928": 31,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 31,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 29,
      "\u092A\u0941\u0937": 30,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 31,
      "\u0905\u0938\u093E\u0930": 32,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 30,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 29,
      "\u092A\u0941\u0937": 30,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 32,
      "\u0905\u0938\u093E\u0930": 31,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 30,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 30,
      "\u092A\u0941\u0937": 29,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 31
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 30,
      "\u091C\u0947\u0920": 32,
      "\u0905\u0938\u093E\u0930": 31,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 31,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 29,
      "\u092E\u0902\u0938\u093F\u0930": 30,
      "\u092A\u0941\u0937": 30,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 29,
      "\u091A\u0948\u0924": 31
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 31,
      "\u0905\u0938\u093E\u0930": 32,
      "\u0938\u093E\u0909\u0928": 31,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 31,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 29,
      "\u092A\u0941\u0937": 30,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 31,
      "\u0905\u0938\u093E\u0930": 32,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 30,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 29,
      "\u092A\u0941\u0937": 30,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 32,
      "\u0905\u0938\u093E\u0930": 31,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 30,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 30,
      "\u092A\u0941\u0937": 29,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 31
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 31,
      "\u0905\u0938\u093E\u0930": 31,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 31,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 29,
      "\u092E\u0902\u0938\u093F\u0930": 30,
      "\u092A\u0941\u0937": 30,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 31,
      "\u0905\u0938\u093E\u0930": 32,
      "\u0938\u093E\u0909\u0928": 31,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 31,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 29,
      "\u092A\u0941\u0937": 30,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 31,
      "\u0905\u0938\u093E\u0930": 32,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 30,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 29,
      "\u092A\u0941\u0937": 30,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 32,
      "\u0905\u0938\u093E\u0930": 31,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 30,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 30,
      "\u092A\u0941\u0937": 29,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 31
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 31,
      "\u0905\u0938\u093E\u0930": 31,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 31,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 29,
      "\u092E\u0902\u0938\u093F\u0930": 30,
      "\u092A\u0941\u0937": 30,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 31,
      "\u0905\u0938\u093E\u0930": 32,
      "\u0938\u093E\u0909\u0928": 31,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 31,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 29,
      "\u092A\u0941\u0937": 30,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 32,
      "\u0905\u0938\u093E\u0930": 31,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 30,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 29,
      "\u092A\u0941\u0937": 30,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 32,
      "\u0905\u0938\u093E\u0930": 31,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 30,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 30,
      "\u092A\u0941\u0937": 29,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 31
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 31,
      "\u0905\u0938\u093E\u0930": 31,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 31,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 29,
      "\u092A\u0941\u0937": 30,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 31,
      "\u0905\u0938\u093E\u0930": 32,
      "\u0938\u093E\u0909\u0928": 31,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 31,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 29,
      "\u092A\u0941\u0937": 30,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 32,
      "\u0905\u0938\u093E\u0930": 31,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 30,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 30,
      "\u092A\u0941\u0937": 29,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 32,
      "\u0905\u0938\u093E\u0930": 31,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 30,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 30,
      "\u092A\u0941\u0937": 29,
      "\u092E\u093E\u0918": 30,
      "\u092B\u093E\u0917\u0941\u0928": 29,
      "\u091A\u0948\u0924": 31
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 31,
      "\u0905\u0938\u093E\u0930": 31,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 31,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 29,
      "\u092A\u0941\u0937": 30,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 31,
      "\u0905\u0938\u093E\u0930": 32,
      "\u0938\u093E\u0909\u0928": 31,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 31,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 29,
      "\u092A\u0941\u0937": 30,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 32,
      "\u0905\u0938\u093E\u0930": 31,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 30,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 30,
      "\u092A\u0941\u0937": 29,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 32,
      "\u0905\u0938\u093E\u0930": 31,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 30,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 30,
      "\u092A\u0941\u0937": 29,
      "\u092E\u093E\u0918": 30,
      "\u092B\u093E\u0917\u0941\u0928": 29,
      "\u091A\u0948\u0924": 31
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 31,
      "\u0905\u0938\u093E\u0930": 32,
      "\u0938\u093E\u0909\u0928": 31,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 31,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 29,
      "\u092A\u0941\u0937": 30,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 31,
      "\u0905\u0938\u093E\u0930": 32,
      "\u0938\u093E\u0909\u0928": 31,
      "\u092D\u0926\u094C": 32,
      "\u0905\u0938\u094B\u091C": 30,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 29,
      "\u092A\u0941\u0937": 30,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 32,
      "\u0905\u0938\u093E\u0930": 31,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 30,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 30,
      "\u092A\u0941\u0937": 29,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 31
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 30,
      "\u091C\u0947\u0920": 32,
      "\u0905\u0938\u093E\u0930": 31,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 30,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 30,
      "\u092A\u0941\u0937": 29,
      "\u092E\u093E\u0918": 30,
      "\u092B\u093E\u0917\u0941\u0928": 29,
      "\u091A\u0948\u0924": 31
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 31,
      "\u0905\u0938\u093E\u0930": 32,
      "\u0938\u093E\u0909\u0928": 31,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 31,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 29,
      "\u092A\u0941\u0937": 30,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 31,
      "\u0905\u0938\u093E\u0930": 32,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 30,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 29,
      "\u092A\u0941\u0937": 30,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 32,
      "\u0905\u0938\u093E\u0930": 31,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 30,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 30,
      "\u092A\u0941\u0937": 29,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 31
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 31,
      "\u0905\u0938\u093E\u0930": 31,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 31,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 29,
      "\u092E\u0902\u0938\u093F\u0930": 30,
      "\u092A\u0941\u0937": 29,
      "\u092E\u093E\u0918": 30,
      "\u092B\u093E\u0917\u0941\u0928": 29,
      "\u091A\u0948\u0924": 31
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 31,
      "\u0905\u0938\u093E\u0930": 32,
      "\u0938\u093E\u0909\u0928": 31,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 31,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 29,
      "\u092A\u0941\u0937": 30,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 31,
      "\u0905\u0938\u093E\u0930": 32,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 30,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 29,
      "\u092A\u0941\u0937": 30,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 32,
      "\u0905\u0938\u093E\u0930": 31,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 30,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 30,
      "\u092A\u0941\u0937": 29,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 31
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 31,
      "\u0905\u0938\u093E\u0930": 31,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 31,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 29,
      "\u092E\u0902\u0938\u093F\u0930": 30,
      "\u092A\u0941\u0937": 30,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 29,
      "\u091A\u0948\u0924": 31
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 31,
      "\u0905\u0938\u093E\u0930": 32,
      "\u0938\u093E\u0909\u0928": 31,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 31,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 29,
      "\u092A\u0941\u0937": 30,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 31,
      "\u0905\u0938\u093E\u0930": 32,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 30,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 29,
      "\u092A\u0941\u0937": 30,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 32,
      "\u0905\u0938\u093E\u0930": 31,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 30,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 30,
      "\u092A\u0941\u0937": 29,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 31
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 31,
      "\u0905\u0938\u093E\u0930": 31,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 31,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 29,
      "\u092E\u0902\u0938\u093F\u0930": 30,
      "\u092A\u0941\u0937": 30,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 31,
      "\u0905\u0938\u093E\u0930": 32,
      "\u0938\u093E\u0909\u0928": 31,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 31,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 29,
      "\u092A\u0941\u0937": 30,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 32,
      "\u0905\u0938\u093E\u0930": 31,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 30,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 29,
      "\u092A\u0941\u0937": 30,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 32,
      "\u0905\u0938\u093E\u0930": 31,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 30,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 30,
      "\u092A\u0941\u0937": 29,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 31
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 31,
      "\u0905\u0938\u093E\u0930": 31,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 31,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 29,
      "\u092A\u0941\u0937": 30,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 31,
      "\u0905\u0938\u093E\u0930": 32,
      "\u0938\u093E\u0909\u0928": 31,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 31,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 29,
      "\u092A\u0941\u0937": 30,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 32,
      "\u0905\u0938\u093E\u0930": 31,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 30,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 30,
      "\u092A\u0941\u0937": 29,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 32,
      "\u0905\u0938\u093E\u0930": 31,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 30,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 30,
      "\u092A\u0941\u0937": 29,
      "\u092E\u093E\u0918": 30,
      "\u092B\u093E\u0917\u0941\u0928": 29,
      "\u091A\u0948\u0924": 31
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 31,
      "\u0905\u0938\u093E\u0930": 31,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 31,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 29,
      "\u092A\u0941\u0937": 30,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 31,
      "\u0905\u0938\u093E\u0930": 32,
      "\u0938\u093E\u0909\u0928": 31,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 31,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 29,
      "\u092A\u0941\u0937": 30,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 32,
      "\u0905\u0938\u093E\u0930": 31,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 30,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 30,
      "\u092A\u0941\u0937": 29,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 32,
      "\u0905\u0938\u093E\u0930": 31,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 30,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 30,
      "\u092A\u0941\u0937": 29,
      "\u092E\u093E\u0918": 30,
      "\u092B\u093E\u0917\u0941\u0928": 29,
      "\u091A\u0948\u0924": 31
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 31,
      "\u0905\u0938\u093E\u0930": 31,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 31,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 29,
      "\u092A\u0941\u0937": 30,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 31,
      "\u0905\u0938\u093E\u0930": 32,
      "\u0938\u093E\u0909\u0928": 31,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 31,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 29,
      "\u092A\u0941\u0937": 30,
      "\u092E\u093E\u0918": 29,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 31,
      "\u0905\u0938\u093E\u0930": 32,
      "\u0938\u093E\u0909\u0928": 31,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 30,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 30,
      "\u092A\u0941\u0937": 29,
      "\u092E\u093E\u0918": 30,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 32,
      "\u0905\u0938\u093E\u0930": 31,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 30,
      "\u0905\u0938\u094B\u091C": 31,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 30,
      "\u092A\u0941\u0937": 29,
      "\u092E\u093E\u0918": 30,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 30,
      "\u091C\u0947\u0920": 32,
      "\u0905\u0938\u093E\u0930": 31,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 30,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 30,
      "\u092A\u0941\u0937": 29,
      "\u092E\u093E\u0918": 30,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 31,
      "\u091C\u0947\u0920": 31,
      "\u0905\u0938\u093E\u0930": 32,
      "\u0938\u093E\u0909\u0928": 31,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 31,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 30,
      "\u092A\u0941\u0937": 30,
      "\u092E\u093E\u0918": 30,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 30,
      "\u091C\u0947\u0920": 31,
      "\u0905\u0938\u093E\u0930": 32,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 30,
      "\u0905\u0938\u094B\u091C": 31,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 30,
      "\u092A\u0941\u0937": 29,
      "\u092E\u093E\u0918": 30,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    },
    {
      "\u0935\u0948\u0936\u093E\u0916": 30,
      "\u091C\u0947\u0920": 32,
      "\u0905\u0938\u093E\u0930": 31,
      "\u0938\u093E\u0909\u0928": 32,
      "\u092D\u0926\u094C": 31,
      "\u0905\u0938\u094B\u091C": 30,
      "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 30,
      "\u092E\u0902\u0938\u093F\u0930": 30,
      "\u092A\u0941\u0937": 29,
      "\u092E\u093E\u0918": 30,
      "\u092B\u093E\u0917\u0941\u0928": 30,
      "\u091A\u0948\u0924": 30
    }
  ]
};

// src/Methods/dinjs_GET_MONTH_NAME.ts
function dinjs_GET_MONTH_NAME(month) {
  const months = {
    1: "\u0935\u0948\u0936\u093E\u0916",
    2: "\u091C\u0947\u0920",
    3: "\u0905\u0938\u093E\u0930",
    4: "\u0938\u093E\u0909\u0928",
    5: "\u092D\u0926\u094C",
    6: "\u0905\u0938\u094B\u091C",
    7: "\u0915\u093E\u0930\u094D\u0924\u093F\u0915",
    8: "\u092E\u0902\u0938\u093F\u0930",
    9: "\u092A\u0941\u0937",
    10: "\u092E\u093E\u0918",
    11: "\u092B\u093E\u0917\u0941\u0928",
    12: "\u091A\u0948\u0924"
  };
  return months[month];
}

// src/Methods/dinjs_GET_MONTH_DAYS.ts
function dinjs_GET_MONTH_DAYS(year, month) {
  const maxYear = dinjs_NEPALI_CALENDER.dinjs_CALENDER_YEAR_START + Object.keys(dinjs_NEPALI_CALENDER.dinjs_DATA).length - 1;
  if (year < dinjs_NEPALI_CALENDER.dinjs_CALENDER_YEAR_START || year > maxYear) {
    throw new Error(`Year ${year} is out of range in the Nepali calendar data. Valid range is ${dinjs_NEPALI_CALENDER.dinjs_CALENDER_YEAR_START}-${maxYear}.`);
  }
  const monthName = dinjs_GET_MONTH_NAME(month);
  const yearData = dinjs_NEPALI_CALENDER.dinjs_DATA[year - dinjs_NEPALI_CALENDER.dinjs_CALENDER_YEAR_START];
  return yearData[monthName];
}

// src/Methods/dinjs_ADD_DATE_BS.ts
function dinjs_ADD_DATE_BS(Date_object, years, months, days) {
  if (years < 0) {
    Date_object.YEAR -= Math.abs(years);
    if (Date_object.YEAR < dinjs_NEPALI_CALENDER.dinjs_CALENDER_YEAR_START) {
      throw new Error(`${Date_object.YEAR} exceeds the range`);
    }
    return Date_object;
  }
  if (months < 0) {
    months = Math.abs(months);
    if (Date_object.MONTH > months) {
      Date_object.MONTH = Date_object.MONTH - months;
      return Date_object;
    } else if (Date_object.MONTH <= months) {
      while (months) {
        months--;
        if (Date_object.MONTH == 1) {
          Date_object.MONTH = 12;
          Date_object.YEAR--;
        } else {
          Date_object.MONTH--;
        }
      }
    }
    return Date_object;
  }
  Date_object.YEAR += years;
  Date_object.MONTH += months;
  Date_object.YEAR += Math.floor(Date_object.MONTH / 13);
  Date_object.MONTH = Date_object.MONTH % 13 == 0 ? 1 : Date_object.MONTH % 13;
  if (Date_object.YEAR > dinjs_NEPALI_CALENDER.dinjs_CALENDER_YEAR_START + Object.keys(dinjs_NEPALI_CALENDER.dinjs_DATA).length - 1) {
    throw new Error(`Year ${Date_object.YEAR} Extends the range`);
  }
  while (days) {
    const daysInMonth = dinjs_GET_MONTH_DAYS(Date_object.YEAR, Date_object.MONTH);
    if (Date_object.DATE > daysInMonth) {
      Date_object.DATE = 1;
      Date_object.MONTH++;
      if (Date_object.MONTH > 12) {
        Date_object.MONTH = 1;
        Date_object.YEAR++;
      }
    } else {
      Date_object.DATE++;
      days--;
    }
  }
  return Date_object;
}

// src/Methods/dinjs_FORMAT_DATE.ts
function dinjs_FORMAT_DATE(DateFormat, year, month, date) {
  DateFormat = DateFormat.toUpperCase();
  if (!DateFormat.includes("YYYY") || !DateFormat.includes("MM") || !DateFormat.includes("DD") || DateFormat.includes("-") && DateFormat.includes("/")) {
    throw new Error("Invalid date format or delimiter.");
  }
  DateFormat = DateFormat.replace("YYYY", `${year}`);
  DateFormat = DateFormat.replace("MM", `${month < 10 ? "0" + month : month}`);
  DateFormat = DateFormat.replace("DD", `${date < 10 ? "0" + date : date}`);
  return DateFormat;
}

// src/Methods/dinjs_CONVERT_AD_TO_BS.ts
function dinjs_CONVERT_TO_BS(dinjs_Format, dinjs_YEAR, dinjs_MONTH, dinjs_DATE) {
  const dinjs_REFRENCE_DATE = new Date(
    dinjs_NEPALI_CALENDER.dinjs_REFRENCEDATE_BAISAKH_1_YEAR_START
  );
  const dinjs_AD_DATE = new Date(
    dinjs_FORMAT_DATE("YYYY-MM-DD", dinjs_YEAR, dinjs_MONTH, dinjs_DATE)
  );
  const DIFF = dinjs_AD_DATE.getTime() - dinjs_REFRENCE_DATE.getTime();
  let DAYS_DIFF = Math.round(DIFF / (1e3 * 60 * 60 * 24));
  let dinjs_NEPALI_YEAR = dinjs_NEPALI_CALENDER.dinjs_CALENDER_YEAR_START;
  let dinjs_NEPALI_MONTH = 1;
  let dinjs_NEPALI_DATE = 1;
  while (DAYS_DIFF > 0) {
    dinjs_NEPALI_DATE++;
    if (dinjs_NEPALI_YEAR > dinjs_NEPALI_CALENDER.dinjs_CALENDER_YEAR_START + Object.keys(dinjs_NEPALI_CALENDER.dinjs_DATA).length - 1) {
      throw new Error(`Year ${dinjs_NEPALI_YEAR} Extends the range`);
    }
    const daysInMonth = dinjs_GET_MONTH_DAYS(dinjs_NEPALI_YEAR, dinjs_NEPALI_MONTH);
    if (dinjs_NEPALI_DATE > daysInMonth) {
      dinjs_NEPALI_DATE = 1;
      dinjs_NEPALI_MONTH++;
      if (dinjs_NEPALI_MONTH > 12) {
        dinjs_NEPALI_MONTH = 1;
        dinjs_NEPALI_YEAR++;
      }
    }
    DAYS_DIFF--;
  }
  return dinjs_FORMAT_DATE(
    dinjs_Format,
    dinjs_NEPALI_YEAR,
    dinjs_NEPALI_MONTH,
    dinjs_NEPALI_DATE
  );
}

// src/Methods/dinjs_DAYS_DIFFERENCE_BS.ts
function dinjs_DAYS_DIFFERENCE_BS(Date_object, obj) {
  let isSmaller = false;
  if (Date_object.YEAR < obj.YEAR || Date_object.YEAR <= obj.YEAR && Date_object.MONTH < obj.MONTH || Date_object.YEAR <= obj.YEAR && Date_object.MONTH <= obj.MONTH && Date_object.DATE < obj.DATE) {
    isSmaller = true;
  }
  if (isSmaller) {
    let temp = obj;
    obj = Date_object;
    Date_object = temp;
  }
  let days = 0;
  while (!(Date_object.YEAR == obj.YEAR && Date_object.MONTH == obj.MONTH && Date_object.DATE == obj.DATE)) {
    const daysInMonth = dinjs_GET_MONTH_DAYS(obj.YEAR, obj.MONTH);
    if (obj.DATE > daysInMonth) {
      obj.DATE = 1;
      obj.MONTH++;
      if (obj.MONTH > 12) {
        obj.MONTH = 1;
        obj.YEAR++;
      }
    } else {
      days++;
      obj.DATE++;
    }
  }
  return isSmaller ? -days : days;
}

// src/Methods/dinjs_PARSE_DATE.ts
function dinjs_PARSE_DATE(Date2, Format) {
  let DATE_OBJECT = {};
  DATE_OBJECT.YEAR = parseInt(Date2.substring(Format.indexOf("Y"), Format.indexOf("Y") + 4));
  DATE_OBJECT.MONTH = parseInt(Date2.substring(Format.indexOf("M"), Format.indexOf("M") + 2));
  DATE_OBJECT.DATE = parseInt(Date2.substring(Format.indexOf("D"), Format.indexOf("D") + 2));
  return DATE_OBJECT;
}

// src/Methods/dinjs_STRINGIFY_DATE.ts
function dinjs_STRINGIFY_DATE(DATE_OBJECT, Format) {
  Format = Format.replace("YYYY", `${DATE_OBJECT.YEAR}`);
  Format = Format.replace("MM", `${DATE_OBJECT.MONTH < 10 ? "0" + DATE_OBJECT.MONTH : DATE_OBJECT.MONTH}`);
  Format = Format.replace("DD", `${DATE_OBJECT.DATE < 10 ? "0" + DATE_OBJECT.DATE : DATE_OBJECT.DATE}`);
  return Format;
}

// src/Methods/dinjs_SUB_DAYS_BS.ts
function dinjs_SUB_DAYS_BS(Date_object, days) {
  while (days) {
    days--;
    if (Date_object.DATE == 1) {
      if (Date_object.MONTH == 1) {
        Date_object.YEAR--;
        Date_object.MONTH = 12;
      } else {
        Date_object.MONTH--;
      }
      const daysInMonth = dinjs_GET_MONTH_DAYS(Date_object.YEAR, Date_object.MONTH);
      Date_object.DATE = daysInMonth;
    } else {
      Date_object.DATE--;
    }
  }
  return Date_object;
}

// src/index.ts
var _warned = /* @__PURE__ */ new Set();
function _dep(name) {
  if (!_warned.has(name)) {
    _warned.add(name);
    console.warn(
      `[dinjs] ${name}() is deprecated. Use the v4 DinDate API instead. See migration guide.`
    );
  }
}
var dinjs_v3 = class {
  dateInBS;
  DATE_FORMAT_STRING;
  DATE_OBJECT;
  constructor(DATE, FORMAT_STRING = "YYYY-MM-DD", isInBS = false) {
    _dep("new dinjs");
    this.DATE_FORMAT_STRING = FORMAT_STRING.toUpperCase();
    if (!DATE) {
      const dinjs_TODAYS_DATE = /* @__PURE__ */ new Date();
      const dinjs_CURRENT_YEAR = dinjs_TODAYS_DATE.getFullYear();
      const dinjs_CURRENT_MONTH = dinjs_TODAYS_DATE.getMonth() + 1;
      const dinjs_CURRENT_DATE = dinjs_TODAYS_DATE.getDate();
      this.dateInBS = dinjs_CONVERT_TO_BS(
        this.DATE_FORMAT_STRING,
        dinjs_CURRENT_YEAR,
        dinjs_CURRENT_MONTH,
        dinjs_CURRENT_DATE
      );
    } else if (DATE && FORMAT_STRING && !isInBS) {
      const dinjs_DATE = dinjs_PARSE_DATE(DATE, this.DATE_FORMAT_STRING);
      this.dateInBS = dinjs_CONVERT_TO_BS(
        this.DATE_FORMAT_STRING,
        dinjs_DATE.YEAR,
        dinjs_DATE.MONTH,
        dinjs_DATE.DATE
      );
    } else if (DATE && FORMAT_STRING && isInBS) {
      this.dateInBS = DATE;
    } else {
      throw new Error("unexpected error occured please check the parameters");
    }
    this.DATE_OBJECT = dinjs_PARSE_DATE(this.dateInBS, this.DATE_FORMAT_STRING);
  }
  #update() {
    this.dateInBS = dinjs_STRINGIFY_DATE(this.DATE_OBJECT, this.DATE_FORMAT_STRING);
  }
  addDate(Years, Months, Days) {
    _dep("addDate");
    this.DATE_OBJECT = dinjs_ADD_DATE_BS(this.DATE_OBJECT, Years, Months, Days);
    this.#update();
  }
  daysDifference(dinjs_DATE) {
    _dep("daysDifference");
    return dinjs_DAYS_DIFFERENCE_BS(this.DATE_OBJECT, dinjs_DATE.DATE_OBJECT);
  }
  subtractDays(Days) {
    _dep("subtractDays");
    this.DATE_OBJECT = dinjs_SUB_DAYS_BS(this.DATE_OBJECT, Days);
    this.#update();
  }
  subtractMonths(Months) {
    _dep("subtractMonths");
    this.addDate(0, -Months, 0);
  }
  subtractYears(Years) {
    _dep("subtractYears");
    this.addDate(-Years, 0, 0);
  }
  addDays(Days) {
    _dep("addDays");
    this.addDate(0, 0, Days);
  }
  addMonths(Months) {
    _dep("addMonths");
    this.addDate(0, Months, 0);
  }
  addYears(Years) {
    _dep("addYears");
    this.addDate(Years, 0, 0);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BS_YEAR_COUNT,
  BS_YEAR_END,
  BS_YEAR_START,
  DinDate,
  Duration,
  NEPAL_OFFSET_MS,
  NEPAL_TZ,
  TOTAL_DAYS,
  dinjs,
  dinjs_v3,
  getDaysInBsMonth,
  getMonthNameEn,
  getMonthNameNe,
  isValidBsDate,
  watchRelative
});
