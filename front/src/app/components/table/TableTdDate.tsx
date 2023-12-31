import { Typography } from "../../materialTailwindExports";
import TableTd from "./TableTd";

export default function TableTdDate({
  children,
  colSpan = 1,
}: {
  children: React.ReactNode;
  colSpan?: number;
}) {
  return (
    <TableTd addTdClassName="whitespace-nowrap text-center" colSpan={colSpan}>
      <Typography variant="small" className="text-green-700">
        {children}
      </Typography>
    </TableTd>
  );
}
