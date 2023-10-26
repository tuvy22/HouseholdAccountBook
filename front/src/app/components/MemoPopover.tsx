import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import {
  Popover,
  PopoverContent,
  PopoverHandler,
} from "../materialTailwindExports";

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
