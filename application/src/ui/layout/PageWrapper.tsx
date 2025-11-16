"use client";
import { useCorbado } from "@corbado/react";
import type { PropsWithChildren } from "react";

export function PageWrapper({ children }: PropsWithChildren) {
  const { loading, isAuthenticated } = useCorbado();
  if (loading) return <div>Loading your session state</div>;
  if (!isAuthenticated) return <div>You are not logged in!</div>;
  return <div className="min-h-dvh flex flex-col items-center">{children}</div>;
}
