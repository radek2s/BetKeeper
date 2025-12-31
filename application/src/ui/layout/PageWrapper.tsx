"use client";
import type { PropsWithChildren } from "react";

export function PageWrapper({ children }: PropsWithChildren) {
  return <div className="min-h-dvh flex flex-col items-center">{children}</div>;
}
