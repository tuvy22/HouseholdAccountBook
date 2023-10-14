"use client";

import { Expense } from "@/app/util/types";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  Select,
  Option,
  Input,
  Spinner,
} from "@material-tailwind/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Schema, schema } from "./schema";
import { useRouter } from "next/navigation";
import { getToday } from "../../util/util";
import { useUser } from "@/app/context/UserProvider";
import DateForm from "./DateForm";
import CategoryForm from "./CategoryForm";
import AmountForm from "./AmountForm";
import MemoForm from "./MemoForm";
import SubmitButtonForm from "./SubmitButtonForm";
import { registerSchema } from "./register";

export const IncomeForm = () => {
  const [today] = useState(getToday());

  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  });

  // 現在表示されているメモのインデックスを追跡するための状態
  const [visibleMemoIndex, setVisibleMemoIndex] = useState<number | null>(null);
  const router = useRouter();
  const user = useUser().user;

  const onSubmit = async (data: Schema) => {
    setIsLoading(true);
    if (!(await registerSchema(data, user.id == null ? "" : user.id, false))) {
      router.push("/login");
      return;
    }

    resetForm();

    //リフレッシュ
    router.refresh();

    setIsLoading(false);
  };
  const resetForm = useCallback(() => {
    reset({
      date: today,
      category: "",
      amount: "",
      memo: "",
    });
  }, [reset, today]);
  useEffect(() => {
    resetForm();
  }, [resetForm]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col flex-wrap justify-between gap-3 md:flex-row">
          <DateForm errors={errors} register={register} />
          <CategoryForm
            errors={errors}
            register={register}
            control={control}
            options={["給与", "ボーナス", "その他収入"]}
          />
          <AmountForm errors={errors} register={register} />
          <MemoForm errors={errors} register={register} />
        </div>
        <div className="flex justify-end">
          <SubmitButtonForm />
        </div>
      </form>
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-80 flex items-center justify-center z-50">
          <Spinner />
        </div>
      )}
    </>
  );
};
