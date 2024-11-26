import { dinjs_NEPALI_CALENDER } from "../data/nepaliCalenderData";
import dinjs_FORMAT_DATE from "./dinjs_FORMAT_DATE";
import dinjs_GET_MONTH_DAYS from "./dinjs_GET_MONTH_DAYS";

//year month and date must be in same order, the date will be returned in the format specified by the 1st parameter
export default function dinjs_CONVERT_TO_BS(dinjs_Format:string, dinjs_YEAR:number, dinjs_MONTH:number, dinjs_DATE:number) {
  // Reference date (Nepali Baisakh 1)
  const dinjs_REFRENCE_DATE = new Date(
    dinjs_NEPALI_CALENDER.dinjs_REFRENCEDATE_BAISAKH_1_YEAR_START
  );
  const dinjs_AD_DATE = new Date(
    dinjs_FORMAT_DATE("YYYY-MM-DD", dinjs_YEAR, dinjs_MONTH, dinjs_DATE)
  );

  // Calculate the difference in days
  const DIFF = dinjs_AD_DATE.getTime() - dinjs_REFRENCE_DATE.getTime();
  let DAYS_DIFF = Math.round(DIFF / (1000 * 60 * 60 * 24));

  // Initialize Nepali date
  let dinjs_NEPALI_YEAR = dinjs_NEPALI_CALENDER.dinjs_CALENDER_YEAR_START;
  let dinjs_NEPALI_MONTH = 1; // Baisakh
  let dinjs_NEPALI_DATE = 1;
  

  // Increment date based on the difference
  while (DAYS_DIFF > 0) {
    dinjs_NEPALI_DATE++;
    
    if(dinjs_NEPALI_YEAR> (dinjs_NEPALI_CALENDER.dinjs_CALENDER_YEAR_START + Object.keys(dinjs_NEPALI_CALENDER.dinjs_DATA).length - 1))
    {
      throw new Error(`Year ${dinjs_NEPALI_YEAR} Extends the range`);
    }
    const daysInMonth = dinjs_GET_MONTH_DAYS(dinjs_NEPALI_YEAR, dinjs_NEPALI_MONTH);

    if (dinjs_NEPALI_DATE > daysInMonth) {
      dinjs_NEPALI_DATE = 1; // Reset day to 1
      dinjs_NEPALI_MONTH++;
      if (dinjs_NEPALI_MONTH > 12) {
        dinjs_NEPALI_MONTH = 1; // Reset to Baisakh
        dinjs_NEPALI_YEAR++; // Increment year
      }
    }
    DAYS_DIFF--; // Reduce the remaining days
  }

  return dinjs_FORMAT_DATE(
    dinjs_Format,
    dinjs_NEPALI_YEAR,
    dinjs_NEPALI_MONTH,
    dinjs_NEPALI_DATE
  );
}
