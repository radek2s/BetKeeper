/** biome-ignore-all lint/performance/noImgElement: <explanation> */
"use server";

import LogoutButton from "@app/features/profile/components/Logout";
import { ProfileImage } from "@app/features/profile/components/ProfileImage";
import { getAuthenticatedUserFromCookie } from "@app/server/auth/authentication";
import { Icon } from "@app/ui/icon";
import PageHeader from "@app/ui/layout/Header";
import { PageWrapper } from "@app/ui/layout/PageWrapper";
import Link from "next/link";

export default async function ProfilePage() {
  const user = await getAuthenticatedUserFromCookie();

  if (!user) return <div>User with given ID does not exists!</div>;
  return (
    <PageWrapper>
      <ProfilePageHeader />
      <div className="flex flex-col items-center">
        <ProfileImage
          activeImage={user.avatarUrl || "/avatars/avatar_00.png"}
        />
        <div className="flex flex-col items-center my-2">
          <h2 className="text-xl m-none font-bold">{user.name}</h2>
          <span className="text-gray text-sm">{user.email.value}</span>
        </div>
      </div>
      <div className="grow mt-4">
        <ul className="flex flex-col gap-4">
          <Link href={"/users"}>
            <li className="flex items-center gap-2">
              <Icon name="groups" /> Application users
            </li>
          </Link>
          <Link href={"/profile/passkey"}>
            <li className="flex items-center gap-2">
              <Icon name="security-key" /> Manage passkeys
            </li>
          </Link>
          <li className="flex items-center gap-2 disabled">
            <Icon name="note" /> Bet Ideas and notes (Soon)
          </li>
          <li className="flex items-center gap-2 disabled">
            <Icon name="mail" /> Notification settings (Soon)
          </li>

          <li className="flex items-center gap-2 disabled">
            <Icon name="bug" /> Report problem (Soon)
          </li>
          <LogoutButton />
        </ul>
      </div>
      <div className="grow"></div>
      <footer className="flex flex-col items-center m-8">
        <div>
          Created by <a href="https://github.com/radek2s">radek2s</a>
        </div>
        <div>v{process.env.NEXT_PUBLIC_APP_VERSION}</div>
      </footer>
    </PageWrapper>
  );
}

function ProfilePageHeader() {
  return <PageHeader title="Profile" returnUrl="/" />;
}
