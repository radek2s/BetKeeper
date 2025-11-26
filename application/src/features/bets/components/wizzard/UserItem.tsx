import type { UserType } from "@domain/user/entities";
import type { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  user: UserType;
}
export function UserItem({ user, children }: Props) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2 items-center">
        <img
          className="w-9 h-9 avatar"
          src={user.avatarUrl}
          aria-label="Profile"
        />
        <div className="flex flex-col">
          <span className="text-left">
            {user.firstName} {user.lastName}
          </span>
          <span className="text-gray text-sm">{user.email}</span>
        </div>
      </div>
      {children}
    </div>
  );
}
