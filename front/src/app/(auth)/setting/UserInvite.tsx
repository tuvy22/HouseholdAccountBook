"use client";

import {
  Button,
  Card,
  CardBody,
  Typography,
} from "@/app/materialTailwindExports";

import { useEffect, useState } from "react";

import { getUserInviteUrl } from "@/app/util/apiClient";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

export function UserInvite() {
  const [url, setUrl] = useState("");

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
  );
}
