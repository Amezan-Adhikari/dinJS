# dinJS

Nepali date arithmetic for the Bikram Sambat (BS) calendar system.

Converts dates, performs arithmetic, and calculates differences — with full time support, Nepal timezone, and immutable API.

**BS 2000–2089** | **O(1) math** | **Immutable** | **TypeScript**

---

## Install

```bash
npm install dinjs
```

## Quick Start

```ts
import { dinjs, DinDate } from "dinjs";

// Current date in BS
const now = dinjs();
console.log(now.bs());        // { year: 2082, month: 4, day: 9, ... }
console.log(now.format("BS-YYYY-MM-DD")); // "BS-2082-04-09"

// From BS date
const dashain = DinDate.from({ year: 2082, month: 7, day: 1, calendar: "bs" });
console.log(dashain.monthName()); // "Ashwin"

// From AD date
const ad = DinDate.from({ year: 2025, month: 10, day: 20, calendar: "ad" });
console.log(ad.bs()); // { year: 2082, month: 7, day: 3, ... }

// From string
const d = dinjs("2081-08-11", "YYYY-MM-DD", { bs: true });
```

## Creating Instances

```ts
// Factory (recommended)
dinjs()                                        // now, Nepal TZ
dinjs("2081-08-11", "YYYY-MM-DD", { bs: true }) // parse BS string
dinjs("2025-06-15", "YYYY-MM-DD")              // parse AD string
dinjs(new Date())                               // from native Date
dinjs(1700000000000)                            // from UTC ms

// Static from
DinDate.from({ year: 2081, month: 8, day: 11, calendar: "bs" })
DinDate.from({ year: 2025, month: 6, day: 15, hour: 14, minute: 30, calendar: "ad" })
```

## Immutable Arithmetic

All operations return a **new** `DinDate` — the original is never modified.

```ts
const d = dinjs("2081-08-11", "YYYY-MM-DD", { bs: true });

// Add / subtract with unit
d.add(1, "day")
d.add(2, "month")
d.add(1, "year")
d.subtract(5, "hour")
d.subtract(30, "minute")

// Add / subtract with map
d.add({ years: 1, months: 2, days: 3 })
d.subtract({ hours: 4, minutes: 30 })

// Set specific field (returns new instance)
d.set("month", 12)
d.set("hour", 22)
```

### Month/Year Clamping

When adding months or years, the day is clamped to the target month's length:

```ts
// BS 2081 Shrawan (month 4) has 32 days
const d = DinDate.from({ year: 2081, month: 4, day: 32, calendar: "bs" });
d.add(1, "month").bsDate(); // 31 (Bhadra has 31 days — clamped from 32)
```

## Diff

```ts
const a = dinjs("2081-12-25", "YYYY-MM-DD", { bs: true });
const b = dinjs("2081-08-11", "YYYY-MM-DD", { bs: true });

// Full diff result
const diff = a.diff(b);
// { years: 0, months: 4, days: 135, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }

// Diff in specific unit
a.diff(b, "day");    // 135 (calendar dayIndex diff)
a.diff(b, "month");  // 4
a.diff(b, "year");   // 0

// Diff from now
a.diffNow();          // Duration
a.diffNow("day");     // number
```

## Format

```ts
const d = dinjs("2081-08-11 14:30:45", "YYYY-MM-DD HH:mm:ss", { bs: true });

d.format("YYYY-MM-DD");              // "2081-08-11"
d.format("BS-YYYY-MM-DD");           // "BS-2081-08-11"
d.format("DD/MM/YYYY");              // "11/08/2081"
d.format("HH:mm:ss");                // "14:30:45"
d.format("HH:mm:ss.SSS");            // "14:30:45.000"
d.format("[Today is] YYYY-MM-DD");    // "Today is 2081-08-11"
```

### Format Tokens

| Token | Description | Example |
|-------|-------------|---------|
| `YYYY` | 4-digit year | `2081` |
| `YY` | 2-digit year | `81` |
| `MM` | Month (01–12) | `08` |
| `DD` | Day (01–32) | `11` |
| `HH` | Hours (00–23) | `14` |
| `mm` | Minutes (00–59) | `30` |
| `ss` | Seconds (00–59) | `45` |
| `SSS` | Milliseconds (000–999) | `000` |

Use `[literal]` for text: `[BS-]YYYY-MM-DD` → `BS-2081-08-11`

