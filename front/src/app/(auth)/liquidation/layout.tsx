import { LiquidationSearchFormProvider } from "@/app/context/LiquidationSearchFormProvider";

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
