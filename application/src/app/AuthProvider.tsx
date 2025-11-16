"use client";
import { CorbadoProvider } from "@corbado/react";
import type { PropsWithChildren } from "react";

function AuthProvider({ children }: PropsWithChildren) {
  const projectId = process.env.NEXT_PUBLIC_CORBADO_PROJECT_ID;

  if (!projectId) {
    throw new Error("Missing Corbado Project ID!");
  }

  return <CorbadoProvider projectId={projectId}>{children}</CorbadoProvider>;
}

export default AuthProvider;
