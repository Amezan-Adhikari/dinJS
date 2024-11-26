const dinjs_NEPALI_CALENDER = require("../data/nepaliCalenderData.js").module;
const dinjs_GET_MONTH_NAME = require("./dinjs_GET_MONTH_NAME.js").module;

function dinjs_GET_MONTH_DAYS(year, month) {
    const maxYear = dinjs_NEPALI_CALENDER.dinjs_CALENDER_YEAR_START + Object.keys(dinjs_NEPALI_CALENDER.dinjs_DATA).length - 1;

    // Validate the year
    if (year < dinjs_NEPALI_CALENDER.dinjs_CALENDER_YEAR_START || year > maxYear) {
        throw new Error(`Year ${year} is out of range in the Nepali calendar data. Valid range is ${dinjs_NEPALI_CALENDER.dinjs_CALENDER_YEAR_START}-${maxYear}.`);
    }

    // Get month name and year data
    const monthName = dinjs_GET_MONTH_NAME(month);
    const yearData = dinjs_NEPALI_CALENDER.dinjs_DATA[year - dinjs_NEPALI_CALENDER.dinjs_CALENDER_YEAR_START];

    return yearData[monthName];
}

module.exports = { module: dinjs_GET_MONTH_DAYS };
