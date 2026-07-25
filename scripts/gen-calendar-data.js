const fs = require("fs");
const raw = fs.readFileSync("src/data/nepaliCalenderData.ts", "utf-8");
const match = raw.match(/dinjs_DATA:\s*\[([\s\S]*?)\]\s*\}/);
const arr = eval("[" + match[1] + "]");
const monthKeys = [
  "\u0935\u0948\u0936\u093e\u0916",
  "\u091c\u0947\u0920",
  "\u0905\u0938\u093e\u0930",
  "\u0938\u093e\u0909\u0928",
  "\u092d\u0926\u094c",
  "\u0905\u0938\u094b\u091c",
  "\u0915\u093e\u0930\u094d\u0924\u093f\u0915",
  "\u092e\u0902\u0938\u093f\u0930",
  "\u092a\u0941\u0937",
  "\u092e\u093e\u0918",
  "\u092b\u093e\u0917\u0941\u0928",
  "\u091a\u0948\u0924",
];
const result = arr.map((yearObj) => monthKeys.map((k) => yearObj[k]));

const lines = result
  .map((months) => {
    return "    [" + months.join(", ") + "]";
  })
  .join(",\n");

const file = `// Auto-generated from nepaliCalenderData.ts — do not edit manually.
// Each inner array: [Baisakh, Jestha, Asadh, Shrawan, Bhadra, Ashwin, Kartik, Mangsir, Poush, Magh, Falgun, Chaitra]
// Index 0 = BS 2000, Index 89 = BS 2089
export const DAYS_IN_MONTH: number[][] = [
${lines}
];

export const BS_YEAR_START = 2000;
export const BS_YEAR_END = 2089;
export const BS_YEAR_COUNT = 90; // 2089 - 2000 + 1
export const MONTHS_IN_YEAR = 12;

// BS 2000-01-01 (Baisakh 1) = AD 1943-04-14 in Nepal (+05:45)
// This is the civil date reference: Nepal midnight on 1943-04-14
export const REFERENCE_AD_YEAR = 1943;
export const REFERENCE_AD_MONTH = 4; // April
export const REFERENCE_AD_DAY = 14;
`;

fs.writeFileSync("src/core/calendar-data.ts", file);
console.log("Created src/core/calendar-data.ts");
console.log("Years:", result.length);
console.log("First year:", JSON.stringify(result[0]));
console.log("Last year:", JSON.stringify(result[89]));
