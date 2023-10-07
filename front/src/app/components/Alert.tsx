import React from "react";
import { Alert, Button } from "@material-tailwind/react";

export function AlertAnimate() {
  const [open, setOpen] = React.useState(true);

  return (
    <>
      <Alert
        open={open}
        onClose={() => setOpen(false)}
        color="green"
        animate={{
          mount: { y: 0 },
          unmount: { y: 100 },
        }}
      >
        登録が完了しました。
      </Alert>
    </>
  );
}
