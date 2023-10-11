"use client";

import { PopoverAnimation } from "@/app/components/Popover";
import { Expense } from "@/app/util/types";
import { Button, Card, Spinner, Typography } from "@material-tailwind/react";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { DeleteConfirmDialog } from "@/app/(auth)/expense/DeleteConfirmDialog";
import { UpdateExpenseDialog } from "@/app/(auth)/expense/UpdateExpenseDialog";

const TABLE_HEAD = ["日付", "支払い", "区分", "金額", "メモ", "操作"];

export const ExpenseTable = ({ fetchData }: { fetchData: Expense[] }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [Error, setError] = useState("");
  const router = useRouter();

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

  return (
    <div className="mt-6">
      {fetchData.length > 0 ? (
        <>
          <Card className="h-full w-full overflow-clip">
            <table className="w-full min-w-max table-auto text-left">
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
                  <tr key={index} className="even:bg-blue-gray-50/50">
                    <td className="p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {expense.date}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {expense.registerUserId}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {expense.category}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {expense.amount}
                      </Typography>
                    </td>
                    <td className="p-4 max-w-md">
                      <div className="hidden md:block">
                        {/* デスクトップサイズでの  表示 */}
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal break-words"
                        >
                          {expense.memo}
                        </Typography>
                      </div>
                      <div className="md:hidden">
                        {/* スマホサイズでの表示 */}
                        {expense.memo.length >= 10 ? (
                          <PopoverAnimation
                            content={expense.memo}
                            buttonText="表示"
                          />
                        ) : (
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal break-words"
                          >
                            {expense.memo}
                          </Typography>
                        )}
                      </div>
                    </td>
                    <td className="p-4 flex flex-col flex-wrap justify-start gap-3 md:flex-row">
                      <Button
                        type="submit"
                        variant="filled"
                        color="green"
                        size="sm"
                        onClick={() => handleOpenUpdateDialog(expense)}
                      >
                        更新
                      </Button>
                      <Button
                        type="submit"
                        variant="filled"
                        color="green"
                        size="sm"
                        onClick={() => handleOpenDeleteDialog(expense)}
                      >
                        削除
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
      ) : (
        <span>データは存在しません。</span>
      )}
    </div>
  );
};
