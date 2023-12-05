"use client";

import {
  Button,
  Card,
  CardBody,
  Spinner,
  Typography,
} from "@/app/materialTailwindExports";

import { useEffect, useState } from "react";

import { getUserInviteUrl } from "@/app/util/apiClient";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import RefreshIcon from "@mui/icons-material/Refresh";
import { addError, useAlert } from "@/app/context/AlertProvider";

export function UserInvite() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const alert = useAlert();

  const copyToClipboard = async () => {
    if ("clipboard" in navigator) {
      await navigator.clipboard.writeText(url);
    }
  };

  const fetchUserInviteUrl = async () => {
    setLoading(true);
    try {
      setUrl(await getUserInviteUrl());
    } catch (error) {
      if (error instanceof Error) {
        addError(error.message, alert);
      }
    }
    setLoading(false);
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
        {loading ? (
          <Spinner className="m-auto" />
        ) : (
          <RefreshIcon
            className="cursor-pointer hover:text-green-500"
            fontSize="large"
            onClick={handleCreateInvite}
          />
        )}
      </div>
    </div>
  );
}
