"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PasswordChangeSchema,
  passwordChangeSchema,
} from "@/app/components/UserSchema";
import { useUser } from "@/app/context/UserProvider";
import { addError, addSuccess, useAlert } from "@/app/context/AlertProvider";
import SubmitButtonForm from "@/app/components/SubmitButtonForm";
import PasswordForm from "@/app/components/PasswordForm";
import { PasswordChange } from "@/app/util/types";
import { passwordChange } from "@/app/util/apiClient";

export function PasswordChange() {
  const user = useUser();
  const alert = useAlert();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordChangeSchema>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      prePassword: "",
      password: "",
      passwordConfirmation: "",
    },
  });
  const onSubmit = async (data: PasswordChangeSchema) => {
    const passwordChangeData: PasswordChange = {
      prePassword: data.prePassword,
      password: data.password,
    };

    try {
      await passwordChange(user.user.id, passwordChangeData);
      //結果アラート
      addSuccess("更新が成功しました。", alert);
    } catch (error) {
      if (error instanceof Error) {
        addError(error.message, alert);
      }
    }
    //項目リセット
    reset({
      prePassword: "",
      password: "",
      passwordConfirmation: "",
    });
  };
  return (
    <form
      onSubmit={(e) => handleSubmit((data) => onSubmit(data))(e)}
      className="w-full max-w-sm flex flex-col items-center justify-center gap-4"
    >
      <PasswordForm
        label={"パスワード（変更前）"}
        passwordChangeRegister={register}
        passwordChangeRegisterName={"prePassword"}
        fieldError={errors.prePassword}
      />
      <PasswordForm
        label={"パスワード（変更後）"}
        passwordChangeRegister={register}
        passwordChangeRegisterName={"password"}
        fieldError={errors.password}
      />
      <PasswordForm
        label={"パスワード（確認）"}
        passwordChangeRegister={register}
        passwordChangeRegisterName={"passwordConfirmation"}
        fieldError={errors.passwordConfirmation}
      />

      <SubmitButtonForm buttonName={"変更"} buttonColor={"green"} />
    </form>
  );
}
