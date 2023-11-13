import { z } from "zod";

export const incomeAndExpenseSchema = z.object({
  date: z.string().min(1, { message: "日付は必須項目です。" }),
  category: z.string().min(1, { message: "区分は必須項目です。" }),
  amount: z
    .string()
    .min(1, { message: "金額は必須項目です。" })
    .refine((value) => !isNaN(Number(value)), {
      message: "金額には数値に変換できる値を入力してください。",
    })
    .refine((value) => Number(value) >= 1, {
      message: "金額は1以上の数値を入力してください。",
    })
    .refine((value) => Number(value) < 100000000, {
      message: "金額は100,000,000より小さい数値を入力してください。",
    }),
  memo: z.string().max(50, { message: "メモは50文字以下で入力してください。" }),
});

export type IncomeAndExpenseSchema = z.infer<typeof incomeAndExpenseSchema>;
