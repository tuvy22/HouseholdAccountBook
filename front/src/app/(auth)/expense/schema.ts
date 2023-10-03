import { z } from "zod";

export const schema = z.object({
  date: z.string().min(1, { message: "日付は必須項目です。" }),
  category: z.string().nonempty({message:"区分は必須k項目です。"}),
  amount: z.string().min(1, { message: "金額は必須項目です。" })  .refine(value => !isNaN(Number(value)), {
    message: "金額には数値に変換できる値を入力してください。",
  })
  .transform(value => Number(value))
  .refine(value => value >= 1, {
    message: "金額は0より大きい数値を入力してください。",
  }),
  memo: z.string().max(50, { message: "メモは50文字以下で入力してください。" }),
}); 

export type Schema = z.infer<typeof schema>;