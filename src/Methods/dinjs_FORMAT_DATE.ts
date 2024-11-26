export default function dinjs_FORMAT_DATE(DateFormat:string, year:number, month:number, date:number) {
    DateFormat = DateFormat.toUpperCase(); // Ensure uppercase format
  
    // Validate format
    if (
      !DateFormat.includes("YYYY") ||
      !DateFormat.includes("MM") ||
      !DateFormat.includes("DD") ||
      (DateFormat.includes("-") && DateFormat.includes("/"))
    ) {
      throw new Error("Invalid date format or delimiter.");
    }
  
    // Replace placeholders with actual values
    DateFormat = DateFormat.replace("YYYY", `${year}`);
    DateFormat = DateFormat.replace("MM", `${month < 10 ? "0" + month : month}`);
    DateFormat = DateFormat.replace("DD", `${date < 10 ? "0" + date : date}`);
  
    return DateFormat;
  }
  