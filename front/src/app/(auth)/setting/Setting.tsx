"use client";

import { UserName } from "./UserName";
import { Sidebar } from "./Sidebar";
import { useState } from "react";
import { UserInvite } from "./UserInvite";

export const SETTING_OPEN = {
  USER_NAME: "userName",
  GROUP_USER: "groupUser",
  GROUP_USER_INVITATION: "groupUserInvitation",
  INIT_AMOUNT: "initAmount",
};

export function Setting() {
  const [openSetting, setOpenSetting] = useState(SETTING_OPEN.USER_NAME);

  const renderSetting = () => {
    switch (openSetting) {
      case SETTING_OPEN.USER_NAME:
        return <UserName />;
      case SETTING_OPEN.GROUP_USER_INVITATION:
        return <UserInvite />;
      default:
        return <></>;
    }
  };

  return (
    <div className="flex-1 flex items-stretch gap-4">
      <Sidebar setOpenSetting={setOpenSetting} />
      <div className="flex-1">{renderSetting()}</div>
    </div>
  );
}
