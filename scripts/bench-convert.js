/**
 * Benchmark: old loop-based vs new O(1) BS ↔ dayIndex conversion.
 * Self-contained (no TS imports needed).
 *
 * Run: node scripts/bench-convert.js
 */

// --- Calendar data (extracted) ---
const DAYS_IN_MONTH = require("./calendar-data.json");
const BS_YEAR_START = 2000;
const BS_YEAR_COUNT = 90;
const MONTHS_IN_YEAR = 12;

// Precompute cumulative tables (new approach)
const DAYS_IN_YEAR = DAYS_IN_MONTH.map((m) => m.reduce((a, b) => a + b, 0));
const CUM_DAYS_BEFORE_YEAR = [0];
for (let i = 0; i < BS_YEAR_COUNT; i++) {
  CUM_DAYS_BEFORE_YEAR.push(CUM_DAYS_BEFORE_YEAR[i] + DAYS_IN_YEAR[i]);
}
const CUM_DAYS_BEFORE_MONTH = DAYS_IN_MONTH.map((months) => {
  const cum = [0];
  for (let m = 0; m < MONTHS_IN_YEAR; m++) {
    cum.push(cum[m] + months[m]);
  }
  return cum;
});
const TOTAL_DAYS = CUM_DAYS_BEFORE_YEAR[BS_YEAR_COUNT];

// --- New O(1)/O(log n) ---
function fastBsToDayIndex(year, month, day) {
  const yi = year - BS_YEAR_START;
  return (
    CUM_DAYS_BEFORE_YEAR[yi] +
    CUM_DAYS_BEFORE_MONTH[yi][month - 1] +
    (day - 1)
  );
}

function fastDayIndexToBs(index) {
  let lo = 0,
    hi = BS_YEAR_COUNT - 1;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (CUM_DAYS_BEFORE_YEAR[mid + 1] <= index) lo = mid + 1;
    else hi = mid;
  }
  const yi = lo;
  const dwy = index - CUM_DAYS_BEFORE_YEAR[yi];
  let mi = 0;
  while (mi < MONTHS_IN_YEAR - 1 && CUM_DAYS_BEFORE_MONTH[yi][mi + 1] <= dwy) mi++;
  return { year: BS_YEAR_START + yi, month: mi + 1, day: dwy - CUM_DAYS_BEFORE_MONTH[yi][mi] + 1 };
}

// --- Old loop-based (oracle) ---
function oldBsToDayIndex(year, month, day) {
  let y = BS_YEAR_START,
    m = 1,
    d = 1,
    index = 0;
  while (y < year || m < month || d < day) {
    d++;
    index++;
    if (d > DAYS_IN_MONTH[y - BS_YEAR_START][m - 1]) {
      d = 1;
      m++;
      if (m > MONTHS_IN_YEAR) {
        m = 1;
        y++;
      }
    }
  }
  return index;
}

function oldDayIndexToBs(index) {
  let y = BS_YEAR_START,
    m = 1,
    d = 1,
    r = index;
  while (r > 0) {
    d++;
    r--;
    if (d > DAYS_IN_MONTH[y - BS_YEAR_START][m - 1]) {
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

// --- Bench ---
const N = 100_000;
const testDates = [
  [2000, 1, 1],
  [2024, 6, 15],
  [2050, 8, 20],
  [2081, 8, 10],
  [2089, 12, 30],
];

console.log("=== bsToDayIndex (" + N + " iterations each) ===");
for (const [y, m, d] of testDates) {
  let t0 = performance.now();
  for (let i = 0; i < N; i++) oldBsToDayIndex(y, m, d);
  const oldMs = performance.now() - t0;

  t0 = performance.now();
  for (let i = 0; i < N; i++) fastBsToDayIndex(y, m, d);
  const newMs = performance.now() - t0;

  console.log(
    `  BS ${y}-${m}-${d}: old=${oldMs.toFixed(1)}ms  new=${newMs.toFixed(1)}ms  speedup=${(oldMs / newMs).toFixed(0)}x`
  );
}

console.log("\n=== dayIndexToBs (" + N + " iterations each) ===");
const testIndices = [0, 365, 7000, 14000, 32000];
for (const idx of testIndices) {
  let t0 = performance.now();
  for (let i = 0; i < N; i++) oldDayIndexToBs(idx);
  const oldMs = performance.now() - t0;

  t0 = performance.now();
  for (let i = 0; i < N; i++) fastDayIndexToBs(idx);
  const newMs = performance.now() - t0;

  console.log(
    `  index=${idx}: old=${oldMs.toFixed(1)}ms  new=${newMs.toFixed(1)}ms  speedup=${(oldMs / newMs).toFixed(0)}x`
  );
}
