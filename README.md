# dinJS

`dinjs` is a JavaScript library for Nepali date arithmetic, specifically for the Bikram Sambat (BS) calendar system. It provides tools for converting dates, performing arithmetic, and calculating date differences.

---

## Installation

Install `dinjs` using npm:

```bash
npm install dinjs
```

## Range : 2000 BS - 2089 BS

---

## Key Methods and Examples

### 1. **Creating an Instance**

```javascript

import  { dinjs }  from "dinjs"
or
const  { dinjs }  = require("dinjs");


// Current date in BS
const currentDate = new dinjs();
console.log(currentDate.dateInBS);

// From AD date
const dateFromAD = new dinjs("2024-11-26", "YYYY-MM-DD");
console.log(dateFromAD.dateInBS);

// From BS date
const dateFromBS = new dinjs("2081-08-10", "YYYY-MM-DD", true);
console.log(dateFromBS.dateInBS);

```
### 1. **Adding and Subtracting Dates**

| Feature          | Description                        | Example   |
|------------------|------------------------------------|-----------|
| `addDays`        | Adds a specified number of days   | `addDays(5)` |
| `addMonths`        | Adds a specified number of Months   | `addMonths(6)` |
| `addYears`        | Adds a specified number of Years   | `addYears(1)` |
| `subtractDays`   | Subtracts a specified number of days | `subtractDays(10)` |
| `subtractMonths`   | Subtracts a specified number of months | `subtractMonths(2)` |
| `subtractYears`   | Subtracts a specified number of years | `subtractYears(5)` |
| `daysDifference` | Calculates the difference in days between two dates | `daysDifference(otherDate)` |


```javascript

// Adding years, months, and days
dateFromBS.addDate(1, 2, 15);
console.log(dateFromBS.dateInBS);

// Adding days
dateFromBS.addDays(10);
console.log(dateFromBS.dateInBS);

dateFromBS.addMonths(2);
console.log(dateFromBS.dateInBS);

dateFromBS.addYears(1);
console.log(dateFromBS.dateInBS);

// Subtracting days
dateFromBS.subtractDays(5);
console.log(dateFromBS.dateInBS);

dateFromBS.subtractMonths(3);
console.log(dateFromBS.dateInBS);

dateFromBS.subtractYears(1);
console.log(dateFromBS.dateInBS);



```
### 1. **Calculating Date Differences**

```javascript

//Calculate days difference
const anotherDate = new dinjs("2081-08-20", "YYYY-MM-DD", true);
const diff = dateFromBS.daysDifference(anotherDate);
console.log(`Difference: ${diff} days`);

```

## Format String Reference

| Cmponent         | Description                        | Example   |
|------------------|------------------------------------|-----------|
| `YYYY`        | Year 4-units  | `2060` |
| `MM`   | Month 2-units | `08` |
| `DD` | Day 2-units | `10` |


`demimeters - and / can be used.`
`Any order of YYYY,MM,DD provided will save the date in that format and hence will always work with it in the same format`