import React from "react";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";

export default function TableThCheckBox({
  rowSpan = 1,
  allCheckBox,
  handleAllCheckBoxChange,
}: {
  rowSpan?: number;
  allCheckBox: boolean;
  handleAllCheckBoxChange: (check: boolean) => void;
}) {
  return (
    <th
      className={`border-b border-blue-gray-100 bg-blue-gray-50 w-10 text-center p-2 md:p-4`}
      rowSpan={rowSpan}
    >
      {allCheckBox ? (
        <CheckBoxIcon
          className="cursor-pointer hover:text-green-500"
          onClick={() => handleAllCheckBoxChange(!allCheckBox)}
        />
      ) : (
        <CheckBoxOutlineBlankIcon
          className="cursor-pointer hover:text-green-500"
          onClick={() => handleAllCheckBoxChange(!allCheckBox)}
        />
      )}
    </th>
  );
}
