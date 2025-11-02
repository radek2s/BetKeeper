// "use client";
/** biome-ignore-all lint/performance/noImgElement: <explanation> */
import type { User } from "@domain/user";
import type { UserType } from "@domain/user/entities";
import { objectToUser } from "application/src/lib/mappers/user";

interface Props {
  user: User;
}
export function UserComponent({ user }: Props) {
  return (
    <div className="flex gap-1 items-center">
      <img
        className="w-[48px] avatar"
        src={user?.avatarUrl || "/avatars/avatar_01.png"}
        alt="User avatar"
      />
      <div className="flex flex-col">
        <span>{user.name}</span>
        <span className="text-sm text-gray-800 dark:text-gray-400">
          {user.email.value}
        </span>
      </div>
    </div>
  );
}
