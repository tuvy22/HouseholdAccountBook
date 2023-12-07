import React from "react";
import { Typography } from "../materialTailwindExports";

export default function TableTypography({
  children,
  addTypographyClassName = "",
}: {
  children: React.ReactNode;
  addTypographyClassName?: string;
}) {
  return (
    <Typography
      variant="small"
      color="blue-gray"
      className={`font-normal ${addTypographyClassName}`}
    >
      {children}
    </Typography>
  );
}
