"use client";
import PreAuthHeader from "./components/PreAuthHeader";

export default function Error() {
  return (
    <>
      <PreAuthHeader isButtonDispay={false} />
      <div className="flex-1 flex justify-center items-center font-bold">
        想定外のエラーが発生しました。
      </div>
    </>
  );
}
