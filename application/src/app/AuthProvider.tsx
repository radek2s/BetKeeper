"use client";

import { CorbadoProvider } from "@corbado/react";
import type { PropsWithChildren } from "react";

type AuthModeType = "CORBADO" | "MANUAL";
const AUTH_MODE: AuthModeType = (process.env.NEXT_PUBLIC_AUTH_MODE ??
  "CORBADO") as AuthModeType;

function AuthProvider({ children }: PropsWithChildren) {
  switch (AUTH_MODE) {
    case "CORBADO":
      return <CorbadoAuthProvider>{children}</CorbadoAuthProvider>;
    case "MANUAL":
      return <ManualAuthProvider>{children}</ManualAuthProvider>;
    default:
      return <div>Unrecoginzed authentication provdier</div>;
  }
}

export default AuthProvider;

function CorbadoAuthProvider({ children }: PropsWithChildren) {
  const projectId = process.env.NEXT_PUBLIC_CORBADO_PROJECT_ID;

  if (!projectId) {
    throw new Error("Missing Corbado Project ID!");
  }

  return <CorbadoProvider projectId={projectId}>{children}</CorbadoProvider>;
}

function ManualAuthProvider({ children }: PropsWithChildren) {
  return <>{children}</>;
}
