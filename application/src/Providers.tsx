"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";
import { NotificationProvider } from "./features/notification/NotificationProvider";
import { UserProvider } from "./features/users/UserProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

export function Providers({ children }: PropsWithChildren) {
  const path = usePathname();
  const isLogin = path.startsWith("/login");

  if (isLogin) return <>{children}</>;

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <NotificationProvider>{children}</NotificationProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}
