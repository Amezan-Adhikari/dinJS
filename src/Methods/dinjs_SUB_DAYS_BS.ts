import {DateObj} from "../dataTypes";
import dinjs_GET_MONTH_DAYS from "./dinjs_GET_MONTH_DAYS";

export default function dinjs_SUB_DAYS_BS(Date_object:DateObj,days:number){
   
   
    while(days){
        days--;

    
        if(Date_object.DATE==1){
            if(Date_object.MONTH==1){
                Date_object.YEAR--;
                Date_object.MONTH = 12;
            }
            else{
                Date_object.MONTH--;
            }
            const daysInMonth = dinjs_GET_MONTH_DAYS(Date_object.YEAR,Date_object.MONTH);
            Date_object.DATE = daysInMonth;
        }
        else{
            Date_object.DATE--;
        }

    }


    return Date_object;
}