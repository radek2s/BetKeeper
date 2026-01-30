"use client";

import { AuthenticationError } from "@app/server/exceptions/AuthenticationError";
import { PageWrapper } from "@app/ui/layout/PageWrapper";
import type { UserType } from "@domain/user/entities";
import { useRouter } from "next/navigation";
import { createContext, type PropsWithChildren, useContext } from "react";
import { useUser } from "./api/userQuery";

type UserContextType = UserType;

export const UserContext = createContext<UserContextType | null>(null);

export const useUserContext = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("You must use useUserContext within UserProvider!");
  return ctx;
};

export function UserProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const { isLoading, error, data } = useUser();

  if (isLoading) return <UserLoader />;
  if (error instanceof AuthenticationError) router.push("/login");
  if (error) return <div>{error.message}</div>;
  if (!data) return <div>User not loaded</div>;
  return <UserContext.Provider value={data}>{children}</UserContext.Provider>;
}

function UserLoader() {
  return (
    <PageWrapper>
      <header className="m-4 flex flex-col items-center gap-2 panel">
        <p className="text-xm text-gray">
          Please wait we are loading your profile data...
        </p>
        <div className="loader-icon" />
      </header>
    </PageWrapper>
  );
}
