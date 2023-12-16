"use client";

import Link from "next/link";
import { SETTING_OPEN } from "../setting/Setting";

export default function UnavailablePage() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center font-bold">
      <div>一人だけのグループの場合、本機能はご利用できません。</div>
      <div>
        <Link
          href={`/setting?open=${SETTING_OPEN.GROUP_USER_INVITATION}`}
          className="text-blue-600 underline hover:no-underline"
        >
          グループへの招待はこちらから
        </Link>
      </div>
    </div>
  );
}
