const dinjs_GET_MONTH_DAYS = require("./dinjs_GET_MONTH_DAYS.js").module;

function dinjs_SUB_DATE_BS(Date_object,obj){

    console.log(Date_object,obj);
    if(     Date_object.YEAR < obj.YEAR || 
        (   Date_object.YEAR < obj.YEAR && Date_object.MONTH < obj.MONTH )||
        (  Date_object.YEAR < obj.YEAR && Date_object.MONTH < obj.MONTH && Date_object.DATE < obj.DATE)  
    ){
        throw "first date cant be smaller than the second"
    }
    
    const daysInMonth = dinjs_GET_MONTH_DAYS(Date_object.YEAR,Date_object.MONTH);
    Date_object.YEAR -= obj.YEAR;
    if(Date_object.MONTH<obj.MONTH){
        Date_object.MONTH+=12;
        Date_object.YEAR--;
    }
    Date_object.MONTH-=obj.MONTH;

    if(Date_object.DATE < obj.DATE){
    
        if(Date_object.MONTH==1){
            Date_object.MONTH += 12;
            Date_object.YEAR--;
        }

        Date_object.MONTH--
       
        
         Date_object.DATE+=daysInMonth;
    }
    Date_object.DATE -= obj.DATE;
    //carry over the excess 
    
    return Date_object;

}
exports.module = dinjs_SUB_DATE_BS;