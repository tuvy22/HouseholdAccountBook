import { Typography } from "../../materialTailwindExports";

export default function TableThTypography({
  children,
  addClassName = "",
  boderBottom = "border-b border-blue-gray-100",
  rowSpan = 1,
  colSpan = 1,
}: {
  children: React.ReactNode;
  addClassName?: string;
  boderBottom?: string;
  rowSpan?: number;
  colSpan?: number;
}) {
  return (
    <th
      className={`${boderBottom} bg-blue-gray-50  p-2 md:p-4 ${addClassName}`}
      rowSpan={rowSpan}
      colSpan={colSpan}
    >
      <Typography variant="small" className="opacity-70">
        {children}
      </Typography>
    </th>
  );
}
