import React from "react";
import { Alert, Button } from "@material-tailwind/react";
import { colors } from "@material-tailwind/react/types/generic";

export function AlertAnimate({
  color,
  value,
}: {
  color: colors;
  value: string;
}) {
  const [open, setOpen] = React.useState(true);

  return (
    <>
      <Alert
        open={open}
        onClose={() => setOpen(false)}
        color={color}
        animate={{
          mount: { y: 0 },
          unmount: { y: 100 },
        }}
      >
        {value}
      </Alert>
    </>
  );
}
