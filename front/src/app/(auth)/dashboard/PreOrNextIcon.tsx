import { IconButton } from "@/app/materialTailwindExports";
import React from "react";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

export default function PreOrNextIcon({
  isPreIcon,
  morePreOrNext,
  clickFn,
}: {
  isPreIcon: boolean;
  morePreOrNext: boolean;
  clickFn: () => void;
}) {
  return (
    <IconButton
      size="sm"
      variant="outlined"
      onClick={clickFn}
      disabled={!morePreOrNext}
      className={!morePreOrNext ? "text-gray-500 border-gray-500" : ""}
    >
      {isPreIcon ? (
        <NavigateBeforeIcon strokeWidth={2} className="h-4 w-4" />
      ) : (
        <NavigateNextIcon strokeWidth={2} className="h-4 w-4" />
      )}
    </IconButton>
  );
}
