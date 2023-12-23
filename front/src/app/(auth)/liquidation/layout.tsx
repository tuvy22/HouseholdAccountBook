import { LiquidationSearchFormProvider } from "@/app/context/LiquidationSearchFormProvider";
import { getGroupAllUser } from "@/app/util/apiServer";
import UnavailablePage from "./UnavailablePage";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const groupUsers = await getGroupAllUser();
  return (
    <>
      <LiquidationSearchFormProvider>
        {groupUsers && groupUsers.length > 1 ? children : <UnavailablePage />}
        {children}
      </LiquidationSearchFormProvider>
    </>
  );
}
