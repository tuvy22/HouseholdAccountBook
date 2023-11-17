import { z } from "zod";
const dateSchema = z.string().min(1, { message: "日付は必須項目です。" });
const categorySchema = z.string().min(1, { message: "区分は必須項目です。" });
const amountSchema = z
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
  });
const memoSchema = z
  .string()
  .max(50, { message: "メモは50文字以下で入力してください。" });

const billingUserCheckboxSchema = z.array(z.any());
const billingAmountSchema = z.array(amountSchema);

export const incomeExpenseSchema = z.object({
  date: dateSchema,
  category: categorySchema,
  amount: amountSchema,
  memo: memoSchema,
  // billingUserCheckbox: billingUserCheckboxSchema,
  billingAmount: billingAmountSchema,
});

export type IncomeExpenseSchema = z.infer<typeof incomeExpenseSchema>;
