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
    <div>
      <h1>Signup</h1>
      <CorbadoAuth
        onLoggedIn={() => {
          onSignIn(router);
        }}
        initialBlock="login-init"
      />
    </div>
  );
}
