import { z } from "zod";

export const initialAmountSchema = z.object({
  amount: z
    .string()
    .refine((value) => !isNaN(Number(value)), {
      message: "金額には数値に変換できる値を入力してください。",
    })
    .refine((value) => Number(value) >= 0, {
      message: "金額は0以上の数値を入力してください。",
    })
    .refine((value) => Number(value) < 100000000, {
      message: "金額は100,000,000より小さい数値を入力してください。",
    }),
});

export type InitialAmountSchema = z.infer<typeof initialAmountSchema>;
