"use client";

import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@/app/materialTailwindExports";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { useState } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import GroupIcon from "@mui/icons-material/Group";
import BadgeIcon from "@mui/icons-material/Badge";
import CurrencyYenIcon from "@mui/icons-material/CurrencyYen";

export function Sidebar() {
  const [open, setOpen] = useState(0);

  const handleOpen = (value: number) => {
    setOpen(open === value ? 0 : value);
  };
  return (
    <Card className="w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5">
      <div className="mb-2 p-4">
        <Typography variant="h5" color="blue-gray">
          設定メニュー
        </Typography>
      </div>
      <List>
        <ListItem>
          <ListItemPrefix>
            <BadgeIcon className="h-5 w-5" />
          </ListItemPrefix>
          ニックネーム変更
        </ListItem>
        <Accordion
          open={open === 1}
          icon={
            <KeyboardArrowUpIcon
              strokeWidth={2.5}
              className={`mx-auto h-4 w-4 transition-transform ${
                open === 1 ? "rotate-180" : ""
              }`}
            />
          }
        >
          <ListItem className="p-0" selected={open === 1}>
            <AccordionHeader
              onClick={() => handleOpen(1)}
              className="border-b-0 p-3"
            >
              <ListItemPrefix>
                <GroupIcon className="h-5 w-5" />
              </ListItemPrefix>
              <Typography color="blue-gray" className="mr-auto font-normal">
                グループ設定
              </Typography>
            </AccordionHeader>
          </ListItem>
          <AccordionBody className="py-1">
            <List className="p-0">
              <ListItem>
                <ListItemPrefix>
                  <KeyboardArrowRightIcon strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>
                ユーザー確認
              </ListItem>
              <ListItem>
                <ListItemPrefix>
                  <KeyboardArrowRightIcon strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>
                ユーザー招待
              </ListItem>
            </List>
          </AccordionBody>
        </Accordion>
        <ListItem>
          <ListItemPrefix>
            <CurrencyYenIcon className="h-5 w-5" />
          </ListItemPrefix>
          初期残高設定
        </ListItem>
      </List>
    </Card>
  );
}
