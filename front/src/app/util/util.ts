export const isMinus = (amount: number) => {
  return amount < 0;
};

export function toDateObject(dateString: string): Date {
  // YYYY-MM-DD 形式をそのままDateオブジェクトに変換
  return new Date(dateString);
}

function formatDate(date: Date, format: string): string {
  if (date instanceof Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    if (format === "yyyy-mm-dd") {
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
    if (format === "yyyy-mm") {
      return `${year}-${month}`;
    }
  }
  return "";
}

export function toDateString(date: Date): string {
  // YYYY-MM-DD 形式の文字列を返す
  return formatDate(date, "yyyy-mm-dd");
}

export function toYearMonthString(date: Date): string {
  // YYYY-MM 形式の文字列を返す
  return formatDate(date, "yyyy-mm");
}

function shiftYear(yearMonth: string, years: number) {
  let date = new Date(yearMonth + "-01");

  date.setFullYear(date.getFullYear() + years);

  let year = date.getFullYear();
  let month = date.getMonth() + 1;

  return `${year}-${month.toString().padStart(2, "0")}`;
}

export function getPreviousYearMonth(yearMonth: string) {
  return shiftYear(yearMonth, -1);
}

export function getNextYearMonth(yearMonth: string) {
  return shiftYear(yearMonth, 1);
}

export function formatNumberStringToYen(numberString: string) {
  // 3桁ごとにカンマを挿入
  const formattedString = numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // 末尾に「円」を追加
  return formattedString + "円";
}
