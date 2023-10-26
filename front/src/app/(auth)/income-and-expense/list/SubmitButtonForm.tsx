"use client";

import { Button } from "@/app/materialTailwindExports";

export default function SubmitButtonForm() {
  return (
    <Button
      type="submit"
      variant="filled"
      color="green"
      size="lg"
      className="mt-4 w-full md:w-auto"
    >
      登録
    </Button>
  );
}
