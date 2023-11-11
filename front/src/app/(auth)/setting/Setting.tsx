"use client";

import { UserName } from "./UserName";
import { Sidebar } from "./Sidebar";
import { useState } from "react";
import { UserInvite } from "./UserInvite";
import RightPage from "./RightPage";

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
        return (
          <RightPage title="ニックネーム変更">
            <UserName />
          </RightPage>
        );
      case SETTING_OPEN.GROUP_USER_INVITATION:
        return (
          <RightPage
            title="ユーザー招待"
            message={[
              "本グループに招待するためのURLを生成します。招待させたい人に共有してください。",
              <br key="br-key" />,
              "※URLは30分間のみ有効です。",
            ]}
          >
            <UserInvite />
          </RightPage>
        );
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
