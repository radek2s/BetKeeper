/** biome-ignore-all lint/performance/noImgElement: <explanation> */
import { objectToUser } from "@app/lib/mappers/user";
import type { UserType } from "@domain/user/entities";
import type { ReactNode } from "react";

interface Props {
  user: UserType;
  children: ReactNode;
}
export function UserListItem({ user, children }: Props) {
  const { email, name, avatarUrl } = objectToUser(user);
  return (
    <div className="user-item actions-wrapper flex justify-between">
      <div className="user-item__details flex gap-2">
        <img
          className="w-[48px] avatar"
          src={avatarUrl || "/avatars/avatar_00.png"}
          alt="User avatar"
        />
        <div className="flex flex-col">
          <span>{name}</span>
          <span className="text-sm text-gray-800 dark:text-gray-400">
            {email.value}
          </span>
        </div>
      </div>
      <div className="actions-wrapper__actions flex gap-1 items-center">
        {children}
      </div>
    </div>
  );
}
