import { AlertValue } from "./AlertCustoms";
import { Alert } from "../materialTailwindExports";
import { useState } from "react";

export function AlertCustom({ colorAndValue }: { colorAndValue: AlertValue }) {
  const [open, setOpen] = useState(true);

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
