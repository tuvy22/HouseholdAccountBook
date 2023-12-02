"use client";

import { Button, Input } from "@/app/materialTailwindExports";

import { useEffect } from "react";

import { Category } from "@/app/util/types";
import {
  getCategoryAllClient,
  replaceAllCategorys,
} from "@/app/util/apiClient";

import { useFieldArray, useForm } from "react-hook-form";
import { useUser } from "@/app/context/UserProvider";
import { useAlert } from "@/app/context/AlertProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertValue } from "@/app/components/AlertCustoms";
import { CategoryFormData, categorySchema } from "./CategorySchema";
import ClearIcon from "@mui/icons-material/Clear";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

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
      const eFetchCategorys = await getCategoryAllClient(isExpense);
      let resetData: CategoryFormData = {
        categories: [],
      };

      eFetchCategorys.forEach((category) => {
        resetData.categories.push({ category: category.name });
      });
      reset(resetData);
    };
    getAllCategory();
  }, [reset]);
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

    await replaceAllCategorys(datas, isExpense);

    //結果アラート
    const newAlertValue: AlertValue = {
      color: "green",
      value: "更新が成功しました。",
    };
    alert.setAlertValues([...alert.alertValues, newAlertValue]);
  };
  return (
    <form
      className="w-80 max-w-screen-lg sm:w-96"
      onSubmit={(e) => handleSubmit((data) => onSubmit(data))(e)}
    >
      <div className="flex flex-col gap-6">
        {fields.map((field, index) => (
          <div key={index} className="mb-1 gap-1 flex-col">
            <div className="flex gap-3 items-center">
              <Input
                type="text"
                size="lg"
                crossOrigin={undefined}
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
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
        <div className="text-right">
          <AddCircleOutlineIcon
            className="cursor-pointer hover:text-green-500"
            onClick={() => append({ category: "" })}
          />
        </div>
      </div>
      <Button
        type="submit"
        variant="filled"
        color="green"
        size="lg"
        className="mt-10"
        fullWidth
      >
        確定
      </Button>
    </form>
  );
}
