// ── v4 API ──────────────────────────────────────────────────────
export { DinDate } from "./DinDate";
export type { Unit, CalendarType, DinDateInput, DiffResult } from "./DinDate";
export { dinjs } from "./dinjs";
export { Duration } from "./duration/duration";
export { watchRelative } from "./duration/relative";
export { NEPAL_OFFSET_MS, NEPAL_TZ } from "./core/time";
export { getMonthNameNe, getMonthNameEn } from "./core/month-names";
export { isValidBsDate, getDaysInBsMonth, TOTAL_DAYS } from "./core/day-index";
export { BS_YEAR_START, BS_YEAR_END, BS_YEAR_COUNT } from "./core/calendar-data";

// ── Legacy v3 exports (deprecated) ─────────────────────────────
import dinjs_ADD_DATE_BS from "./Methods/dinjs_ADD_DATE_BS";
import dinjs_CONVERT_TO_BS from "./Methods/dinjs_CONVERT_AD_TO_BS";
import dinjs_DAYS_DIFFERENCE_BS from "./Methods/dinjs_DAYS_DIFFERENCE_BS";
import dinjs_PARSE_DATE from "./Methods/dinjs_PARSE_DATE";
import dinjs_STRINGIFY_DATE from "./Methods/dinjs_STRINGIFY_DATE";
import dinjs_SUB_DAYS_BS from "./Methods/dinjs_SUB_DAYS_BS";

export * from "./dataTypes";

/** @deprecated Use `DinDate` or the `dinjs()` factory instead. */
export class dinjs_v3 {
  dateInBS: string;
  DATE_FORMAT_STRING: string;
  DATE_OBJECT: { YEAR: number; MONTH: number; DATE: number };

  constructor(DATE?: string, FORMAT_STRING: string = "YYYY-MM-DD", isInBS: boolean = false) {
    this.DATE_FORMAT_STRING = FORMAT_STRING.toUpperCase();

    if (!DATE) {
      const dinjs_TODAYS_DATE = new Date();
      const dinjs_CURRENT_YEAR = dinjs_TODAYS_DATE.getFullYear();
      const dinjs_CURRENT_MONTH = dinjs_TODAYS_DATE.getMonth() + 1;
      const dinjs_CURRENT_DATE = dinjs_TODAYS_DATE.getDate();
      this.dateInBS = dinjs_CONVERT_TO_BS(
        this.DATE_FORMAT_STRING,
        dinjs_CURRENT_YEAR,
        dinjs_CURRENT_MONTH,
        dinjs_CURRENT_DATE
      );
    } else if (DATE && FORMAT_STRING && !isInBS) {
      const dinjs_DATE = dinjs_PARSE_DATE(DATE, this.DATE_FORMAT_STRING);
      this.dateInBS = dinjs_CONVERT_TO_BS(
        this.DATE_FORMAT_STRING,
        dinjs_DATE.YEAR,
        dinjs_DATE.MONTH,
        dinjs_DATE.DATE
      );
    } else if (DATE && FORMAT_STRING && isInBS) {
      this.dateInBS = DATE;
    } else {
      throw new Error("unexpected error occured please check the parameters");
    }

    this.DATE_OBJECT = dinjs_PARSE_DATE(this.dateInBS, this.DATE_FORMAT_STRING);
  }

  #update() {
    this.dateInBS = dinjs_STRINGIFY_DATE(this.DATE_OBJECT, this.DATE_FORMAT_STRING);
  }

  addDate(Years: number, Months: number, Days: number) {
    this.DATE_OBJECT = dinjs_ADD_DATE_BS(this.DATE_OBJECT, Years, Months, Days);
    this.#update();
  }

  daysDifference(dinjs_DATE: dinjs_v3) {
    return dinjs_DAYS_DIFFERENCE_BS(this.DATE_OBJECT, dinjs_DATE.DATE_OBJECT);
  }

  subtractDays(Days: number) {
    this.DATE_OBJECT = dinjs_SUB_DAYS_BS(this.DATE_OBJECT, Days);
    this.#update();
  }

  subtractMonths(Months: number) {
    this.addDate(0, -Months, 0);
  }

  subtractYears(Years: number) {
    this.addDate(-Years, 0, 0);
  }

  addDays(Days: number) {
    this.addDate(0, 0, Days);
  }

  addMonths(Months: number) {
    this.addDate(0, Months, 0);
  }

  addYears(Years: number) {
    this.addDate(Years, 0, 0);
  }
}
