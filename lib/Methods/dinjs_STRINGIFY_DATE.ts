import { DateObj } from "../dataTypes";

export default function dinjs_STRINGIFY_DATE(DATE_OBJECT:DateObj,Format:string){

    Format = Format.replace("YYYY", `${DATE_OBJECT.YEAR}`);
    Format = Format.replace("MM", `${DATE_OBJECT.MONTH < 10 ? "0" + DATE_OBJECT.MONTH : DATE_OBJECT.MONTH }`);
    Format = Format.replace("DD", `${ DATE_OBJECT.DATE < 10 ? "0" + DATE_OBJECT.DATE  : DATE_OBJECT.DATE }`);

    return Format;

}