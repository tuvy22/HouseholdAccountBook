import { z } from "zod";
const fromDateSchema = z.string();
const toDateSchema = z.string();

export const liquidationSchema = z
  .object({
    fromDate: fromDateSchema,
    toDate: toDateSchema,
  })
  .refine(
    (data) => {
      const fromDate = new Date(data.fromDate);
      const toDate = new Date(data.toDate);

      // fromDateがtoDateより前、または同じ日付であるか確認します
      return fromDate <= toDate;
    },
    {
      // エラーオブジェクトを返して、toDateフィールドにエラーメッセージを関連付けます
      message: "終了日付は開始日付より前にしてください。",
      path: ["toDate"], // エラーメッセージを表示するフィールドのパス
    }
  );
export type LiquidationSchema = z.infer<typeof liquidationSchema>;
