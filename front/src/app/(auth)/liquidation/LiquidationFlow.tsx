import { Typography } from "@/app/materialTailwindExports";
import { formatNumberStringToYen, isMinus } from "@/app/util/util";
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
          variant="small"
          className={`border-b ${
            isMinus(amount) ? "border-red-500" : "border-blue-500"
          }`}
        >
          {registerUserName}
        </Typography>
        <div>{isMinus(amount) ? <ArrowForwardIcon /> : <ArrowBackIcon />}</div>
        <Typography
          variant="small"
          className={`border-b ${
            isMinus(amount) ? "border-blue-500" : "border-red-500"
          }`}
        >
          {targetUserName}
        </Typography>
        <div className="col-span-3">
          <Typography variant="small">
            {isMinus(amount)
              ? formatNumberStringToYen((-amount).toString())
              : formatNumberStringToYen(amount.toString())}
          </Typography>
        </div>
      </div>
    </>
  );
}
