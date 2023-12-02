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
import RefreshIcon from "@mui/icons-material/Refresh";

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
      <div className="text-center mt-10">
        <RefreshIcon
          className="cursor-pointer hover:text-green-500 text-5xl"
          onClick={handleCreateInvite}
        />
      </div>
    </div>
  );
}
