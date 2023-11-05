import { z } from "zod";

export const schema = z.object({
  id: z.string().nonempty({ message: "IDは必須項目です。" }).max(10, { message: "IDは10文字以下で入力してください。" }),
  name: z.string().nonempty({ message: "名前は必須項目です。" }).max(20, { message: "名前は20文字以下で入力してください。" }),
    
});


export type Schema = z.infer<typeof schema>;