/**
 * Month name maps for Nepali calendar.
 * Month index 0 = Baisakh, 11 = Chaitra (0-based internal, 1-based public).
 */

export const MONTH_NAMES_NE: readonly string[] = [
  "\u0935\u0948\u0936\u093e\u0916",   // Baisakh
  "\u091c\u0947\u0920",               // Jestha
  "\u0905\u0938\u093e\u0930",         // Asadh
  "\u0938\u093e\u0909\u0928",         // Shrawan
  "\u092d\u0926\u094c",               // Bhadra
  "\u0905\u0938\u094b\u091c",         // Ashwin
  "\u0915\u093e\u0930\u094d\u0924\u093f\u0915", // Kartik
  "\u092e\u0902\u0938\u093f\u0930",   // Mangsir
  "\u092a\u0941\u0937",               // Poush
  "\u092e\u093e\u0918",               // Magh
  "\u092b\u093e\u0917\u0941\u0928",   // Falgun
  "\u091a\u0948\u0924",               // Chaitra
];

export const MONTH_NAMES_EN: readonly string[] = [
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
  "Chaitra",
];

/**
 * Map month number (1-based) to Nepali name.
 */
export function getMonthNameNe(month: number): string {
  if (month < 1 || month > 12) throw new Error(`Invalid month: ${month}`);
  return MONTH_NAMES_NE[month - 1];
}

/**
 * Map month number (1-based) to English name.
 */
export function getMonthNameEn(month: number): string {
  if (month < 1 || month > 12) throw new Error(`Invalid month: ${month}`);
  return MONTH_NAMES_EN[month - 1];
}
