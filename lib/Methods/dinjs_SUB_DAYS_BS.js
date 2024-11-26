const dinjs_GET_MONTH_DAYS = require("./dinjs_GET_MONTH_DAYS.js").module;

function dinjs_SUB_DAYS_BS(Date_object,days){
   
   
    while(days){
        days--;

        
        if(Date_object.DATE==1){
            if(Date_object.MONTH==1){
                Date_object.YEAR--;
                Date_object.MONTH = 12;
            }
            Date_object.MONTH--;
            const daysInMonth = dinjs_GET_MONTH_DAYS(Date_object.YEAR,Date_object.MONTH);
            Date_object.DATE = daysInMonth;
        }
        Date_object.DATE--;

    }


    return Date_object;

}
exports.module = dinjs_SUB_DAYS_BS;