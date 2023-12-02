"use client";

import { Button } from "@/app/materialTailwindExports";
import { color } from "@material-tailwind/react/types/components/button";

export default function SubmitButtonForm({
  buttonName,
  buttonColor,
}: {
  buttonName: string;
  buttonColor: color;
}) {
  return (
    <div className="flex justify-end">
      <Button
        type="submit"
        variant="filled"
        color={buttonColor}
        size="lg"
        className="mt-4 w-full md:w-28"
      >
        {buttonName}
      </Button>
    </div>
  );
}
