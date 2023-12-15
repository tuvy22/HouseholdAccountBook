"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UserUpdateSchema,
  userUpdateSchema,
} from "@/app/components/UserSchema";
import NameForm from "@/app/components/NameForm";
import { updateUser } from "@/app/util/apiClient";
import { useUser } from "@/app/context/UserProvider";
import { addError, addSuccess, useAlert } from "@/app/context/AlertProvider";
import SubmitButtonForm from "@/app/components/SubmitButtonForm";
import { UserUpdate } from "@/app/util/types";

export function UserName() {
  const user = useUser();
  const alert = useAlert();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserUpdateSchema>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      name: user.user?.name ?? "",
    },
  });
  const onSubmit = async (data: UserUpdateSchema) => {
    const userUpdate: UserUpdate = {
      name: data.name,
    };

    try {
      const updatedUser = await updateUser(userUpdate);
      user.setUser(updatedUser);
      //結果アラート
      addSuccess("更新が成功しました。", alert);
    } catch (error) {
      if (error instanceof Error) {
        addError(error.message, alert);
      }
    }
  };
  return (
    <form
      onSubmit={(e) => handleSubmit((data) => onSubmit(data))(e)}
      className="w-full max-w-sm mx-auto"
    >
      <NameForm errors={errors} updateRegister={register} />

      <SubmitButtonForm buttonName={"更新"} buttonColor={"green"} />
    </form>
  );
}
