"use client";

import PreAuthHeader from "./components/PreAuthHeader";

export default function NotFound() {
  return (
    <>
      <PreAuthHeader isButtonDispay={false} />
      <div className="flex-1 flex justify-center items-center font-bold">
        存在しないリンクです。
      </div>
    </>
  );
}
