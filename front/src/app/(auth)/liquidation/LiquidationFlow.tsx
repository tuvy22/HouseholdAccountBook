import { Typography } from "@/app/materialTailwindExports";
import { isMinus } from "@/app/util/util";
import React from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function LiquidationFlow({
  registerUserName,
  targetUserName,
  amount,
}: {
  registerUserName: string;
  targetUserName: string;
  amount: number;
}) {
  return (
    <>
      <div className="grid grid-cols-[2fr_1fr_2fr] grid-rows[auto_auto] gap-3 justify-center items-center text-center">
        <Typography
          color="gray"
          variant="small"
          className={`border-b ${
            isMinus(amount) ? "border-red-500" : "border-blue-500"
          }`}
        >
          {registerUserName}
        </Typography>
        <div>{isMinus(amount) ? <ArrowForwardIcon /> : <ArrowBackIcon />}</div>
        <Typography
          color="gray"
          variant="small"
          className={`border-b ${
            isMinus(amount) ? "border-blue-500" : "border-red-500"
          }`}
        >
          {targetUserName}
        </Typography>
        <div className="col-span-3">
          <Typography color="gray" variant="small">
            {`${isMinus(amount) ? -amount : amount}円`}
          </Typography>
        </div>
      </div>
    </>
  );
}
