"use client";

import { MemoPopover } from "@/app/components/MemoPopover";
import { Expense } from "@/app/util/types";
import { Card, Spinner, Typography } from "@material-tailwind/react";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { DeleteConfirmDialog } from "@/app/(auth)/expense/DeleteConfirmDialog";
import { UpdateExpenseDialog } from "@/app/(auth)/expense/UpdateExpenseDialog";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useUser } from "@/app/context/UserProvider";
import { getToday } from "@/app/util/util";
import React from "react";

const TABLE_HEAD = ["支払い", "区分", "金額", "メモ", ""];

export const ExpenseTable = ({ fetchData }: { fetchData: Expense[] }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [Error, setError] = useState("");
  const router = useRouter();
  const user = useUser().user;

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deletedExpense, setSelectedExpense] = useState<Expense | null>(null);

  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [updatedExpense, setUpdatedExpense] = useState<Expense | null>(null);

  const handleOpenUpdateDialog = (expense: Expense) => {
    setUpdatedExpense(expense);
    setOpenUpdateDialog(true);
  };

  const handleUpdate = async (updatedExpense: Expense) => {
    if (updatedExpense) {
      setIsLoading(true);

      try {
        const response = await fetch(
          `/api/private/expense/${updatedExpense.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedExpense),
          }
        );

        setError("");
      } catch (error) {
        setError("更新に失敗しました。");
      } finally {
        setIsLoading(false);
      }
      setOpenDeleteDialog(false);
      setSelectedExpense(null);
      //リフレッシュ
      router.refresh();
    }
  };

  const handleOpenDeleteDialog = (expense: Expense) => {
    setSelectedExpense(expense);
    setOpenDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (deletedExpense) {
      setIsLoading(true);
      try {
        await axios.delete(`/api/private/expense/${deletedExpense.id}`);
        setError("");
      } catch (error) {
        setError("削除に失敗しました。");
      } finally {
        setIsLoading(false);
      }
      setOpenDeleteDialog(false);
      setSelectedExpense(null);
      //リフレッシュ
      router.refresh();
    }
  };

  let previousDate = "";

  return (
    <>
      <Card className="h-full w-full mt-6">
        {fetchData.length > 0 ? (
          <table className="max-w-full table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fetchData.map((expense: Expense, index) => (
                <React.Fragment key={index}>
                  {expense.date !== previousDate && (
                    <>
                      <tr className="bg-green-50">
                        <td
                          className="p-4 whitespace-nowrap text-center border-b border-blue-gray-50"
                          colSpan={TABLE_HEAD.length}
                        >
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal text-green-700"
                          >
                            {expense.date}
                          </Typography>
                        </td>
                      </tr>
                    </>
                  )}

                  {(() => {
                    if (expense.date !== previousDate) {
                      previousDate = expense.date;
                    }

                    return (
                      <tr key={index} className="break-all">
                        <td className="p-4 border-b border-blue-gray-50">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {expense.registerUserId}
                          </Typography>
                        </td>
                        <td className="p-4 border-b border-blue-gray-50">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {expense.category}
                          </Typography>
                        </td>
                        <td className="p-4 border-b border-blue-gray-50">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {expense.amount.toLocaleString()}
                          </Typography>
                        </td>
                        <td className="p-4 border-b border-blue-gray-50">
                          <div className="hidden md:block">
                            {/* デスクトップサイズでの  表示 */}
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {expense.memo}
                            </Typography>
                          </div>
                          <div className="md:hidden">
                            {/* スマホサイズでの表示 */}
                            {expense.memo.length >= 10 ? (
                              <MemoPopover
                                content={expense.memo}
                                buttonText="表示"
                              />
                            ) : (
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {expense.memo}
                              </Typography>
                            )}
                          </div>
                        </td>
                        <td className="p-4 border-b border-blue-gray-50">
                          {user.id !== null ? (
                            user.id === expense.registerUserId && (
                              <div className="flex flex-col flex-wrap justify-center gap-3 md:flex-row">
                                <ModeEditIcon
                                  className="cursor-pointer hover:text-green-500"
                                  onClick={() =>
                                    handleOpenUpdateDialog(expense)
                                  }
                                />
                                <DeleteForeverIcon
                                  className="cursor-pointer hover:text-green-500"
                                  onClick={() =>
                                    handleOpenDeleteDialog(expense)
                                  }
                                />
                              </div>
                            )
                          ) : (
                            <Spinner />
                          )}
                        </td>
                      </tr>
                    );
                  })()}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        ) : (
          <span>データは存在しません。</span>
        )}
      </Card>
      {updatedExpense && (
        <UpdateExpenseDialog
          open={openUpdateDialog}
          handleOpen={() => setOpenUpdateDialog(!openUpdateDialog)}
          updatedExpense={updatedExpense}
          handleUpdate={handleUpdate}
        />
      )}
      {deletedExpense && (
        <DeleteConfirmDialog
          open={openDeleteDialog}
          handleOpen={() => setOpenDeleteDialog(!openDeleteDialog)}
          handleDelete={handleDelete}
        />
      )}
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-80 flex items-center justify-center z-50">
          <Spinner />
        </div>
      )}
    </>
  );
};
