import {
  Popover,
  PopoverHandler,
  PopoverContent,
} from "@material-tailwind/react";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";

export function MemoPopover({
  content,
}: {
  content: string;
  buttonText: string;
}) {
  return (
    <Popover
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0, y: 25 },
      }}
    >
      <PopoverHandler>
        <StickyNote2Icon className="cursor-pointer hover:text-green-500" />
      </PopoverHandler>
      <PopoverContent>{content}</PopoverContent>
    </Popover>
  );
}
