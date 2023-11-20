"use client";

import { Button } from "@/app/materialTailwindExports";

export default function SubmitButtonForm({
  buttonName,
}: {
  buttonName: string;
}) {
  return (
    <Button
      type="submit"
      variant="filled"
      color="green"
      size="lg"
      className="mt-4 w-full md:w-28"
    >
      {buttonName}
    </Button>
  );
}
