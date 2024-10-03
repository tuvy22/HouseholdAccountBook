"use client";

import { Receipt } from "../util/types";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { addError, useAlert } from "../context/AlertProvider";
import { postOcrImageReceipt } from "../util/apiClient";
import FilterCenterFocusIcon from "@mui/icons-material/FilterCenterFocus";
import { Typography } from "@material-tailwind/react";

export default function ReceiptOcr({
  setReceipt,
}: {
  setReceipt: Dispatch<SetStateAction<Receipt | undefined>>;
}) {
  const alert = useAlert();

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      await handleSubmit(selectedFile);
    }
  };

  const handleSubmit = async (selectedFile: File) => {
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const receipt = await postOcrImageReceipt(formData);
      setReceipt(receipt);
    } catch (error) {
      if (error instanceof Error) {
        addError(error.message, alert);
      }
    }
  };

  return (
    <form>
      <div className="flex gap-2 items-center">
        <label htmlFor="file-upload">
          <FilterCenterFocusIcon
            className="cursor-pointer hover:transform hover:scale-125 transition-transform duration-300"
            fontSize="large"
          />
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <label htmlFor="file-upload">
          <Typography variant="small" className="cursor-pointer">
            レシート読み取り
          </Typography>
        </label>
      </div>
    </form>
  );
}
