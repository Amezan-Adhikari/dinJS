export default function dinjs_GET_MONTH_NAME(month:number) {
    const months: Record<number, string> = {
      1: "वैशाख",
      2: "जेठ",
      3: "असार",
      4: "साउन",
      5: "भदौ",
      6: "असोज",
      7: "कार्तिक",
      8: "मंसिर",
      9: "पुष",
      10: "माघ",
      11: "फागुन",
      12: "चैत",
    };
    return months[month];
  }
