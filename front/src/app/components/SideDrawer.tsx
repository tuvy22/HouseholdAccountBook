import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Drawer, Button } from "../materialTailwindExports";
import ViewSidebarIcon from "@mui/icons-material/ViewSidebar";

export function SideDrawer({
  children,
  openSetting,
}: {
  children: React.ReactNode;
  openSetting: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [openSetting]);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="filled"
        color="green"
        size="lg"
        className="w-full"
      >
        <span className="flex items-center justify-center gap-2">
          <ViewSidebarIcon /> 設定メニューを開く
        </span>
      </Button>
      <div>
        {/* オーバーレイ */}
        <div
          className={`fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm z-40 ${
            open ? "block" : "hidden"
          }`}
          onClick={() => setOpen(false)}
        />

        {/* Drawerコンポーネント */}
        <Drawer open={open} onClose={() => setOpen(false)} overlay={false}>
          {children}
        </Drawer>
      </div>
    </>
  );
}
