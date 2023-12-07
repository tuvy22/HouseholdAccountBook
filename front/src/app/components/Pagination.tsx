"use client";

import React from "react";
import { Button, IconButton } from "@material-tailwind/react";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

export function Pagination({
  active,
  setActive,
  maxPage,
}: {
  active: number;
  setActive: React.Dispatch<React.SetStateAction<number>>;
  maxPage: number;
}) {
  //ページ範囲計算
  let displayMinPage = active;
  let displayMaxPage = active;
  for (let i = 0; ; i++) {
    if (active - i >= 1) {
      displayMinPage = active - i;
    }
    if (active + i <= maxPage) {
      displayMaxPage = active + i;
    }
    if (displayMaxPage - displayMinPage >= 4 || i === 4) {
      break;
    }
  }
  if (displayMinPage === displayMaxPage) {
    return;
  }

  const getItemProps = (index: number) =>
    ({
      variant: active === index ? "filled" : "text",
      color: "gray",
      className: active === index ? "bg-gray-800" : "",
      onClick: () => setActive(index),
    } as any);

  const next = () => {
    if (active === maxPage) return;

    setActive(active + 1);
  };

  const prev = () => {
    if (active === 1) return;

    setActive(active - 1);
  };
  const iconButtons = [];
  for (let i = displayMinPage; i <= displayMaxPage; i++) {
    iconButtons.push(
      <IconButton {...getItemProps(i)} key={i}>
        {i}
      </IconButton>
    );
  }

  return (
    <div className="flex items-center gap-4 mx-auto">
      <Button
        variant="text"
        color="gray"
        className="flex items-center gap-2"
        onClick={prev}
        disabled={active === 1}
      >
        <NavigateBeforeIcon />
        前へ
      </Button>
      <div className="hidden md:flex items-center gap-2">{iconButtons}</div>
      <Button
        variant="text"
        color="gray"
        className="flex items-center gap-2"
        onClick={next}
        disabled={active === maxPage}
      >
        次へ
        <NavigateNextIcon />
      </Button>
    </div>
  );
}
