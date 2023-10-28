export const expenseCategory = [
  "食費",
  "衣類",
  "住居",
  "電気",
  "ガス",
  "水道",
  "通信",
  "交通費",
  "交際費",
  "家具・家電",
  "その他",
];
export const incomeCategory = ["給与", "ボーナス", "その他収入"];

export const isMinus = (amount: number) => {
  return amount < 0;
};

export function waitThreeSeconds() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("3秒経過しました");
    }, 3000); // 3000ミリ秒 = 3秒
  });
}

export function toDateObject(dateString: string): Date {
  // YYYY-MM-DD 形式をそのままDateオブジェクトに変換
  return new Date(dateString);
}

export function toDateString(date: Date): string {
  // YYYY-MM-DD 形式の文字列を返す
  if (date instanceof Date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  }
  return "";
}
