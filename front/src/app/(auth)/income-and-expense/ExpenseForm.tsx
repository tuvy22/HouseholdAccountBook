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
import { Category, Receipt } from "@/app/util/types";
import { getCategoryAllClient } from "@/app/util/apiClient";
import { addError, useAlert } from "@/app/context/AlertProvider";
import ReceiptOcr from "@/app/components/ReceiptOcr";
import { Typography } from "@/app/materialTailwindExports";
import UploadCsv from "@/app/components/UploadCsv";

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
    setValue,
    watch,
    formState: { errors },
  } = useForm<IncomeExpenseSchema>({
    resolver: zodResolver(incomeExpenseSchema),
  });

  const [categorys, setCategorys] = useState<Category[]>([]);
  const [receipt, setReceipt] = useState<Receipt>();

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
    setValue(
      "amount",
      receipt?.totalAmount ? receipt.totalAmount.toString() : ""
    );
    setValue("memo", receipt?.storeName ? receipt.storeName : "");
  }, [receipt, setValue]);

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
  }, []);

  return (
    <>
      <div className="flex gap-4 flex-col">
        <div className="flex flex-col flex-wrap gap-3 md:flex-row">
          <ReceiptOcr setReceipt={setReceipt} />
          <UploadCsv />
        </div>
        <form
          onSubmit={(e) => handleSubmit((data) => onSubmit(data, true))(e)}
          className="flex-1"
        >
          <div className="flex flex-col flex-wrap justify-between gap-3 md:flex-row">
            <DateForm errors={errors} register={register} />
            <CategoryForm
              errors={errors}
              control={control}
              options={categorys}
            />
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
      </div>
    </>
  );
};
