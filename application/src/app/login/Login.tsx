/** biome-ignore-all lint/performance/noImgElement: <explanation> */
"use client";
import { CorbadoAuth } from "@corbado/react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";

async function onSignIn(router: AppRouterInstance) {
  router.push("/");
}

export function Login() {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-2 justify-center h-[70vh] items-center">
      <img
        className="app-logo"
        src="/BetKeeper_Logo.png"
        alt="Application Logo"
      />
      <CorbadoAuth
        onLoggedIn={async () => {
          await onSignIn(router);
        }}
        initialBlock="login-init"
      />
    </div>
  );
}
