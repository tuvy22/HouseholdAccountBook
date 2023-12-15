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
import { Typography } from "@/app/materialTailwindExports";
import { PasswordChange } from "./PasswordChange";
import { UserGroupOut } from "./UserGroupOut";
import { UserDelete } from "./UserDelete";

export const SETTING_OPEN = {
  USER_NAME_Update: "userNameUpdate",
  INIT_AMOUNT_CHANGE: "initAmountChange",
  PASSWORD_CHANGE: "passwordChange",
  GROUP_OUT: "groupOut",
  USER_DELETE: "userDelete",
  GROUP_USER_INVITATION: "groupUserInvitation",
  CATEGORY_CHANGE: "categoryChange",
};

export function Setting() {
  const searchParams = useSearchParams();
  const open = searchParams.get("open");
  const [openSetting, setOpenSetting] = useState(open ? open : "");

  const renderSetting = () => {
    switch (openSetting) {
      case SETTING_OPEN.USER_NAME_Update:
        return (
          <RightPage
            title="ニックネーム変更"
            message={"現在のニックネームを変更出来ます。"}
          >
            <UserName />
          </RightPage>
        );

      case SETTING_OPEN.PASSWORD_CHANGE:
        return (
          <RightPage
            title="パスワード変更"
            message={
              "変更前のパスワードと併せて新しいパスワードを入力してください。"
            }
          >
            <PasswordChange />
          </RightPage>
        );
      case SETTING_OPEN.GROUP_OUT:
        return (
          <RightPage
            title="グループからの脱退"
            message={[
              "現在所属しているグループから脱退します。",
              <br key="br-key" />,
              "※一人だけのグループから脱退することは出来ません。",
            ]}
          >
            <UserGroupOut />
          </RightPage>
        );
      case SETTING_OPEN.USER_DELETE:
        return (
          <RightPage
            title="退会"
            message={[
              "本システムから退会してアカウントを削除します。",
              <br key="br-key" />,
              "※収入・支出情報も全て削除され、取り消すことは出来ませんのでご注意ください。",
            ]}
          >
            <UserDelete />
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
      case SETTING_OPEN.INIT_AMOUNT_CHANGE:
        return (
          <RightPage
            title="初期残高設定"
            message={
              "初期残高設定を変更出来ます。変更するとダッシュボードの初期額が変更されます。"
            }
          >
            <InitialAmount />
          </RightPage>
        );
      case SETTING_OPEN.CATEGORY_CHANGE:
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
              <RightPage>
                <Typography>左のメニューから選択してください。</Typography>
              </RightPage>
            </div>
            <div className="md:hidden">
              <RightPage>
                <Typography>上のメニューを開いて選択してください。</Typography>
              </RightPage>
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
