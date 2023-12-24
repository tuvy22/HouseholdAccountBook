import { LiquidationSearchFormProvider } from "@/app/context/LiquidationSearchFormProvider";
import { getGroupAllUser } from "@/app/util/apiServer";
import UnavailablePage from "./UnavailablePage";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LiquidationSearchFormProvider>{children}</LiquidationSearchFormProvider>
    </>
  );
}
