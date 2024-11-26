import { dinjs_NEPALI_CALENDER } from "../data/nepaliCalenderData";
import { DateObj } from "../dataTypes";
import dinjs_GET_MONTH_DAYS from "./dinjs_GET_MONTH_DAYS";

export default function dinjs_ADD_DATE_BS(Date_object:DateObj,years:number,months:number,days:number){

    if(years<0){
        Date_object.YEAR -= Math.abs(years);
        if(Date_object.YEAR<dinjs_NEPALI_CALENDER.dinjs_CALENDER_YEAR_START){
            throw new Error(`${Date_object.YEAR} exceeds the range`);
        }
        return Date_object;
    }
    if(months<0){
        Date_object.YEAR -= Math.floor(Math.abs(months)/12);
        Date_object.MONTH -= Math.abs(months)%12;
        
        return Date_object;
    }
  

    Date_object.YEAR += years;
    Date_object.MONTH += months;

    Date_object.YEAR += Math.floor(Date_object.MONTH/12);
    Date_object.MONTH = 1 + Date_object.MONTH %12;

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