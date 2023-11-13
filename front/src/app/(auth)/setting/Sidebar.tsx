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
import { Dispatch, SetStateAction, useState } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import GroupIcon from "@mui/icons-material/Group";
import BadgeIcon from "@mui/icons-material/Badge";
import CurrencyYenIcon from "@mui/icons-material/CurrencyYen";
import { SETTING_OPEN } from "./Setting";

export function Sidebar({
  setOpenSetting,
}: {
  setOpenSetting: Dispatch<SetStateAction<string>>;
}) {
  const [openGroup, setOpenGroup] = useState(false);
  const [openUser, setOpenUser] = useState(false);

  const handleOpenGroup = () => {
    setOpenGroup(!openGroup);
  };
  const handleOpenUser = () => {
    setOpenUser(!openUser);
  };
  const handleOpenMenu = (menu: string) => {
    setOpenSetting(menu);
  };
  return (
    <Card className="w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5">
      <div className="mb-2 p-4">
        <Typography variant="h5" color="blue-gray">
          設定メニュー
        </Typography>
      </div>
      <List>
        <Accordion
          open={openUser}
          icon={
            <KeyboardArrowUpIcon
              strokeWidth={2.5}
              className={`mx-auto h-4 w-4 transition-transform ${
                openUser ? "rotate-180" : ""
              }`}
            />
          }
        >
          <ListItem className="p-0" selected={openUser}>
            <AccordionHeader
              onClick={() => handleOpenUser()}
              className="border-b-0 p-3"
            >
              <ListItemPrefix>
                <GroupIcon className="h-5 w-5" />
              </ListItemPrefix>
              <Typography color="blue-gray" className="mr-auto font-normal">
                ユーザー設定
              </Typography>
            </AccordionHeader>
          </ListItem>
          <AccordionBody className="py-1">
            <List className="p-0">
              <ListItem onClick={() => handleOpenMenu(SETTING_OPEN.USER_NAME)}>
                <ListItemPrefix>
                  <KeyboardArrowRightIcon strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>
                ニックネーム変更
              </ListItem>
              <ListItem>
                <ListItemPrefix>
                  <KeyboardArrowRightIcon strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>
                パスワード変更
              </ListItem>
              <ListItem>
                <ListItemPrefix>
                  <KeyboardArrowRightIcon strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>
                グループからの脱退
              </ListItem>
              <ListItem>
                <ListItemPrefix>
                  <KeyboardArrowRightIcon strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>
                退会
              </ListItem>
            </List>
          </AccordionBody>
        </Accordion>
        <Accordion
          open={openGroup}
          icon={
            <KeyboardArrowUpIcon
              strokeWidth={2.5}
              className={`mx-auto h-4 w-4 transition-transform ${
                openGroup ? "rotate-180" : ""
              }`}
            />
          }
        >
          <ListItem className="p-0" selected={openGroup}>
            <AccordionHeader
              onClick={() => handleOpenGroup()}
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
              <ListItem
                onClick={() =>
                  handleOpenMenu(SETTING_OPEN.GROUP_USER_INVITATION)
                }
              >
                <ListItemPrefix>
                  <KeyboardArrowRightIcon strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>
                ユーザー招待
              </ListItem>
              <ListItem>
                <ListItemPrefix>
                  <KeyboardArrowRightIcon strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>
                ユーザーの一覧
              </ListItem>
            </List>
          </AccordionBody>
        </Accordion>
        <ListItem onClick={() => handleOpenMenu(SETTING_OPEN.INIT_AMOUNT)}>
          <ListItemPrefix>
            <CurrencyYenIcon className="h-5 w-5" />
          </ListItemPrefix>
          初期残高設定
        </ListItem>
      </List>
    </Card>
  );
}
