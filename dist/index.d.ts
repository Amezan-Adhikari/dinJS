/**
 * Total days in the entire supported BS range.
 */
declare const TOTAL_DAYS: number;

/**
 * O(1) / O(log n) BS date ↔ dayIndex conversions.
 *
 * dayIndex = number of days since BS 2000-01-01 (Baisakh 1).
 * dayIndex 0 = BS 2000-01-01.
 */

/**
 * Result of a BS date decomposition.
 */
interface BsDate {
    year: number;
    month: number;
    day: number;
}
/**
 * Get the number of days in a given BS month.
 * O(1).
 */
declare function getDaysInBsMonth(year: number, month: number): number;
/**
 * Check if a BS date is valid.
 */
declare function isValidBsDate(year: number, month: number, day: number): boolean;

/**
 * Nepal timezone utilities and AD ↔ dayIndex conversion.
 *
 * All civil date math uses fixed UTC+05:45 (no DST).
 * Nepal civil date = UTC ms + NEPAL_OFFSET, truncated to date.
 */

/** Nepal timezone offset in milliseconds: +05:45 = 20,700,000 ms */
declare const NEPAL_OFFSET_MS: number;
/** IANA-style timezone identifier */
declare const NEPAL_TZ = "Asia/Kathmandu";
interface NepaliParts {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
    ms: number;
}
interface BsDateTime extends BsDate {
    hour: number;
    minute: number;
    second: number;
    ms: number;
}

declare class Duration {
    #private;
    constructor(ms: number);
    /** Signed total milliseconds. */
    get milliseconds(): number;
    /** Whole days (trunc toward 0). */
    get days(): number;
    /** Whole hours (0–23 after days). */
    get hours(): number;
    /** Whole minutes (0–59 after hours). */
    get minutes(): number;
    /** Whole seconds (0–59 after minutes). */
    get seconds(): number;
    /** Remaining milliseconds (0–999 after seconds). */
    get millisecondsPart(): number;
    /** Convert to any unit. */
    as(unit: Unit): number;
    abs(): Duration;
    negate(): Duration;
    add(other: Duration): Duration;
    subtract(other: Duration): Duration;
    lt(other: Duration): boolean;
    lte(other: Duration): boolean;
    gt(other: Duration): boolean;
    gte(other: Duration): boolean;
    eq(other: Duration): boolean;
    humanize(locale?: "en" | "ne"): string;
    humanizeAgo(locale?: "en" | "ne"): string;
    /**
     * Adaptive refresh interval for live-updating UIs.
     * Returns milliseconds until the next update should fire.
     */
    refreshIntervalMs(): number;
    static refreshForRemaining(absMs: number): number;
    /**
     * Compute next delay, capped to the next bucket boundary.
     */
    static nextDelay(remainingMs: number): number;
    private static msUntilNextBucket;
    toJSON(): {
        milliseconds: number;
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
    };
    toString(): string;
    valueOf(): number;
    static fromMs(ms: number): Duration;
    static fromSeconds(s: number): Duration;
    static fromMinutes(m: number): Duration;
    static fromHours(h: number): Duration;
    static fromDays(d: number): Duration;
}

