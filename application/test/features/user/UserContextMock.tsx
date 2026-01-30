import { UserContext } from "@app/features/users/UserProvider";
import type { UserType } from "@domain/user/entities";
import type { PropsWithChildren } from "react";
import { DEFAULT_USER } from "./mocks/UserMock";

type Props = PropsWithChildren & Partial<UserType>;
export function UserContextMock({ children, ...ctx }: Props) {
  const context: UserType = {
    ...DEFAULT_USER,
    ...ctx,
  };

  return (
    <UserContext.Provider value={context}>{children}</UserContext.Provider>
  );
}