**BS vs AD:** If the pattern contains `BS`, year/month/day tokens use BS values. Otherwise AD values.

## Getters

### Date-like (AD Nepal wall time)

```ts
const d = dinjs("2081-08-11", "YYYY-MM-DD", { bs: true });

d.getFullYear();   // 2024 (AD)
d.getMonth();      // 10 (0-based, November)
d.getDate();       // 26
d.getDay();        // 2 (Tuesday, 0=Sun)
d.getHours();      // 0
d.getMinutes();    // 0
d.getSeconds();    // 0
d.getMilliseconds(); // 0
```

### BS Accessors

```ts
d.bsYear();    // 2081
d.bsMonth();   // 8
d.bsDate();    // 11
d.bsHour();    // 0
d.bsMinute();  // 0
d.bsSecond();  // 0
d.bsMs();      // 0

d.monthName();     // "Mangsir" (English)
d.monthName("ne"); // "\u092e\u0902\u0938\u093f\u0930" (Nepali)

d.bs();    // { year: 2081, month: 8, day: 11, hour: 0, minute: 0, second: 0, ms: 0 }
d.ad();    // { year: 2024, month: 11, day: 26, hour: 0, minute: 0, second: 0, ms: 0 }
```

## Conversions

```ts
d.valueOf();       // UTC milliseconds
d.toDate();        // native Date
d.toISOString();   // "2024-11-26T00:00:00.000Z"
d.toString();      // same as toISOString
```

## Duration & Relative Time

```ts
import { Duration } from "dinjs";

const dur = Duration.fromMs(90061001);
dur.humanize();       // "a day"
dur.humanizeAgo();    // "in a day"
dur.as("hour");       // 25.0169...
dur.refreshIntervalMs(); // 3600000 (1 hour, adaptive)

// Relative strings
const d = dinjs("2025-12-25", "YYYY-MM-DD");
d.fromNow();  // "in 6 months"

// Live-updating relative display
const cancel = d.watchRelative((text, duration) => {
  console.log(text); // "in 6 months", then "in 5 months", etc.
});
// Call cancel() to stop updates
```

### Adaptive Refresh

`Duration.refreshIntervalMs()` and `Duration.nextDelay()` automatically choose the right update frequency:

| Remaining | Refresh Interval |
|-----------|-----------------|
| < 1 min | 1 second |
| < 2 hours | 1 minute |
| < 6 hours | 30 minutes |
| < 12 hours | 1 hour |
| < 1 day | 2 hours |
| ≥ 1 day | 1 day |

## Timezone

All civil date math uses **Nepal timezone** (`Asia/Kathmandu`, fixed UTC+05:45, no DST).

```ts
import { NEPAL_OFFSET_MS, NEPAL_TZ } from "dinjs";

NEPAL_OFFSET_MS; // 20700000 (5h 45m in ms)
NEPAL_TZ;        // "Asia/Kathmandu"
```

BS civil date = Nepal wall date of the instant. Host timezone does not affect results.

## Migration from v3

| v3 | v4 |
|----|-----|
| `new dinjs("2081-08-10", "YYYY-MM-DD", true)` | `dinjs("2081-08-10", "YYYY-MM-DD", { bs: true })` |
| `d.addDays(5)` (mutates) | `d.add(5, "day")` (immutable) |
| `d.subtractDays(10)` (mutates) | `d.subtract(10, "day")` (immutable) |
| `d.addDate(1, 2, 3)` (mutates) | `d.add({ years: 1, months: 2, days: 3 })` |
| `d.daysDifference(other)` | `d.diff(other, "day")` |
| `d.dateInBS` (string) | `d.format("BS-YYYY-MM-DD")` |
| `d.DATE_OBJECT` | `d.bs()` → `{ year, month, day, ... }` |
| — | `d.bsYear()` / `d.bsMonth()` / `d.bsDate()` |
| — | `d.fromNow()` → relative string |
| — | `d.watchRelative(cb)` → live display |

v3 methods still work but emit deprecation warnings. They will be removed in v5.

## Range & Limitations

- **Supported:** BS 2000–2089 (90 years of calendar data)
- **Time:** Full hours/minutes/seconds/milliseconds support
- **Timezone:** Nepal (UTC+05:45) only — no DST, no other timezone conversion
- **Immutability:** All v4 operations return new instances (no mutation)

## License

ISC
