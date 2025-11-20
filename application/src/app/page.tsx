/** biome-ignore-all lint/a11y/noSvgWithoutTitle: <explanation> */
/** biome-ignore-all lint/performance/noImgElement: <explanation> */

import { getAuthenticatedUserFromCookie } from "@app/server/auth/authentication";
import { Button } from "@app/ui/button/Button";
import { IconButton } from "@app/ui/button/IconButton";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Index() {
  const user = await getAuthenticatedUserFromCookie();

  if (!user) redirect("/login");

  return (
    <div>
      <header className="flex justify-between items-center mx-4 py-6">
        <div className="flex gap-2">
          <Link href="/profile">
            <img
              className="avatar h-[48px]"
              src={user.avatarUrl ?? "/avatars/avatar_00.png"}
              alt="Profile avatar"
            />
          </Link>
          <div>
            <span>Hi {user.name}!</span>
            <h1>Bets</h1>
          </div>
        </div>
        <div className="flex gap-1">
          <IconButton icon="notification" />
          <Link href="/friends">
            <IconButton icon="group" />
          </Link>
        </div>
      </header>
      <section>
        <h2>Pending requests</h2>
      </section>
      <section>
        <h2>Unresolved</h2>
      </section>
      <section>
        <h2>Uncompleted</h2>
      </section>
      <Button>Show all</Button>
      <IconButton icon="add" variant="primary" />
    </div>
  );
}
