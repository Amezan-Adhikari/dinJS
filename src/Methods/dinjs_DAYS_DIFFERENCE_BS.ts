import { DateObj } from "../dataTypes";
import dinjs_GET_MONTH_DAYS from "./dinjs_GET_MONTH_DAYS";

export default function dinjs_DAYS_DIFFERENCE_BS(Date_object:DateObj,obj:DateObj){


    let isSmaller = false;
    if(     Date_object.YEAR < obj.YEAR || 
        (   Date_object.YEAR <= obj.YEAR && Date_object.MONTH < obj.MONTH )||
        (  Date_object.YEAR <= obj.YEAR && Date_object.MONTH <= obj.MONTH && Date_object.DATE < obj.DATE)  
    ){
        isSmaller = true;
    }

    if(isSmaller){
        let temp = obj;
        obj = Date_object;
        Date_object = temp;
    }

    let days = 0;
    while(!(Date_object.YEAR == obj.YEAR && Date_object.MONTH == obj.MONTH && Date_object.DATE == obj.DATE)){
        
        
        const daysInMonth = dinjs_GET_MONTH_DAYS(obj.YEAR,obj.MONTH);
        if(obj.DATE > daysInMonth){
            obj.DATE = 1;
            obj.MONTH ++;

            if(obj.MONTH > 12){
                obj.MONTH = 1;
                obj.YEAR ++;
            }
        }
        else{
            days++;
            obj.DATE++;
        }
        
    }
    return isSmaller? -days : days;

}