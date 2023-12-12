import { LiquidationSearchFormProvider } from "@/app/context/LiquidationSearchFormProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LiquidationSearchFormProvider>{children}</LiquidationSearchFormProvider>
    </>
  );
}
