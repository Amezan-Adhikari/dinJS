import { NEPAL_OFFSET_MS, utcMsToNepalParts, nepalPartsToUtcMs, utcMsToBsDateTime, bsDateTimeToUtcMs } from "./core/time";
import { bsToDayIndex, dayIndexToBs, getDaysInBsMonth, isValidBsDate, BsDate } from "./core/day-index";
import { nepalDateToDayIndex, dayIndexToNepalDate, NepaliParts, BsDateTime } from "./core/time";
import { getMonthNameNe, getMonthNameEn } from "./core/month-names";
import { BS_YEAR_START, BS_YEAR_COUNT, MONTHS_IN_YEAR, DAYS_IN_MONTH } from "./core/calendar-data";
import { Duration } from "./duration/duration";
import { watchRelative as _watchRelative } from "./duration/relative";
import { LRUCache } from "./core/cache";

// ── Types ───────────────────────────────────────────────────────

export type Unit =
  | "year"
  | "month"
  | "day"
  | "hour"
  | "minute"
  | "second"
  | "millisecond";

export type CalendarType = "bs" | "ad";

export interface DinDateInput {
  year: number;
  month: number;
  day: number;
  hour?: number;
  minute?: number;
  second?: number;
  ms?: number;
  calendar: CalendarType;
}

export interface DiffResult {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}

const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = 60 * MS_PER_SECOND;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;
const MS_PER_DAY = 24 * MS_PER_HOUR;

// ── Helpers ─────────────────────────────────────────────────────

function cache<T>(target: unknown, key: string, compute: () => T): T {
  const obj = target as Record<string, T>;
  if (obj[key] === undefined) {
    obj[key] = compute();
  }
  return obj[key];
}

function bsPartsToDayIndex(year: number, month: number, day: number): number {
  return bsToDayIndex(year, month, day);
}

function isValidBsParts(year: number, month: number, day: number): boolean {
  return isValidBsDate(year, month, day);
}

// ── DinDate class ───────────────────────────────────────────────

/** LRU cache for format results: key = "utcMs|pattern", value = formatted string */
const _formatCache = new LRUCache<string, string>(256);

export class DinDate {
  readonly #utcMs: number;

  // Lazy caches (set via Object.defineProperty or cast)
  #nepalParts?: NepaliParts;
  #bsParts?: BsDateTime;
  #dayIndex?: number;
  #nepalDate?: { year: number; month: number; day: number };

  constructor();
  constructor(utcMs: number);
  constructor(date: Date);
  constructor(input?: number | Date) {
    if (input === undefined) {
      this.#utcMs = Date.now();
    } else if (input instanceof Date) {
      this.#utcMs = input.getTime();
    } else {
      this.#utcMs = input;
    }
  }

  // ── Lazy getters ──────────────────────────────────────────────

  private get _nepalParts(): NepaliParts {
    if (!this.#nepalParts) {
      this.#nepalParts = utcMsToNepalParts(this.#utcMs);
    }
    return this.#nepalParts;
  }

  private get _bsParts(): BsDateTime {
    if (!this.#bsParts) {
      this.#bsParts = utcMsToBsDateTime(this.#utcMs);
    }
    return this.#bsParts;
  }

  private get _dayIndex(): number {
    if (this.#dayIndex === undefined) {
      const nepal = this._nepalParts;
      this.#dayIndex = nepalDateToDayIndex(nepal.year, nepal.month, nepal.day);
    }
    return this.#dayIndex;
  }

  private get _nepalDate(): { year: number; month: number; day: number } {
    if (!this.#nepalDate) {
      const nepal = this._nepalParts;
      this.#nepalDate = { year: nepal.year, month: nepal.month, day: nepal.day };
    }
    return this.#nepalDate;
  }

  // ── Factory / static ─────────────────────────────────────────

