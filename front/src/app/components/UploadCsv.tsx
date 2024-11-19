"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { addError, addSuccess, useAlert } from "../context/AlertProvider";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { Typography } from "@material-tailwind/react";
import {
  IncomeAndExpenseBillingUser,
  IncomeAndExpenseCreate,
  User,
} from "../util/types";
import Papa from "papaparse";
import { parseDateAllFormat, toDateString } from "../util/util";
import { useUser } from "../context/UserProvider";
import { getGroupAllUser, postIncomeAndExpense } from "../util/apiClient";
import { useRouter } from "next/navigation";
import { distributionAmount } from "../(auth)/income-and-expense/BillingUserFormType";

export default function UploadCsv() {
  const alert = useAlert();
  const loginUser = useUser().user;
  const [groupUsers, setGroupUser] = useState<User[]>([]);
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setGroupUser(await getGroupAllUser());
      } catch (error) {
        if (error instanceof Error) {
          addError(error.message, alert);
        }
      }
    };
    fetchData();
  }, []);

  const handleCsvFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      await handleSubmit(selectedFile);

      // ファイル処理後に input の value をリセット
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = async (selectedFile: File) => {
    if (selectedFile) {
      Papa.parse<string[]>(selectedFile, {
        header: false,
        skipEmptyLines: true,
        complete: function (results) {
          const data = results.data;
          processCSVData(data);
        },
        error: function (error) {
          addError(
            "CSVの解析エラーです。CSVの中身を確認してください。:" + error,
            alert
          );
        },
      });
    }
  };
  const processCSVData = async (data: string[][]) => {
    let successCount = 0;

    for (const row of data) {
      const date = parseDateAllFormat(row[0].trim());
      const category = row[1].trim();
      const amount = -parseInt(row[2].trim());
      const memo = row[3].trim();
      const billingUserIds = row[4].split("|");

      let billingUsers: IncomeAndExpenseBillingUser[] = [];

      if (billingUserIds.length === 1 && billingUserIds[0] === "*") {
        //billingUsersを初期化(*の場合)
        groupUsers.forEach((groupUser) => {
          const newBillingUser: IncomeAndExpenseBillingUser = {
            incomeAndExpenseID: 0,
            userID: groupUser.id,
            amount: 0,
            userName: "",
            id: 0,
            liquidationID: 0,
          };
          billingUsers = [...billingUsers, newBillingUser];
        });
      } else {
        //billingUsersを初期化（個別に指定がある場合）
        billingUserIds.forEach((userID) => {
          const newBillingUser: IncomeAndExpenseBillingUser = {
            incomeAndExpenseID: 0,
            userID: userID,
            amount: 0,
            userName: "",
            id: 0,
            liquidationID: 0,
          };
          billingUsers = [...billingUsers, newBillingUser];
        });
      }

      //金額を分配する
      distributionAmount(billingUsers, amount);

      const newIncomeAndExpense: IncomeAndExpenseCreate = {
        date: toDateString(date),
        category: category,
        amount: amount,
        memo: memo,
        registerUserID: loginUser.id,
        billingUsers: billingUsers,
      };

      try {
        await postIncomeAndExpense(newIncomeAndExpense);
        successCount++;
      } catch (error) {
        if (error instanceof Error) {
          addError(error.message, alert);
          break;
        }
      }
    }

    if (successCount === data.length) {
      //メッセージ表示
      addSuccess("一括登録が成功しました。", alert);
    } else {
      //メッセージ表示
      addSuccess(
        "一部エラーがあり、エラーより前のデータは正常に登録成功しました。：" +
          successCount +
          "件目まで登録",
        alert
      );
    }
    //リフレッシュ
    router.refresh();
  };

  return (
    <form>
      <div className="flex gap-2 items-center">
        <label htmlFor="csv-file-upload">
          <FileUploadIcon
            className="cursor-pointer hover:transform hover:scale-125 transition-transform duration-300"
            fontSize="large"
          />
        </label>
        <input
          id="csv-file-upload"
          type="file"
          accept=".csv"
          onChange={handleCsvFileChange}
          style={{ display: "none" }}
          ref={fileInputRef}
        />
        <label htmlFor="csv-file-upload">
          <Typography variant="small" className="cursor-pointer">
            CSV一括登録
          </Typography>
        </label>
      </div>
    </form>
  );
}
