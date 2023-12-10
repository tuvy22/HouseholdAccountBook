import { Typography } from "../../materialTailwindExports";

export default function TableTypography({
  children,
  addTypographyClassName = "",
}: {
  children: React.ReactNode;
  addTypographyClassName?: string;
}) {
  return (
    <Typography variant="small" className={`${addTypographyClassName}`}>
      {children}
    </Typography>
  );
}
