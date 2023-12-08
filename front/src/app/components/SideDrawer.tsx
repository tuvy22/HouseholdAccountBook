import React from "react";
import { Drawer, Button } from "../materialTailwindExports";
import ViewSidebarIcon from "@mui/icons-material/ViewSidebar";

export function SideDrawer({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);

  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  return (
    <>
      <Button
        onClick={openDrawer}
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
          onClick={closeDrawer}
        />

        {/* Drawerコンポーネント */}
        <Drawer open={open} onClose={closeDrawer} overlay={false}>
          {children}
        </Drawer>
      </div>
    </>
  );
}
