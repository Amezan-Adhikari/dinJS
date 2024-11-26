import { DateObj } from "../dataTypes";

export default function dinjs_PARSE_DATE(Date:string,Format:string){
    let DATE_OBJECT:DateObj = {} as DateObj;
   
    
    DATE_OBJECT.YEAR = parseInt(Date.substring(Format.indexOf('Y'),Format.indexOf('Y')+4));
    DATE_OBJECT.MONTH = parseInt(Date.substring(Format.indexOf('M'),Format.indexOf('M')+2));
    DATE_OBJECT.DATE = parseInt(Date.substring(Format.indexOf('D'),Format.indexOf('D')+2));
    
    return DATE_OBJECT;
}
