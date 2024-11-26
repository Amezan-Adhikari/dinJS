# dinjs

`dinjs` is a JavaScript library for Nepali date arithmetic, specifically for the Bikram Sambat (BS) calendar system. It provides tools for converting dates, performing arithmetic, and calculating date differences.

---

## Key Methods and Examples

### 1. **Creating an Instance**

```javascript
const dinjs = require('dinjs');

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

```javascript

// Adding years, months, and days
dateFromBS.addDate(1, 2, 15);
console.log(dateFromBS.dateInBS);

// Adding days
dateFromBS.addDays(10);
console.log(dateFromBS.dateInBS);

// Subtracting days
dateFromBS.subtractDays(5);
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

#   Component	Description	        Example
    YYYY        Year (4 digits)	    2070
    MM	        Month (2 digits)	04
    DD	        Day (2 digits)	    12