  static from(input: DinDateInput): DinDate {
    const { year, month, day, hour = 0, minute = 0, second = 0, ms = 0 } = input;
    if (input.calendar === "bs") {
      if (!isValidBsParts(year, month, day)) {
        throw new RangeError(`Invalid BS date: ${year}-${month}-${day}`);
      }
      const utcMs = bsDateTimeToUtcMs(year, month, day, hour, minute, second, ms);
      return new DinDate(utcMs);
    }
    // AD
    if (year < 1 || year > 9999) {
      throw new RangeError(`Year ${year} out of range (1–9999)`);
    }
    if (month < 1 || month > 12) {
      throw new RangeError(`Month ${month} out of range (1–12)`);
    }
    if (day < 1 || day > 31) {
      throw new RangeError(`Day ${day} out of range (1–31)`);
    }
    const utcMs = nepalPartsToUtcMs({ year, month, day, hour, minute, second, ms });
    return new DinDate(utcMs);
  }

  // ── Immutability: arithmetic ──────────────────────────────────

  add(value: number, unit: Unit): DinDate;
  add(map: Partial<Record<Unit | `${Unit}s`, number>>): DinDate;
  add(valueOrMap: number | Partial<Record<Unit | `${Unit}s`, number>>, unit?: Unit): DinDate {
    if (typeof valueOrMap === "number" && unit) {
      return this._addUnit(unit, valueOrMap);
    }
    if (typeof valueOrMap === "object" && valueOrMap !== null) {
      let result: DinDate = this;
      for (const [u, v] of Object.entries(valueOrMap) as [Unit, number][]) {
        if (v !== 0) result = result._addUnit(u, v);
      }
      return result;
    }
    throw new TypeError("Invalid arguments to add()");
  }

  subtract(value: number, unit: Unit): DinDate;
  subtract(map: Partial<Record<Unit | `${Unit}s`, number>>): DinDate;
  subtract(valueOrMap: number | Partial<Record<Unit | `${Unit}s`, number>>, unit?: Unit): DinDate {
    if (typeof valueOrMap === "number" && unit) {
      return this._addUnit(unit, -valueOrMap);
    }
    if (typeof valueOrMap === "object" && valueOrMap !== null) {
      let result: DinDate = this;
      for (const [u, v] of Object.entries(valueOrMap) as [Unit, number][]) {
        if (v !== 0) result = result._addUnit(u, -v);
      }
      return result;
    }
    throw new TypeError("Invalid arguments to subtract()");
  }

