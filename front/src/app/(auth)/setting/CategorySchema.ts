import { z } from "zod";

export type CategoryFormData = {
  categories: { category: string }[];
};

export const categorySchema = z.object({
  categories: z.array(
    z.object({
      category: z
        .string()
        .min(1, "カテゴリーは必ず入力してください")
        .max(10, "カテゴリーは10文字以下で入力してください。"),
    })
  ),
});
