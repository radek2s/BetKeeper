/** biome-ignore-all lint/performance/noImgElement: <explanation> */
"use server";

import { IconButton } from "application/src/lib/components/button/IconButton";
import { Icon } from "application/src/lib/components/icon";
import Link from "next/link";
import { getActiveUser } from "../actions/usersActions";
import { ProfileImage } from "./ProfileImage";

export default async function ProfilePage() {
  const user = await getActiveUser();

  if (!user) return <div>User with given ID does not exists!</div>;
  return (
    <div className="min-h-dvh flex flex-col items-center">
      <div className="my-4 px-4 flex w-full justify-between">
        <div className="flex gap-1 items-center">
          <Link href={"/"}>
            <IconButton icon="arrow-left" />
          </Link>
          <h1 className="text-xl">Profile</h1>
        </div>
        <IconButton icon="more" />
      </div>

      <div className="flex flex-col items-center">
        <ProfileImage activeImage={user.avatarUrl || ""} />
        <div className="flex flex-col items-center my-2">
          <h2 className="text-xl m-none">{user.name}</h2>
          <span className="text-gray-600 text-sm">{user.email.value}</span>
        </div>
      </div>
      <div className="grow-1 mt-4">
        <ul className="flex flex-col gap-4">
          <Link href={"/users"}>
            <li className="flex items-center gap-2">
              <Icon name="groups" /> Application users
            </li>
          </Link>
          <li className="flex items-center gap-2">
            <Icon name="note" /> Bet Ideas and notes
          </li>
          <li className="flex items-center gap-2">
            <Icon name="mail" /> Notification settings
          </li>
          <li className="flex items-center gap-2">
            <Icon name="bug" /> Report problem
          </li>
          <li className="flex items-center gap-2">
            <Icon name="logout" /> Logout
          </li>
        </ul>
      </div>
      <div className="grow"></div>
      <footer className="flex flex-col items-center m-8">
        <div>
          Created by <a href="https://github.com/radek2s">radek2s</a>
        </div>
        <div>v{process.env.NEXT_PUBLIC_APP_VERSION}</div>
      </footer>
    </div>
  );
}
