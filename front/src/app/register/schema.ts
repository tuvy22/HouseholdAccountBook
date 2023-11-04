import { z } from "zod";

export const schema = z
  .object({
    id: z
      .string()
      .min(1, { message: "ユーザーIDは必須項目です。" })
      .max(10, { message: "ユーザーIDは10文字以下で入力してください。" })
      .refine((id) => /^[A-Za-z0-9]+$/.test(id), {
        message: "ユーザーIDは英数字のみで入力してください。",
      }),
    password: z
      .string()
      .min(8, { message: "パスワードは8文字以上で入力してください。" })
      .max(50, { message: "パスワードは50文字以下で入力してください。" })
      .refine(
        (password) =>
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).*$/.test(password),
        {
          message: "パスワードは英字、数字、記号を含む必要があります。",
        }
      ),
    passwordConfirmation: z.string(),
    name: z
      .string()
      .min(1, { message: "ニックネームは必須項目です。" })
      .max(10, { message: "ニックネームは10文字以下で入力してください。" }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    path: ["passwordConfirmation"],
    message: "パスワードが一致しません。",
  });

export type Schema = z.infer<typeof schema>;
