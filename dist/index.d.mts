type DateObj = {
    YEAR: number;
    MONTH: number;
    DATE: number;
};

declare class dinjs {
    #private;
    dateInBS: string;
    DATE_FORMAT_STRING: string;
    DATE_OBJECT: DateObj;
    constructor(DATE?: string, FORMAT_STRING?: string, isInBS?: boolean);
    addDate(Years: number, Months: number, Days: number): void;
    daysDifference(dinjs_DATE: dinjs): number;
    subtractDays(Days: number): void;
    subtractMonths(Months: number): void;
    subtractYears(Years: number): void;
    addDays(Days: number): void;
    addMonths(Months: number): void;
    addYears(Years: number): void;
}

export { type DateObj, dinjs };
