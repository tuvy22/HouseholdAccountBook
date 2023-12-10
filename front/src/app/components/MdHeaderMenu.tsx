import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
  Typography,
  Card,
} from "../materialTailwindExports";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import LogoutIcon from "@mui/icons-material/Logout";

import MenuIcon from "@mui/icons-material/Menu";
import HeaderUser from "./HeaderUser";
import Link from "next/link";
import BuildIcon from "@mui/icons-material/Build";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import LineAxisIcon from "@mui/icons-material/LineAxis";

export function MdHeaderMenu({
  handleLogout,
}: {
  handleLogout: (e: React.FormEvent) => Promise<void>;
}) {
  return (
    <Menu allowHover>
      <MenuHandler>
        <MenuIcon fontSize="large" />
      </MenuHandler>
      <MenuList>
        <MenuItem className="border-b">
          <HeaderUser />
        </MenuItem>
        <MenuItem>
          <Link href="/income-and-expense" className="flex justify-start gap-3">
            <MenuBookIcon />
            <Typography variant="h2" className="text-xl">
              入力
            </Typography>
          </Link>
        </MenuItem>
        <MenuItem>
          <Link href="/liquidation" className="flex justify-start gap-3">
            <AccountBalanceWalletIcon />
            <Typography variant="h2" className="text-xl">
              清算
            </Typography>
          </Link>
        </MenuItem>
        <MenuItem>
          <Link href="/dashboard" className="flex justify-start gap-3">
            <LineAxisIcon />
            <Typography variant="h2" className="text-xl">
              ダッシュボード
            </Typography>
          </Link>
        </MenuItem>
        <MenuItem>
          <Link href="/setting" className="flex justify-start gap-3">
            <BuildIcon />
            <Typography variant="h2" className="text-xl">
              設定
            </Typography>
          </Link>
        </MenuItem>
        <MenuItem>
          <div className="flex justify-start gap-3" onClick={handleLogout}>
            <LogoutIcon />
            <Typography variant="h2" className="text-xl">
              ログアウト
            </Typography>
          </div>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
