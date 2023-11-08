"use client";

import {
  Button,
  Card,
  CardBody,
  Typography,
} from "@/app/materialTailwindExports";

import { useEffect, useState } from "react";

import { getUserInviteUrl } from "@/app/util/api";
import { useUser } from "@/app/context/UserProvider";
import { useAlert } from "@/app/context/AlertProvider";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

export function UserInvite() {
  const [error] = useState("");
  const [url, setUrl] = useState("");
  const user = useUser();
  const alert = useAlert();

  const copyToClipboard = async () => {
    if ("clipboard" in navigator) {
      await navigator.clipboard.writeText(url);
    }
  };

  const fetchUserInviteUrl = async () => {
    setUrl(await getUserInviteUrl());
  };

  const handleCreateInvite = () => {
    fetchUserInviteUrl();
  };
  useEffect(() => {
    fetchUserInviteUrl();
  }, []);

  return (
    <Card className="p-10 flex items-center justify-center">
      <Typography variant="h4" color="blue-gray">
        ユーザー招待
      </Typography>
      <Typography color="gray" className="mt-1 font-normal">
        本グループに招待するためのURLを生成します。招待させたい人に共有してください。
        <br />
        ※URLは生成後30分間のみ有効です。
      </Typography>
      <CardBody>
        <div className="flex flex-col items-center justify-center">
          <Typography color="gray" className="font-normal break-all">
            {url}
            <ContentCopyIcon
              onClick={copyToClipboard}
              className="ml-4 cursor-pointer hover:text-green-500"
            />
          </Typography>
          <div className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
            <Button
              type="submit"
              variant="filled"
              color="green"
              size="lg"
              className="mt-6"
              fullWidth
              onClick={handleCreateInvite}
            >
              再生成
            </Button>
          </div>
        </div>

        {error && <div className="text-red-500 text-center mt-4">{error}</div>}
      </CardBody>
    </Card>
  );
}
