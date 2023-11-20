"use client";

import SubmitButtonForm from "../../components/SubmitButtonForm";
import DateForm from "../income-and-expense/DateForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LiquidationSchema, liquidationSchema } from "./LiquidationSchema";
import {
  Button,
  Checkbox,
  Input,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Typography,
} from "@/app/materialTailwindExports";
import React, { useEffect, useState } from "react";
import { User } from "@/app/util/types";
import { getGroupAllUser } from "@/app/util/apiClient";
const Liquidation = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<LiquidationSchema>({
    resolver: zodResolver(liquidationSchema),
  });
  const [data, setData] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User>();
  useEffect(() => {
    const fetchData = async () => {
      setData(await getGroupAllUser());
    };
    fetchData();
  }, []);

  // MenuItemがクリックされたときに呼ばれる関数
  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
  };

  // フォーム送信時の処理
  const onSubmit = (data: LiquidationSchema) => {
    console.log(selectedUser);
    console.log(data);
  };
  return (
    <>
      <form
        onSubmit={(e) => handleSubmit((data) => onSubmit(data))(e)}
        className="mx-auto mt-5"
      >
        <Typography variant="h2" className="text-xl text-center md:text-left">
          清算対象
        </Typography>
        <div className="flex flex-col flex-wrap justify-center gap-3 md:flex-row max-w-xl mt-6">
          <div className="flex flex-col flex-grow">
            <Input
              label="開始日付 (必須)"
              type="date"
              size="lg"
              crossOrigin={undefined}
              {...register("fromDate")}
            />
          </div>
          <div className="flex flex-col flex-grow">
            <Input
              label="終了日付 (必須)"
              type="date"
              size="lg"
              crossOrigin={undefined}
              {...register("toDate")}
            />
          </div>
          <div className="flex flex-col flex-grow">
            <Menu>
              <MenuHandler>
                <Button
                  variant="outlined"
                  color="red"
                  className="h-11 w-full md:w-28"
                >
                  清算相手
                </Button>
              </MenuHandler>
              <MenuList>
                {data.map((user, index: number) => (
                  <MenuItem
                    key={index}
                    onClick={() => handleUserSelect(user)}
                    className={`py-2 my-1 ${
                      selectedUser === user ? "bg-gray-200" : ""
                    }`}
                  >
                    <label className="flex cursor-pointer items-center gap-2 p-2">
                      {user.name}
                    </label>
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </div>
          {errors.fromDate && (
            <div className="text-red-500 text-left w-full">
              {errors.fromDate.message}
            </div>
          )}
          {errors.toDate && (
            <div className="text-red-500  text-left w-full">
              {errors.toDate.message}
            </div>
          )}
        </div>
        <div className="flex justify-end mt-3">
          <SubmitButtonForm buttonName={"清算"} />
        </div>
      </form>
    </>
  );
};

export default Liquidation;
