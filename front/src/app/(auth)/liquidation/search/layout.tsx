import { getGroupAllUser } from "@/app/util/apiServer";
import UnavailablePage from "../UnavailablePage";
import { User } from "@/app/util/types";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>{process.env.APP_HOST && process.env.APP_HOST.length > 0 && children}</>
  );
}
