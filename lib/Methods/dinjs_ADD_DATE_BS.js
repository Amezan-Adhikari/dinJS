const dinjs_GET_MONTH_DAYS = require("./dinjs_GET_MONTH_DAYS.js").module;
const dinjs_NEPALI_CALENDER = require("../data/nepaliCalenderData.js").module;

function dinjs_ADD_DATE_BS(Date_object,years,months,days){

  

    Date_object.YEAR += years;
    Date_object.MONTH += months;

    //carry over the excess
    
    if(Date_object.YEAR> (dinjs_NEPALI_CALENDER.dinjs_CALENDER_YEAR_START 
        + Object.keys(dinjs_NEPALI_CALENDER.dinjs_DATA).length - 1)){
        throw new Error(`Year ${Date_object.YEAR} Extends the range`);
    }

    const daysInMonth = dinjs_GET_MONTH_DAYS(Date_object.YEAR,Date_object.MONTH);

    Date_object.DATE += days;
    Date_object.MONTH += Math.floor(Date_object.DATE/daysInMonth);

    if(Date_object.DATE >= daysInMonth){
        Date_object.DATE = 1 + Date_object.DATE %daysInMonth;
    }


    Date_object.YEAR += Math.floor(Date_object.MONTH/12);
    if(Date_object.MONTH>=12){
        Date_object.MONTH = 1 + Date_object.MONTH %12;
    }
    
    return Date_object;

}

exports.module = dinjs_ADD_DATE_BS;