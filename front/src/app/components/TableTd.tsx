import React from "react";

export default function TableTd({
  children,
  addTdClassName = "",
  boderBottom = "border-b border-blue-gray-50",
  rowSpan = 1,
  colSpan = 1,
}: {
  children: React.ReactNode;
  addTdClassName?: string;
  boderBottom?: string;
  rowSpan?: number;
  colSpan?: number;
}) {
  return (
    <td
      className={`${boderBottom}  p-2 md:p-4 ${addTdClassName}`}
      rowSpan={rowSpan}
      colSpan={colSpan}
    >
      {children}
    </td>
  );
}
