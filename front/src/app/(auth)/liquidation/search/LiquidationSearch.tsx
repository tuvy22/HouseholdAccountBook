"use client";

import SubmitButtonForm from "../../../components/SubmitButtonForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LiquidationSchema, liquidationSchema } from "./LiquidationSchema";
import {
  Button,
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
import { toDateString } from "@/app/util/util";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserProvider";
import { addError, useAlert } from "@/app/context/AlertProvider";
import { useLiquidationSearchForm } from "@/app/context/LiquidationSearchFormProvider";
import { LiquidationSearchForm } from "@/app/context/LiquidationSearchFormContext";
import Link from "next/link";
import UnavailablePage from "../UnavailablePage";

const LiquidationSearch = () => {
  const liquidationSearchForm = useLiquidationSearchForm();
  const contextFromDate = liquidationSearchForm.liquidationSearchForm.fromDate;
  const contextToDate = liquidationSearchForm.liquidationSearchForm.toDate;
  const contextUserID = liquidationSearchForm.liquidationSearchForm.userId;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LiquidationSchema>({
    resolver: zodResolver(liquidationSchema),
    defaultValues: {
      fromDate: contextFromDate ? contextFromDate : "",
      toDate: contextToDate ? contextToDate : toDateString(new Date()),
    },
  });
  const [groupData, setGroupData] = useState<User[]>([]);
  const [selectedUserID, setSelectedUserID] = useState<string>();
  const [selectedUserError, setSelectedError] = useState("");

  const router = useRouter();
  const loginUser = useUser().user;

  const alert = useAlert();

  // フォーム送信時の処理
  const onSubmit = async (data: LiquidationSchema) => {
    if (!selectedUserID) {
      setSelectedError("清算相手が選択されていません。");
      return;
    }
    //検索条件の保存
    const saveLiquidationSearchForm: LiquidationSearchForm = {
      fromDate: data.fromDate,
      toDate: data.toDate,
      userId: selectedUserID,
    };
    liquidationSearchForm.setLiquidationSearchForm(saveLiquidationSearchForm);

    // 検索画面に遷移
    router.push(
      `/liquidation/search-result?from-date=${data.fromDate}&to-date=${data.toDate}&target-user=${selectedUserID}`
    );
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        setGroupData(await getGroupAllUser());
      } catch (error) {
        if (error instanceof Error) {
          addError(error.message, alert);
        }
      }
    };
    fetchData();
  }, []);

  //検索条件(精算対象)の復元
  useEffect(() => {
    setSelectedUserID(contextUserID ? contextUserID : "");
  }, [contextUserID]);

  return (
    <>
      <div className="flex md:justify-between justify-center flex-col md:flex-row gap-4">
        <Typography
          variant="h3"
          color="gray"
          className="text-center md:text-left"
        >
          清算対象検索
        </Typography>
        <div className="flex items-end justify-end">
          <Link
            href={"/liquidation/result"}
            className="text-blue-600 underline hover:no-underline"
            prefetch={false}
          >
            清算結果はこちらから
          </Link>
        </div>
      </div>
      <form onSubmit={(e) => handleSubmit((data) => onSubmit(data))(e)}>
        <div className="mx-auto max-w-2xl">
          <div className="flex flex-col flex-wrap justify-center gap-3 md:flex-row mt-6">
            <div className="flex flex-col flex-grow">
              <Input
                label="開始期間 (必須)"
                type="date"
                size="lg"
                crossOrigin={undefined}
                {...register("fromDate")}
              />
            </div>
            <div className="flex justify-center items-center origin-center rotate-90 md:rotate-0">
              〜
            </div>
            <div className="flex flex-col flex-grow">
              <Input
                label="終了期間 (必須)"
                type="date"
                size="lg"
                crossOrigin={undefined}
                {...register("toDate")}
              />
            </div>
            <div className="flex flex-col justify-end">
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
                  {groupData.map(
                    (groupUser, index: number) =>
                      groupUser.id != loginUser.id && (
                        <MenuItem
                          key={index}
                          onClick={() => setSelectedUserID(groupUser.id)}
                          className={`py-2 my-1 ${
                            selectedUserID === groupUser.id ? "bg-gray-200" : ""
                          }`}
                        >
                          <label className="flex cursor-pointer items-center gap-2 p-2">
                            {groupUser.name}
                          </label>
                        </MenuItem>
                      )
                  )}
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
            {selectedUserError && (
              <div className="text-red-500  text-left w-full">
                {selectedUserError}
              </div>
            )}
          </div>
        </div>
        <SubmitButtonForm buttonName={"検索"} buttonColor={"green"} />
      </form>
    </>
  );
};

export default LiquidationSearch;
