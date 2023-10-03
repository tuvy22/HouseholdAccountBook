export const today = (): string => { 
  // 今日の日付を YYYY-MM-DD 形式で取得
  const today = new Date();
  const formattedDate = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  return formattedDate;
}