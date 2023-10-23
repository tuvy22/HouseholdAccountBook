import React from "react";
import { Alert, Button } from "@material-tailwind/react";
import { colors } from "@material-tailwind/react/types/generic";

export interface ColorAndValue {
  color: colors;
  value: string;
}

export function AlertCustom({
  colorAndValue,
}: {
  colorAndValue: ColorAndValue;
}) {
  const [open, setOpen] = React.useState(true);

  return (
    <>
      <Alert
        open={open}
        onClose={() => setOpen(false)}
        color={colorAndValue.color}
        animate={{
          mount: { y: 0 },
          unmount: { y: 100 },
        }}
      >
        {colorAndValue.value}
      </Alert>
    </>
  );
}
