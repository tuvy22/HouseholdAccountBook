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
                <Person />
              </ListItemPrefix>
              <Typography color="blue-gray" className="mr-auto font-normal">
                ユーザー設定
              </Typography>
            </AccordionHeader>
          </ListItem>
          <AccordionBody className="py-1">
            <List className="pl-2">
              <ListItem onClick={() => handleOpenMenu(SETTING_OPEN.USER_NAME)}>
                <ListItemPrefix>
                  <BadgeIcon />
                </ListItemPrefix>
                ニックネーム変更
              </ListItem>
              <ListItem
                onClick={() => handleOpenMenu(SETTING_OPEN.INIT_AMOUNT)}
              >
                <ListItemPrefix>
                  <CurrencyYenIcon />
                </ListItemPrefix>
                初期残高設定
              </ListItem>
              <ListItem
                onClick={() => handleOpenMenu(SETTING_OPEN.PASSWORD_CHANGE)}
              >
                <ListItemPrefix>
                  <LockResetIcon />
                </ListItemPrefix>
                パスワード変更
              </ListItem>
              <ListItem onClick={() => handleOpenMenu(SETTING_OPEN.OUT_GROUP)}>
                <ListItemPrefix>
                  <PersonRemoveIcon />
                </ListItemPrefix>
                グループからの脱退
              </ListItem>
              <ListItem
                onClick={() => handleOpenMenu(SETTING_OPEN.OUT_SERVICE)}
              >
                <ListItemPrefix>
                  <PersonOffIcon />
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
                <GroupIcon />
              </ListItemPrefix>
              <Typography color="blue-gray" className="mr-auto font-normal">
                グループ設定
              </Typography>
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
                ユーザー招待
              </ListItem>
              <ListItem onClick={() => handleOpenMenu(SETTING_OPEN.CATEGORY)}>
                <ListItemPrefix>
                  <CategoryIcon />
                </ListItemPrefix>
                カテゴリ変更
              </ListItem>
            </List>
          </AccordionBody>
        </Accordion>
      </List>
    </Card>
  );
}
