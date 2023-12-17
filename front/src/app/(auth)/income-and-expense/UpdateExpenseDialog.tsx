"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogBody,
} from "@/app/materialTailwindExports";
import {
  Category,
  IncomeAndExpense,
  IncomeAndExpenseUpdate,
} from "../../util/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IncomeExpenseSchema,
  incomeExpenseSchema,
} from "./IncomeAndExpenseSchema";
import { isMinus, toDateObject, toDateString } from "@/app/util/util";
import { IncomeAndExpenseTabs } from "../../components/IncomeAndExpenseTabs";
import { useForm } from "react-hook-form";
import DateForm from "./DateForm";
import CategoryForm from "./CategoryForm";

import AmountForm from "./AmountForm";
import MemoForm from "./MemoForm";
import { BillingUserForm } from "./BillingUserForm";
import {
  BillingUserFormType,
  convertToBillingUsers,
} from "./BillingUserFormType";
import { getCategoryAllClient } from "@/app/util/apiClient";
import { addError, useAlert } from "@/app/context/AlertProvider";

type Props = {
  open: boolean;
  handleOpen: () => void;
  incomeAndExpense: IncomeAndExpense;
  handleUpdate: (
    id: number,
    incomeAndExpenseUpdate: IncomeAndExpenseUpdate
  ) => void;
};

export const UpdateExpenseDialog: React.FC<Props> = ({
  open,
  handleOpen,
  incomeAndExpense: updatedIncomeAndExpense,
  handleUpdate,
}) => {
  const isDialogMinus = isMinus(updatedIncomeAndExpense.amount);
  const [billingUsers, setBillingUsers] = useState<BillingUserFormType[]>([]);
  const [categorys, setCategorys] = useState<Category[]>([]);
  const alert = useAlert();

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<IncomeExpenseSchema>({
    resolver: zodResolver(incomeExpenseSchema),
  });
  useEffect(() => {
    if (open) {
      reset({
        date: toDateString(new Date(updatedIncomeAndExpense.date)),
        category: updatedIncomeAndExpense.category,
        amount: isDialogMinus
          ? (-updatedIncomeAndExpense.amount).toString()
          : updatedIncomeAndExpense.amount.toString(),
        memo: updatedIncomeAndExpense.memo,
      });
    }
  }, [
    open,
    updatedIncomeAndExpense.amount,
    updatedIncomeAndExpense.category,
    updatedIncomeAndExpense.date,
    updatedIncomeAndExpense.memo,
    reset,
    isDialogMinus,
  ]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setCategorys(await getCategoryAllClient(isDialogMinus));
      } catch (error) {
        if (error instanceof Error) {
          addError(error.message, alert);
        }
      }
    };

    fetchCategory();
  }, []);

  const onSubmit = (data: IncomeExpenseSchema) => {
    const newIncomeAndExpense: IncomeAndExpenseUpdate = {
      category: data.category,
      amount: isDialogMinus ? -parseInt(data.amount) : parseInt(data.amount),
      memo: data.memo,
      date: toDateObject(data.date),
      billingUsers: convertToBillingUsers(billingUsers, isDialogMinus),
    };
    handleUpdate(updatedIncomeAndExpense.id, newIncomeAndExpense);
    handleOpen();
  };

  return (
    <>
      <Dialog open={open} size={"xl"} handler={handleOpen}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>編集</DialogHeader>
          <DialogBody>
            <IncomeAndExpenseTabs
              isIncome={!isDialogMinus}
              isExpense={isDialogMinus}
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
                {isDialogMinus && (
                  <BillingUserForm
                    watch={watch}
                    billingUsers={billingUsers}
                    isUpdate={true}
                    setBillingUsers={setBillingUsers}
                    updatePreBillingUser={updatedIncomeAndExpense.billingUsers}
                  />
                )}
              </div>
            </IncomeAndExpenseTabs>
          </DialogBody>

          <DialogFooter>
            <Button
              variant="text"
              color="red"
              onClick={() => {
                handleOpen();
              }}
              className="mr-1"
            >
              キャンセル
            </Button>
            <Button variant="gradient" color="green" type="submit">
              更新
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </>
  );
};