type Unit = "year" | "month" | "day" | "hour" | "minute" | "second" | "millisecond";
type CalendarType = "bs" | "ad";
interface DinDateInput {
    year: number;
    month: number;
    day: number;
    hour?: number;
    minute?: number;
    second?: number;
    ms?: number;
    calendar: CalendarType;
}
interface DiffResult {
    years: number;
    months: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
}
declare class DinDate {
    #private;
    constructor();
    constructor(utcMs: number);
    constructor(date: Date);
    private get _nepalParts();
    private get _bsParts();
    private get _dayIndex();
    private get _nepalDate();
    static from(input: DinDateInput): DinDate;
    add(value: number, unit: Unit): DinDate;
    add(map: Partial<Record<Unit | `${Unit}s`, number>>): DinDate;
    subtract(value: number, unit: Unit): DinDate;
    subtract(map: Partial<Record<Unit | `${Unit}s`, number>>): DinDate;
    private _addUnit;
    set(unit: Unit, value: number): DinDate;
    diff(other: DinDate): DiffResult;
    diff(other: DinDate, unit: Unit): number;
    format(pattern: string): string;
    valueOf(): number;
    toDate(): Date;
    toISOString(): string;
    toString(): string;
    toJSON(): string;
    getTime(): number;
    getFullYear(): number;
    getMonth(): number;
    getDate(): number;
    getDay(): number;
    getHours(): number;
    getMinutes(): number;
    getSeconds(): number;
    getMilliseconds(): number;
    bsYear(): number;
    bsMonth(): number;
    bsDate(): number;
    bsHour(): number;
    bsMinute(): number;
    bsSecond(): number;
    bsMs(): number;
    monthName(locale?: "ne" | "en"): string;
    bs(): BsDateTime;
    ad(): NepaliParts;
    dayIndex(): number;
    /** Duration from now (positive = future, negative = past). */
    diffNow(): Duration;
    diffNow(unit: Unit): number;
    /** Humanized string for time ago / time from now. */
    fromNow(locale?: "en" | "ne"): string;
    /** Humanized string from other to this. */
    from(other: DinDate, locale?: "en" | "ne"): string;
    /** Watch this date with live-updating relative text. */
    watchRelative(callback: (text: string, duration: Duration) => void, options?: {
        base?: DinDate | (() => DinDate);
        locale?: "en" | "ne";
    }): () => void;
}

/**
 * Factory function — recommended way to create DinDate instances.
 *
 * Overloads:
 *   dinjs()                                       → now (Nepal TZ)
 *   dinjs(date: Date)                             → from native Date
 *   dinjs(utcMs: number)                          → from UTC ms
 *   dinjs(bsString, format, { bs: true })         → from BS string
 *   dinjs(adString, format)                       → from AD string
 */
declare function dinjs(): DinDate;
declare function dinjs(date: Date): DinDate;
declare function dinjs(utcMs: number): DinDate;
declare function dinjs(input: string, format?: string, options?: {
    bs?: boolean;
}): DinDate;

/**
 * Live-updating relative time display.
 *
 * Uses chained `setTimeout` (not fixed `setInterval`) with adaptive
 * `refreshIntervalMs` to avoid unnecessary ticks.
 *
 * @param target    The DinDate to watch
 * @param callback  Called with the humanized text and current Duration
 * @param options   `{ base, locale }` — base defaults to Date.now()
 * @returns         Cancel function (must call to avoid timer leaks)
 */
declare function watchRelative(target: DinDate, callback: (text: string, duration: Duration) => void, options?: {
    base?: DinDate | (() => DinDate);
    locale?: "en" | "ne";
}): () => void;

/**
 * Map month number (1-based) to Nepali name.
 */
declare function getMonthNameNe(month: number): string;
/**
 * Map month number (1-based) to English name.
 */
declare function getMonthNameEn(month: number): string;

declare const BS_YEAR_START = 2000;
declare const BS_YEAR_END = 2089;
declare const BS_YEAR_COUNT = 90;

type DateObj = {
    YEAR: number;
    MONTH: number;
    DATE: number;
};

/** @deprecated Use `DinDate` or the `dinjs()` factory instead. */
declare class dinjs_v3 {
    #private;
    dateInBS: string;
    DATE_FORMAT_STRING: string;
    DATE_OBJECT: {
        YEAR: number;
        MONTH: number;
        DATE: number;
    };
    constructor(DATE?: string, FORMAT_STRING?: string, isInBS?: boolean);
    addDate(Years: number, Months: number, Days: number): void;
    daysDifference(dinjs_DATE: dinjs_v3): number;
    subtractDays(Days: number): void;
    subtractMonths(Months: number): void;
    subtractYears(Years: number): void;
    addDays(Days: number): void;
    addMonths(Months: number): void;
    addYears(Years: number): void;
}

export { BS_YEAR_COUNT, BS_YEAR_END, BS_YEAR_START, type CalendarType, type DateObj, type DiffResult, DinDate, type DinDateInput, Duration, NEPAL_OFFSET_MS, NEPAL_TZ, TOTAL_DAYS, type Unit, dinjs, dinjs_v3, getDaysInBsMonth, getMonthNameEn, getMonthNameNe, isValidBsDate, watchRelative };
