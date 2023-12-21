"use client";

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IncomeExpenseSchema,
  incomeExpenseSchema,
} from "./IncomeAndExpenseSchema";
import SubmitButtonForm from "../../components/SubmitButtonForm";
import { toDateString } from "@/app/util/util";
import DateForm from "./DateForm";
import CategoryForm from "./CategoryForm";
import AmountForm from "./AmountForm";
import MemoForm from "./MemoForm";
import { BillingUserFormType } from "./BillingUserFormType";
import { BillingUserForm } from "./BillingUserForm";
import { Category } from "@/app/util/types";
import { getCategoryAllClient } from "@/app/util/apiClient";
import { addError, useAlert } from "@/app/context/AlertProvider";

export const ExpenseForm = ({
  onSubmit,
  triggerReset,
  billingUsers,
  setBillingUsers,
}: {
  onSubmit: (data: IncomeExpenseSchema, isMinus: boolean) => Promise<void>;
  triggerReset: number;
  billingUsers: BillingUserFormType[];
  setBillingUsers: Dispatch<SetStateAction<BillingUserFormType[]>>;
}) => {
  const alert = useAlert();

  const {
    control,
    register,
    handleSubmit,
    reset,
    getValues,
    watch,
    formState: { errors },
  } = useForm<IncomeExpenseSchema>({
    resolver: zodResolver(incomeExpenseSchema),
  });

  const [categorys, setCategorys] = useState<Category[]>([]);

  const resetForm = useCallback(() => {
    const categoryValue = getValues().category;
    reset({
      date: toDateString(new Date()),
      category: categoryValue && categoryValue.length > 0 ? categoryValue : "",
      amount: "",
      memo: "",
    });
  }, [getValues, reset]);
  useEffect(() => {
    resetForm();
  }, [resetForm, triggerReset]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setCategorys(await getCategoryAllClient(true));
      } catch (error) {
        if (error instanceof Error) {
          addError(error.message, alert);
        }
      }
    };

    fetchCategory();
  }, [alert]);

  return (
    <>
      <form onSubmit={(e) => handleSubmit((data) => onSubmit(data, true))(e)}>
        <div className="flex flex-col flex-wrap justify-between gap-3 md:flex-row">
          <DateForm errors={errors} register={register} />
          <CategoryForm errors={errors} control={control} options={categorys} />
          <AmountForm errors={errors} register={register} />
          <MemoForm errors={errors} register={register} />
          <BillingUserForm
            watch={watch}
            billingUsers={billingUsers}
            setBillingUsers={setBillingUsers}
            isUpdate={false}
          />
        </div>

        <SubmitButtonForm buttonName={"登録"} buttonColor={"red"} />
      </form>
    </>
  );
};
