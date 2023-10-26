"use client";

import { Spinner } from "./materialTailwindExports";

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen font-bold">
      <Spinner />
    </div>
  );
}
