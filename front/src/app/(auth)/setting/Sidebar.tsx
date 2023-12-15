"use client";

import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@/app/materialTailwindExports";

import { Dispatch, SetStateAction, useState } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import GroupIcon from "@mui/icons-material/Group";
import Person from "@mui/icons-material/Person";
import CurrencyYenIcon from "@mui/icons-material/CurrencyYen";
import { SETTING_OPEN } from "./Setting";
import CategoryIcon from "@mui/icons-material/Category";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import LockResetIcon from "@mui/icons-material/LockReset";
import BadgeIcon from "@mui/icons-material/Badge";

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
    <Card
      className="w-full max-w-sm p-2 md:p-4 md:shadow-xl md:shadow-blue-gray-900/5"
      shadow={false}
    >
      <div className="mb-2 p-4">
        <Typography className="text-xl font-bold">設定メニュー</Typography>
      </div>
      <List>
        <Accordion
          open={openUser}
          icon={
            <KeyboardArrowUpIcon
              strokeWidth={2.5}
              className={`mx-auto w-4 transition-transform ${
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
                <Person />
              </ListItemPrefix>
              <Typography className="text-lg mr-auto">ユーザー設定</Typography>
            </AccordionHeader>
          </ListItem>
          <AccordionBody className="py-1">
            <List className="pl-2">
              <ListItem
                onClick={() => handleOpenMenu(SETTING_OPEN.USER_NAME_Update)}
              >
                <ListItemPrefix>
                  <BadgeIcon />
                </ListItemPrefix>
                <Typography className="h-3 text-base mr-auto">
                  ニックネーム変更
                </Typography>
              </ListItem>
              <ListItem
                onClick={() => handleOpenMenu(SETTING_OPEN.PASSWORD_CHANGE)}
              >
                <ListItemPrefix>
                  <LockResetIcon />
                </ListItemPrefix>
                <Typography className="h-3 text-base mr-auto">
                  パスワード変更
                </Typography>
              </ListItem>
              <ListItem onClick={() => handleOpenMenu(SETTING_OPEN.GROUP_OUT)}>
                <ListItemPrefix>
                  <PersonRemoveIcon />
                </ListItemPrefix>
                <Typography className="h-3 text-base mr-auto">
                  グループからの脱退
                </Typography>
              </ListItem>
              <ListItem
                onClick={() => handleOpenMenu(SETTING_OPEN.USER_DELETE)}
              >
                <ListItemPrefix>
                  <PersonOffIcon />
                </ListItemPrefix>
                <Typography className="h-3 text-base mr-auto">退会</Typography>
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
                <GroupIcon />
              </ListItemPrefix>
              <Typography className="text-lg mr-auto">グループ設定</Typography>
            </AccordionHeader>
          </ListItem>
          <AccordionBody className="py-1">
            <List className="pl-2">
              <ListItem
                onClick={() =>
                  handleOpenMenu(SETTING_OPEN.GROUP_USER_INVITATION)
                }
              >
                <ListItemPrefix>
                  <PersonAddAlt1Icon />
                </ListItemPrefix>
                <Typography className="h-3 text-base mr-auto">
                  ユーザー招待
                </Typography>
              </ListItem>
              <ListItem
                onClick={() => handleOpenMenu(SETTING_OPEN.INIT_AMOUNT_CHANGE)}
              >
                <ListItemPrefix>
                  <CurrencyYenIcon />
                </ListItemPrefix>
                <Typography className="h-3 text-base mr-auto">
                  初期残高設定
                </Typography>
              </ListItem>
              <ListItem
                onClick={() => handleOpenMenu(SETTING_OPEN.CATEGORY_CHANGE)}
              >
                <ListItemPrefix>
                  <CategoryIcon />
                </ListItemPrefix>
                <Typography className="h-3 text-base mr-auto">
                  カテゴリ変更
                </Typography>
              </ListItem>
            </List>
          </AccordionBody>
        </Accordion>
      </List>
    </Card>
  );
}
