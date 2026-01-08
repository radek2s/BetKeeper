"use client";

import { AuthenticationError } from "@app/server/exceptions/AuthenticationError";
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

  if (isLoading) return <div>Loading </div>;
  if (error instanceof AuthenticationError) router.push("/login");
  if (error) return <div>{error.message}</div>;
  if (!data) return <div>User not loaded</div>;
  return <UserContext.Provider value={data}>{children}</UserContext.Provider>;
}
