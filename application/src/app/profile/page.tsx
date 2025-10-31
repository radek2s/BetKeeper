/** biome-ignore-all lint/performance/noImgElement: <explanation> */
"use server";

import { ACTIVE_USER_ID } from "application/src/constants";
import NextUserRepository from "application/src/core/repositories/NextUserRepository";
import getConfig from "next/config";
import Link from "next/link";

const { publicRuntimeConfig } = getConfig();

const repository = new NextUserRepository();

export default async function ProfilePage() {
  const user = await repository.findById(ACTIVE_USER_ID);

  if (!user) return <div>User with given ID does not exists!</div>;
  return (
    <div className="min-h-dvh flex flex-col items-center">
      <div className="my-4 px-4 flex w-full justify-between">
        <div className="flex gap-1">
          <div>Back</div>
          <h1>Profile</h1>
        </div>
        <div>More</div>
      </div>

      <div className="flex flex-col items-center">
        <img className="w-[128px]" src={user.avatarUrl} alt="Profile" />
        <div className="flex flex-col items-center my-2">
          <h2 className="text-xl">{user.name}</h2>
          <span>{user.email.value}</span>
        </div>
      </div>
      <div className="grow-1">
        <ul>
          <Link href={"/users"}>
            <li>Application users</li>
          </Link>

          <li>Bet Ideas and notes</li>
          <li>Notification settings</li>
          <li>Report problem</li>
          <li>Logout</li>
        </ul>
      </div>
      <div className="grow"></div>
      <footer className="flex flex-col items-center m-8">
        <div>
          Created by <a href="https://github.com/radek2s">radek2s</a>
        </div>
        <div>v{publicRuntimeConfig?.version}</div>
      </footer>
    </div>
  );
}
