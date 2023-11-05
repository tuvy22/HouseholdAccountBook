"use client";

import { UserName } from "./UserName";
import { Sidebar } from "./Sidebar";
import { useState } from "react";

export const SETTING_OPEN = {
  USER_NAME: "userName",
  GROUP_USER: "groupUser",
  GROUP_USER_ADD: "groupUserAdd",
  INIT_AMOUNT: "initAmount",
};

export function Setting() {
  const [openSetting, setOpenSetting] = useState(SETTING_OPEN.USER_NAME);

  return (
    <div className="flex-1 flex items-stretch gap-4">
      <Sidebar setOpenSetting={setOpenSetting} />
      <div className="flex-1">
        {openSetting === SETTING_OPEN.USER_NAME && <UserName />}
      </div>
    </div>
  );
}
