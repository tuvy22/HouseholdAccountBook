"use client";

import { UserName } from "./UserName";
import { Sidebar } from "./Sidebar";
import { useState } from "react";
import { UserInvite } from "./UserInvite";
import RightPage from "./RightPage";
import { InitialAmount } from "./InitialAmount";
import { useSearchParams } from "next/navigation";
import { Category } from "./Category";
import { SideDrawer } from "@/app/components/SideDrawer";

export const SETTING_OPEN = {
  USER_NAME: "userName",
  INIT_AMOUNT: "initAmount",
  PASSWORD_CHANGE: "passwordChange",
  OUT_GROUP: "outGroup",
  OUT_SERVICE: "outService",
  GROUP_USER_INVITATION: "groupUserInvitation",
  CATEGORY: "category",
};

export function Setting() {
  const searchParams = useSearchParams();
  const open = searchParams.get("open");
  const [openSetting, setOpenSetting] = useState(open ? open : "");

  const renderSetting = () => {
    switch (openSetting) {
      case SETTING_OPEN.USER_NAME:
        return (
          <RightPage title="ニックネーム変更">
            <UserName />
          </RightPage>
        );
      case SETTING_OPEN.INIT_AMOUNT:
        return (
          <RightPage title="初期残高設定">
            <InitialAmount />
          </RightPage>
        );
      case SETTING_OPEN.PASSWORD_CHANGE:
        return <RightPage>comming soon</RightPage>;
      case SETTING_OPEN.OUT_GROUP:
        return <RightPage>comming soon</RightPage>;
      case SETTING_OPEN.OUT_SERVICE:
        return <RightPage>comming soon</RightPage>;
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
      case SETTING_OPEN.CATEGORY:
        return (
          <RightPage
            title="カテゴリー変更"
            message={"収入・支出のカテゴリを設定できます。"}
          >
            <Category />
          </RightPage>
        );
      default:
        return (
          <>
            <div className="hidden md:block">
              <RightPage>左のメニューから選択してください。</RightPage>
            </div>
            <div className="md:hidden">
              <RightPage>上のメニューを開いて選択してください。</RightPage>
            </div>
          </>
        );
    }
  };

  return (
    <>
      <div className="md:hidden flex justify-start mb-3">
        <SideDrawer>
          <Sidebar setOpenSetting={setOpenSetting} />
        </SideDrawer>
      </div>

      <div className="flex-1 flex items-stretch gap-4">
        <div className="hidden md:flex ">
          <Sidebar setOpenSetting={setOpenSetting} />
        </div>
        <div className="flex-1">{renderSetting()}</div>
      </div>
    </>
  );
}
