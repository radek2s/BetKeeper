/** biome-ignore-all lint/performance/noImgElement: <explanation> */
"use server";

import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

export default async function ProfilePage() {
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
        <img className="w-[128px]" src="/example_avatar.png" alt="Profile" />
        <div className="flex flex-col items-center my-2">
          <h2 className="text-xl">Monica Wright</h2>
          <span>monicawright@gmail.com</span>
        </div>
      </div>
      <div className="grow-1">
        <ul>
          <li>Application users</li>
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
