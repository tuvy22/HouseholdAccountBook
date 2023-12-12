import { z } from "zod";

const nameSchema = z
  .string()
  .min(1, { message: "ニックネームは必須項目です。" })
  .max(10, { message: "ニックネームは10文字以下で入力してください。" });

const idSchema = z
  .string()
  .min(5, { message: "ユーザーIDは5文字以上で入力してください。" })
  .max(10, { message: "ユーザーIDは10文字以下で入力してください。" })
  .refine((id) => /^[A-Za-z0-9]+$/.test(id), {
    message: "ユーザーIDは英数字のみで入力してください。",
  });

const passwordSchema = z
  .string()
  .min(8, { message: "パスワードは8文字以上で入力してください。" })
  .max(50, { message: "パスワードは50文字以下で入力してください。" })
  .refine(
    (password) => /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).*$/.test(password),
    {
      message: "パスワードは英字、数字、記号を含む必要があります。",
    }
  );

export const userCreateSchema = z
  .object({
    id: idSchema,
    password: passwordSchema,
    passwordConfirmation: z.string(),
    name: nameSchema,
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    path: ["passwordConfirmation"],
    message: "パスワードが一致しません。",
  });
export const passwordChangeSchema = z
  .object({
    prePassword: z.string(),
    password: passwordSchema,
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    path: ["passwordConfirmation"],
    message: "パスワードが一致しません。",
  })
  .refine((data) => data.password !== data.prePassword, {
    path: ["password"],
    message: "同じパスワードに変更することは出来ません。",
  });

export const userUpdateSchema = z.object({
  name: nameSchema,
});

export type UserCreateSchema = z.infer<typeof userCreateSchema>;
export type PasswordChangeSchema = z.infer<typeof passwordChangeSchema>;
export type UserUpdateSchema = z.infer<typeof userUpdateSchema>;
