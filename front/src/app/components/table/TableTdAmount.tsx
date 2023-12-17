import { Typography } from "../../materialTailwindExports";
import TableTd from "./TableTd";
import { text } from "stream/consumers";
import { formatNumberStringToYen, isMinus } from "../../util/util";
import TableTypography from "./TableTypography";

export default function TableTdAmount({ amount }: { amount: number }) {
  const text = isMinus(amount) ? "text-red-500" : "text-blue-500";
  return (
    <TableTd addTdClassName={text}>
      <Typography variant="small">
        {formatNumberStringToYen(amount.toString())}
      </Typography>
    </TableTd>
  );
}
