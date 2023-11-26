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
      if (data.fromDate && data.toDate) {
        const fromDate = new Date(data.fromDate);
        const toDate = new Date(data.toDate);
        return fromDate <= toDate;
      }
      return true;
    },
    {
      message: "終了期間は開始期間より前にしてください。",
      path: ["toDate"], // エラーメッセージを表示するフィールドのパス
    }
  );
export type LiquidationSchema = z.infer<typeof liquidationSchema>;