  private _addUnit(unit: Unit, amount: number): DinDate {
    // Normalize plural to singular
    const u = unit.endsWith("s") && unit !== "millisecond" ? (unit.slice(0, -1) as Unit) : unit;

    if (u === "day" || u === "hour" || u === "minute" || u === "second" || u === "millisecond") {
      const ms = u === "day" ? amount * MS_PER_DAY
        : u === "hour" ? amount * MS_PER_HOUR
        : u === "minute" ? amount * MS_PER_MINUTE
        : u === "second" ? amount * MS_PER_SECOND
        : amount;
      return new DinDate(this.#utcMs + ms);
    }

    // Month / year arithmetic — field-based with day clamping
    if (u === "month" || u === "year") {
      const bs = this._bsParts;
      let newMonth = bs.month;
      let newYear = bs.year;

      if (u === "year") {
        newYear += amount;
      } else {
        newMonth += amount;
      }

      // Normalize months to 1..12
      while (newMonth > 12) {
        newMonth -= 12;
        newYear += 1;
      }
      while (newMonth < 1) {
        newMonth += 12;
        newYear -= 1;
      }

      // Clamp day to target month length
      const maxDay = getDaysInBsMonth(newYear, newMonth);
      const newDay = Math.min(bs.day, maxDay);

      return DinDate.from({
        year: newYear,
        month: newMonth,
        day: newDay,
        hour: bs.hour,
        minute: bs.minute,
        second: bs.second,
        ms: bs.ms,
        calendar: "bs",
      });
    }

    throw new TypeError(`Unknown unit: ${unit}`);
  }

  // ── Immutability: set ─────────────────────────────────────────

  set(unit: Unit, value: number): DinDate {
    const bs = this._bsParts;
    const nepal = this._nepalParts;

    switch (unit) {
      case "year":
        return DinDate.from({ year: value, month: bs.month, day: Math.min(bs.day, getDaysInBsMonth(value, bs.month)), hour: bs.hour, minute: bs.minute, second: bs.second, ms: bs.ms, calendar: "bs" });
      case "month": {
        const maxDay = getDaysInBsMonth(bs.year, value);
        return DinDate.from({ year: bs.year, month: value, day: Math.min(bs.day, maxDay), hour: bs.hour, minute: bs.minute, second: bs.second, ms: bs.ms, calendar: "bs" });
      }
      case "day": {
        const maxDay = getDaysInBsMonth(bs.year, bs.month);
        if (value < 1 || value > maxDay) throw new RangeError(`Day ${value} out of range for BS ${bs.year}-${bs.month} (1–${maxDay})`);
        return DinDate.from({ year: bs.year, month: bs.month, day: value, hour: bs.hour, minute: bs.minute, second: bs.second, ms: bs.ms, calendar: "bs" });
      }
      case "hour":
        return new DinDate(nepalPartsToUtcMs({ ...nepal, hour: value }));
      case "minute":
        return new DinDate(nepalPartsToUtcMs({ ...nepal, minute: value }));
      case "second":
        return new DinDate(nepalPartsToUtcMs({ ...nepal, second: value }));
      case "millisecond":
        return new DinDate(nepalPartsToUtcMs({ ...nepal, ms: value }));
      default:
        throw new TypeError(`Unknown unit: ${unit}`);
    }
  }

  // ── Diff ──────────────────────────────────────────────────────

  diff(other: DinDate): DiffResult;
  diff(other: DinDate, unit: Unit): number;
  diff(other: DinDate, unit?: Unit): DiffResult | number {
    const msDiff = this.#utcMs - other.#utcMs;

    if (unit) {
      switch (unit) {
        case "millisecond": return msDiff;
        case "second": return Math.trunc(msDiff / MS_PER_SECOND);
        case "minute": return Math.trunc(msDiff / MS_PER_MINUTE);
        case "hour": return Math.trunc(msDiff / MS_PER_HOUR);
        case "day": return this._dayIndex - other._dayIndex;
        case "month": {
          const a = this._bsParts;
          const b = other._bsParts;
          return (a.year - b.year) * 12 + (a.month - b.month);
        }
        case "year":
          return this._bsParts.year - other._bsParts.year;
        default: {
          const _exhaustive: never = unit;
          throw new TypeError(`Unknown unit: ${_exhaustive}`);
        }
      }
    }

    // Full diff result
    const absMs = Math.abs(msDiff);
    const sign = msDiff < 0 ? -1 : 1;

    const totalDays = Math.floor(absMs / MS_PER_DAY);
    const remMs = absMs - totalDays * MS_PER_DAY;
    const hours = Math.floor(remMs / MS_PER_HOUR);
    const remAfterHours = remMs - hours * MS_PER_HOUR;
    const minutes = Math.floor(remAfterHours / MS_PER_MINUTE);
    const remAfterMinutes = remAfterHours - minutes * MS_PER_MINUTE;
    const seconds = Math.floor(remAfterMinutes / MS_PER_SECOND);
    const milliseconds = remAfterMinutes - seconds * MS_PER_SECOND;

    // Calendar diff for years/months
    const aBs = this._bsParts;
    const bBs = other._bsParts;
    let yearDiff = aBs.year - bBs.year;
    let monthDiff = aBs.month - bBs.month;
    if (monthDiff < 0) {
      yearDiff -= 1;
      monthDiff += 12;
    }
    // Day diff within the month-aligned period
    const aDay = aBs.day;
    const bDay = bBs.day;
    let dayDiff = aDay - bDay;
    if (dayDiff < 0) {
      monthDiff -= 1;
      if (monthDiff < 0) {
        yearDiff -= 1;
        monthDiff += 12;
      }
      // Approximate: use target month's max days
      const targetMonth = bBs.month + (aBs.month - bBs.month);
      const normalizedMonth = ((targetMonth - 1) % 12) + 1;
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
      milliseconds: milliseconds * sign,
    };
  }

  // ── Format ────────────────────────────────────────────────────

  format(pattern: string): string {
    const cacheKey = `${this.#utcMs}|${pattern}`;
    const cached = _formatCache.get(cacheKey);
    if (cached !== undefined) return cached;

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
        // Literal until ]
        const end = pattern.indexOf("]", i);
        if (end === -1) {
          result += pattern.slice(i + 1);
          i = pattern.length;
        } else {
          result += pattern.slice(i + 1, end);
          i = end + 1;
        }
      } else if (pattern.slice(i, i + 4) === "YYYY") {
        // Determine BS or AD by checking if month is a BS token
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

    _formatCache.set(cacheKey, result);
    return result;
  }

  // ── Conversions ───────────────────────────────────────────────

  valueOf(): number {
    return this.#utcMs;
  }

  toDate(): Date {
    return new Date(this.#utcMs);
  }

  toISOString(): string {
    return this.toDate().toISOString();
  }

  toString(): string {
    return this.toISOString();
  }

  toJSON(): string {
    return this.toISOString();
  }

  // ── Date-like getters (AD wall in Nepal TZ) ───────────────────

  getTime(): number {
    return this.#utcMs;
  }

  getFullYear(): number {
    return this._nepalParts.year;
  }

  getMonth(): number {
    return this._nepalParts.month - 1; // 0-based for Date compat
  }

  getDate(): number {
    return this._nepalParts.day;
  }

  getDay(): number {
    // Nepal civil date → weekday (0=Sun)
    // Use the dayIndex: dayIndex 0 = BS 2000-01-01 = AD 1943-04-14 (Wednesday)
    const dayIdx = this._dayIndex;
    // AD 1943-04-14 is Wednesday = 3 (0=Sun)
    return ((dayIdx % 7) + 3) % 7;
  }

  getHours(): number {
    return this._nepalParts.hour;
  }

  getMinutes(): number {
    return this._nepalParts.minute;
  }

  getSeconds(): number {
    return this._nepalParts.second;
  }

  getMilliseconds(): number {
    return this._nepalParts.ms;
  }

  // ── BS accessors ──────────────────────────────────────────────

  bsYear(): number {
    return this._bsParts.year;
  }

  bsMonth(): number {
    return this._bsParts.month;
  }

  bsDate(): number {
    return this._bsParts.day;
  }

  bsHour(): number {
    return this._bsParts.hour;
  }

  bsMinute(): number {
    return this._bsParts.minute;
  }

  bsSecond(): number {
    return this._bsParts.second;
  }

  bsMs(): number {
    return this._bsParts.ms;
  }

  monthName(locale: "ne" | "en" = "en"): string {
    return locale === "ne"
      ? getMonthNameNe(this._bsParts.month)
      : getMonthNameEn(this._bsParts.month);
  }

  // ── Full decomposition ────────────────────────────────────────

  bs(): BsDateTime {
    return { ...this._bsParts };
  }

  ad(): NepaliParts {
    return { ...this._nepalParts };
  }

  // ── Day index (for internal use / advanced) ───────────────────

  dayIndex(): number {
    return this._dayIndex;
  }

  // ── Relative time ─────────────────────────────────────────────

  /** Duration from now (positive = future, negative = past). */
  diffNow(): Duration;
  diffNow(unit: Unit): number;
  diffNow(unit?: Unit): Duration | number {
    const now = Date.now();
    const diffMs = this.#utcMs - now;
    if (unit) {
      switch (unit) {
        case "millisecond": return diffMs;
        case "second": return Math.trunc(diffMs / 1000);
        case "minute": return Math.trunc(diffMs / 60000);
        case "hour": return Math.trunc(diffMs / 3600000);
        case "day": return this._dayIndex - nepalDateToDayIndex(
          ...(() => {
            const p = utcMsToNepalParts(now);
            return [p.year, p.month, p.day] as const;
          })()
        );
        default: throw new TypeError(`Cannot use unit "${unit}" with diffNow`);
      }
    }
    return Duration.fromMs(diffMs);
  }

  /** Humanized string for time ago / time from now. */
  fromNow(locale: "en" | "ne" = "en"): string {
    return this.diffNow().humanizeAgo(locale);
  }

  /** Humanized string from other to this. */
  from(other: DinDate, locale: "en" | "ne" = "en"): string {
    const diffMs = this.#utcMs - other.#utcMs;
    return Duration.fromMs(diffMs).humanizeAgo(locale);
  }

  /** Watch this date with live-updating relative text. */
  watchRelative(
    callback: (text: string, duration: Duration) => void,
    options?: { base?: DinDate | (() => DinDate); locale?: "en" | "ne" }
  ): () => void {
    return _watchRelative(this, callback, options);
  }

  // ── Cache management ──────────────────────────────────────────

  /** Clear all internal caches (format LRU). Useful for tests. */
  static clearCache(): void {
    _formatCache.clear();
  }
}
