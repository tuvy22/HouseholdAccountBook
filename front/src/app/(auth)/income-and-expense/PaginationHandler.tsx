"use client";
import { Pagination } from "@/app/components/Pagination";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function PaginationHandler({
  children,
  page,
  maxPage,
}: {
  children: React.ReactNode;
  page: string;
  maxPage: number;
}) {
  const [active, setActive] = React.useState(parseInt(page) || 1);
  const router = useRouter();

  useEffect(() => {
    router.push(`/income-and-expense?page=${active}`);
  }, [active, router]);

  return (
    <>
      <Pagination active={active} setActive={setActive} maxPage={maxPage} />
      {children}
      <Pagination active={active} setActive={setActive} maxPage={maxPage} />
    </>
  );
}
