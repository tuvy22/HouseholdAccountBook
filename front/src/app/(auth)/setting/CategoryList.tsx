"use client";

import { Input } from "@/app/materialTailwindExports";

import { useEffect } from "react";

import { Category } from "@/app/util/types";
import {
  getCategoryAllClient,
  replaceAllCategorys,
} from "@/app/util/apiClient";

import { useFieldArray, useForm } from "react-hook-form";
import { useUser } from "@/app/context/UserProvider";
import { addError, addSuccess, useAlert } from "@/app/context/AlertProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { CategoryFormData, categorySchema } from "./CategorySchema";
import ClearIcon from "@mui/icons-material/Clear";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SubmitButtonForm from "@/app/components/SubmitButtonForm";

export default function CategoryList({ isExpense }: { isExpense: boolean }) {
  const user = useUser();
  const alert = useAlert();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      categories: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "categories",
  });

  useEffect(() => {
    const getAllCategory = async () => {
      try {
        const eFetchCategorys = await getCategoryAllClient(isExpense);

        let resetData: CategoryFormData = {
          categories: [],
        };

        eFetchCategorys.forEach((category) => {
          resetData.categories.push({ category: category.name });
        });
        reset(resetData);
      } catch (error) {
        if (error instanceof Error) {
          addError(error.message, alert);
        }
      }
    };
    getAllCategory();
  }, [alert, isExpense, reset]);
  const onSubmit = async (data: CategoryFormData) => {
    let datas: Category[] = [];

    data.categories.forEach(function (categorie) {
      const data: Category = {
        id: 0,
        name: categorie.category,
        groupId: user.user.groupId,
        isExpense: isExpense,
      };
      datas.push(data);
    });
    try {
      await replaceAllCategorys(datas, isExpense);

      //結果アラート
      addSuccess("更新が成功しました。", alert);
    } catch (error) {
      if (error instanceof Error) {
        addError(error.message, alert);
      }
    }
  };
  return (
    <form onSubmit={(e) => handleSubmit((data) => onSubmit(data))(e)}>
      <div className="flex flex-col gap-6">
        {fields.map((field, index) => (
          <div key={index} className="mb-1 gap-1 flex-col">
            <div className="flex gap-3 items-center">
              <Input
                type="text"
                label={`カテゴリー${index + 1}`}
                variant="outlined"
                size="lg"
                crossOrigin={undefined}
                key={field.id}
                {...register(`categories.${index}.category` as const)}
              />
              <ClearIcon
                className="cursor-pointer hover:text-red-500"
                onClick={() => remove(index)}
              />
            </div>
            <div>
              {errors.categories &&
                Array.isArray(errors.categories) &&
                errors.categories[index] && (
                  <div className="text-red-500">
                    {errors.categories[index].category.message}
                  </div>
                )}
            </div>
          </div>
        ))}
        <div className="text-center">
          <AddCircleOutlineIcon
            className="cursor-pointer hover:text-green-500"
            fontSize="large"
            onClick={() => append({ category: "" })}
          />
        </div>
      </div>
      <SubmitButtonForm
        buttonName={"確定"}
        buttonColor={isExpense ? "red" : "blue"}
      />
    </form>
  );
}
