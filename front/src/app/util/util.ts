export const getToday = (): string => {
  // 今日の日付を YYYY-MM-DD 形式で取得
  const today = new Date();
  const formattedDate = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  return formattedDate;
};
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
    }, 10000); // 3000ミリ秒 = 3秒
  });
}
