// dinjs.d.ts
declare module 'dinjs' {
  export class dinjs {
    dateInBS: string;
    DATE_FORMAT_STRING: string;
    DATE_OBJECT: any;

    constructor(DATE?: string | null, FORMAT_STRING?: string, isInBS?: boolean);

    addDate(Years: number, Months: number, Days: number): void;
    daysDifference(dinjs_DATE: dinjs): number;
    subtractDays(Days: number): void;
    addDays(Days: number): void;
  }
}
