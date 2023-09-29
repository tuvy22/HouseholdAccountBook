import {
  Popover,
  PopoverHandler,
  PopoverContent,
  Button,
} from "@material-tailwind/react";
 
export function PopoverAnimation({
  content,
  buttonText,
}: {
  content: string;
  buttonText: string;
}){
  return (
    <Popover
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0, y: 25 },
      }}
    >
      <PopoverHandler>
      <Button type="submit" variant="filled" color="green" size="sm">
        {buttonText}
      </Button>
      </PopoverHandler>
      <PopoverContent>
        {content}
      </PopoverContent>
    </Popover>
  );
}