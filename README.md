# dinJS

Nepali date library for JavaScript. Convert dates, do date math, and work with the Bikram Sambat (BS) calendar — all in Nepal time.

**BS 2000–2089** · **Full time support** · **TypeScript**

---

## Install

```bash
npm install dinjs
```

## Quick Start

```ts
import { dinjs } from "dinjs";

// Get today's date in Bikram Sambat
const today = dinjs();
console.log(today.format("BS-YYYY-MM-DD")); // "BS-2082-04-09"

// Dashain 2082
const dashain = dinjs("2082-09-15", "YYYY-MM-DD", { bs: true });
console.log(dashain.monthName()); // "Ashwin"

// When is Dashain this year in AD?
console.log(dashain.format("YYYY-MM-DD")); // "2025-10-02"
```

## Creating Dates

```ts
import { dinjs, DinDate } from "dinjs";

// From a BS string
dinjs("2081-08-11", "YYYY-MM-DD", { bs: true });

// From an AD string
dinjs("2025-06-15", "YYYY-MM-DD");

// Now (Nepal time)
dinjs();

// From a Date object
dinjs(new Date());

// From components
DinDate.from({ year: 2082, month: 7, day: 1, calendar: "bs" });
DinDate.from({ year: 2025, month: 9, day: 15, hour: 14, minute: 30, calendar: "ad" });
```

## Date Math

```ts
const d = dinjs("2081-08-11", "YYYY-MM-DD", { bs: true });

// Add
d.add(5, "day");
d.add(2, "month");
d.add(1, "year");
d.add({ years: 1, months: 2, days: 3 });

// Subtract
d.subtract(10, "day");
d.subtract(4, "hour");

// Set a specific field
d.set("month", 12);

// When subtracting months/years, the day clamps to the last day of the target month
const last = dinjs("2081-11-30", "YYYY-MM-DD", { bs: true });
last.subtract(1, "month").bsDate(); // 30 (Poush has 31 days, but we had 30)
```

## Diff

```ts
const a = dinjs("2082-04-15", "YYYY-MM-DD", { bs: true });
const b = dinjs("2081-08-11", "YYYY-MM-DD", { bs: true });

// Full breakdown
a.diff(b);
// { years: 0, months: 4, days: 135, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }

// In a specific unit
a.diff(b, "day");   // 135
a.diff(b, "month"); // 4

// From now
a.diffNow();        // Duration
a.diffNow("day");   // number
```

## Format

```ts
const d = dinjs("2081-08-11 14:30:45", "YYYY-MM-DD HH:mm:ss", { bs: true });

d.format("YYYY-MM-DD");              // "2081-08-11"
d.format("DD/MM/YYYY");              // "11/08/2081"
d.format("HH:mm:ss");                // "14:30:45"
d.format("[Today is] YYYY-MM-DD");    // "Today is 2081-08-11"
```

| Token | Description | Example |
|-------|-------------|---------|
| `YYYY` | Year | `2081` |
| `YY` | 2-digit year | `81` |
| `MM` | Month (01–12) | `08` |
| `DD` | Day (01–32) | `11` |
| `HH` | Hours (00–23) | `14` |
| `mm` | Minutes (00–59) | `30` |
| `ss` | Seconds (00–59) | `45` |
| `SSS` | Milliseconds (000–999) | `000` |

Wrap text in `[brackets]`: `[BS-]YYYY-MM-DD` → `BS-2081-08-11`

If the pattern contains `BS`, the date tokens use Bikram Sambat. Otherwise they use AD.

## Getters

```ts
const d = dinjs("2081-08-11", "YYYY-MM-DD", { bs: true });

// BS fields
d.bsYear();    // 2081
d.bsMonth();   // 8
d.bsDate();    // 11
d.monthName(); // "Mangsir"
d.monthName("ne"); // "मंसिर"

// AD fields (same as JavaScript Date)
d.getFullYear(); // 2024
d.getMonth();    // 10 (0-based, November)
d.getDate();     // 26
d.getDay();      // 2 (0=Sun)

// Full objects
d.bs(); // { year: 2081, month: 8, day: 11, hour: 0, minute: 0, second: 0, ms: 0 }
d.ad(); // { year: 2024, month: 11, day: 26, hour: 0, minute: 0, second: 0, ms: 0 }
```

## Relative Time

```ts
const d = dinjs("2025-12-25", "YYYY-MM-DD");

d.fromNow(); // "in 6 months"

// Live-updating display
const stop = d.watchRelative((text, duration) => {
  console.log(text); // "in 6 months", then "in 5 months", ...
});
stop(); // call when done
```

### Duration

```ts
import { Duration } from "dinjs";

const dur = Duration.fromMs(90061001);
dur.humanize();       // "a day"
dur.humanizeAgo();    // "in a day"
dur.as("hour");       // 25.02

// Adaptive refresh for live UIs
dur.refreshIntervalMs(); // 3600000 (1 hour)
```

## Conversions

```ts
const d = dinjs("2081-08-11", "YYYY-MM-DD", { bs: true });

d.valueOf();       // UTC milliseconds
d.toDate();        // native Date object
d.toISOString();   // "2024-11-26T00:00:00.000Z"
```

## Timezone

All dates use **Nepal time** (`Asia/Kathmandu`, UTC+05:45, no DST). Your server or browser timezone doesn't affect results.

## Migrating from v3

| v3 | v4 |
|----|-----|
| `new dinjs("2081-08-10", "YYYY-MM-DD", true)` | `dinjs("2081-08-10", "YYYY-MM-DD", { bs: true })` |
| `d.addDays(5)` | `d.add(5, "day")` |
| `d.subtractDays(10)` | `d.subtract(10, "day")` |
| `d.addDate(1, 2, 3)` | `d.add({ years: 1, months: 2, days: 3 })` |
| `d.daysDifference(other)` | `d.diff(other, "day")` |
| `d.dateInBS` | `d.format("BS-YYYY-MM-DD")` |
| `d.DATE_OBJECT` | `d.bs()` |

v3 methods still work but show deprecation warnings. They'll be removed in v5.

## License

ISC
