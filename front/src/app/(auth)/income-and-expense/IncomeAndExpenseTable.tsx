"use client";

import { MemoPopover } from "@/app/components/MemoPopover";
import { IncomeAndExpense } from "@/app/util/types";
import { Card, Spinner, Typography } from "@material-tailwind/react";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { DeleteConfirmDialog } from "@/app/components/DeleteConfirmDialog";
import { UpdateExpenseDialog } from "@/app/(auth)/income-and-expense/UpdateExpenseDialog";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useUser } from "@/app/context/UserProvider";
import { getToday, isMinus } from "@/app/util/util";
import React from "react";
import { deleteIncomeAndExpense, putIncomeAndExpense } from "@/app/util/api";

const TABLE_HEAD = ["登録", "区分", "金額", "メモ", ""];

export const IncomeAndExpenseTable = ({
  fetchData,
}: {
  fetchData: IncomeAndExpense[];
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const user = useUser().user;

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deletedIncomeAndExpense, setDeletedIncomeAndExpense] =
    useState<IncomeAndExpense | null>(null);

  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [updatedIncomeAndExpense, setUpdatedIncomeAndExpense] =
    useState<IncomeAndExpense | null>(null);

  const handleOpenUpdateDialog = (incomeAndExpense: IncomeAndExpense) => {
    setUpdatedIncomeAndExpense(incomeAndExpense);
    setOpenUpdateDialog(true);
  };

  const handleUpdate = async (updatedIncomeAndExpense: IncomeAndExpense) => {
    if (updatedIncomeAndExpense) {
      setIsLoading(true);
      await putIncomeAndExpense(updatedIncomeAndExpense);
      setIsLoading(false);
      setOpenDeleteDialog(false);
      setDeletedIncomeAndExpense(null);

      //リフレッシュ
      router.refresh();
    }
  };

  const handleOpenDeleteDialog = (incomeAndExpense: IncomeAndExpense) => {
    setDeletedIncomeAndExpense(incomeAndExpense);
    setOpenDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (deletedIncomeAndExpense) {
      setIsLoading(true);
      await deleteIncomeAndExpense(deletedIncomeAndExpense.id);
      setIsLoading(false);
      setOpenDeleteDialog(false);
      setDeletedIncomeAndExpense(null);

      //リフレッシュ
      router.refresh();
    }
  };

  let previousDate = "";

  return (
    <>
      {fetchData.length > 0 ? (
        <Card className="h-full w-full mt-6">
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
              {fetchData.map((incomeAndExpense: IncomeAndExpense, index) => (
                <React.Fragment key={index}>
                  {incomeAndExpense.date !== previousDate && (
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
                            {incomeAndExpense.date}
                          </Typography>
                        </td>
                      </tr>
                    </>
                  )}

                  {(() => {
                    if (incomeAndExpense.date !== previousDate) {
                      previousDate = incomeAndExpense.date;
                    }

                    return (
                      <tr key={index} className="break-all">
                        <td className="p-2 md:p-4 border-b border-blue-gray-50">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {incomeAndExpense.registerUserId}
                          </Typography>
                        </td>
                        <td className="p-2 md:p-4 border-b border-blue-gray-50">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {incomeAndExpense.category}
                          </Typography>
                        </td>
                        <td
                          className={`p-2 md:p-4 border-b border-blue-gray-50 ${
                            isMinus(incomeAndExpense.amount)
                              ? "text-red-500"
                              : "text-blue-500"
                          }`}
                        >
                          <Typography variant="small" className="font-normal">
                            {incomeAndExpense.amount.toLocaleString()}
                          </Typography>
                        </td>
                        <td className="p-2 md:p-4 border-b border-blue-gray-50">
                          <div className="hidden md:block">
                            {/* デスクトップサイズでの  表示 */}
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {incomeAndExpense.memo}
                            </Typography>
                          </div>
                          <div className="md:hidden">
                            {/* スマホサイズでの表示 */}
                            {incomeAndExpense.memo.length >= 10 ? (
                              <MemoPopover
                                content={incomeAndExpense.memo}
                                buttonText="表示"
                              />
                            ) : (
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {incomeAndExpense.memo}
                              </Typography>
                            )}
                          </div>
                        </td>
                        <td className="p-2 md:p-4 border-b border-blue-gray-50">
                          {user.id !== null ? (
                            user.id === incomeAndExpense.registerUserId && (
                              <div className="flex flex-col flex-wrap justify-end gap-3 md:flex-row">
                                <ModeEditIcon
                                  className="cursor-pointer hover:text-green-500"
                                  onClick={() =>
                                    handleOpenUpdateDialog(incomeAndExpense)
                                  }
                                />
                                <DeleteForeverIcon
                                  className="cursor-pointer hover:text-red-500"
                                  onClick={() =>
                                    handleOpenDeleteDialog(incomeAndExpense)
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
        </Card>
      ) : (
        <div className="text-center">データは存在しません。</div>
      )}
      {updatedIncomeAndExpense && (
        <UpdateExpenseDialog
          open={openUpdateDialog}
          handleOpen={() => setOpenUpdateDialog(!openUpdateDialog)}
          updatedIncomeAndExpense={updatedIncomeAndExpense}
          handleUpdate={handleUpdate}
        />
      )}
      {deletedIncomeAndExpense && (
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
