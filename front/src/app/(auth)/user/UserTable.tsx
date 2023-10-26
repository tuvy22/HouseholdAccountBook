"use client";

import { Card, Spinner, Typography } from "@/app/materialTailwindExports";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { DeleteConfirmDialog } from "@/app/components/DeleteConfirmDialog";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useUser } from "@/app/context/UserProvider";
import React from "react";
import { User } from "@/app/util/types";
import { UpdateUserDialog } from "./UpdateUserDialog";

const TABLE_HEAD = ["ID", "名前", ""];

export const UserTable = ({ fetchData }: { fetchData: User[] }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [Error, setError] = useState("");
  const router = useRouter();
  const user = useUser().user;

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deletedUser, setSelectedUser] = useState<User | null>(null);

  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [updatedUser, setUpdatedUser] = useState<User | null>(null);

  const handleOpenUpdateDialog = (user: User) => {
    setUpdatedUser(user);
    setOpenUpdateDialog(true);
  };

  const handleUpdate = async (updatedUser: User) => {
    if (updatedUser) {
      setIsLoading(true);

      try {
        const response = await fetch(`/api/private/user/${updatedUser.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser),
        });

        setError("");
      } catch (error) {
        setError("更新に失敗しました。");
      } finally {
        setIsLoading(false);
      }
      setOpenDeleteDialog(false);
      setSelectedUser(null);
      //リフレッシュ
      router.refresh();
    }
  };

  const handleOpenDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setOpenDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (deletedUser) {
      setIsLoading(true);
      try {
        await axios.delete(`/api/private/user/${deletedUser.id}`);
        setError("");
      } catch (error) {
        setError("削除に失敗しました。");
      } finally {
        setIsLoading(false);
      }
      setOpenDeleteDialog(false);
      setSelectedUser(null);
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
              {fetchData.map((user: User, index) => (
                <tr key={index} className="break-all">
                  <td className="p-2 md:p-4 border-b border-blue-gray-50">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {user.id}
                    </Typography>
                  </td>
                  <td className="p-2 md:p-4 border-b border-blue-gray-50">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {user.name}
                    </Typography>
                  </td>

                  <td className="p-2 md:p-4 border-b border-blue-gray-50">
                    <div className="flex flex-col flex-wrap justify-center gap-3 md:flex-row">
                      <ModeEditIcon
                        className="cursor-pointer hover:text-green-500"
                        onClick={() => handleOpenUpdateDialog(user)}
                      />
                      <DeleteIcon
                        className="cursor-pointer hover:text-green-500"
                        onClick={() => handleOpenDeleteDialog(user)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <span>データは存在しません。</span>
        )}
      </Card>
      {updatedUser && (
        <UpdateUserDialog
          open={openUpdateDialog}
          handleOpen={() => setOpenUpdateDialog(!openUpdateDialog)}
          updatedUser={updatedUser}
          handleUpdate={handleUpdate}
        />
      )}
      {deletedUser && (
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
