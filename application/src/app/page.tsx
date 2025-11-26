/** biome-ignore-all lint/a11y/noSvgWithoutTitle: <explanation> */
/** biome-ignore-all lint/performance/noImgElement: <explanation> */

import { BetRequestCreateBtn } from "@app/features/bets/components/BetRequestCreateBtn";
import { getAuthenticatedUserFromCookie } from "@app/server/auth/authentication";
import { Button } from "@app/ui/button/Button";
import { IconButton } from "@app/ui/button/IconButton";
import { PageWrapper } from "@app/ui/layout/PageWrapper";
import { Select } from "@app/ui/select";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Index() {
  const user = await getAuthenticatedUserFromCookie();

  if (!user) redirect("/login");

  return (
    <PageWrapper>
      <header className="flex w-full justify-between items-center my-4 px-4">
        <div className="flex gap-2">
          <Link href="/profile">
            <img
              className="avatar h-[48px]"
              src={user.avatarUrl ?? "/avatars/avatar_00.png"}
              alt="Profile avatar"
            />
          </Link>
          <div>
            <span className="text-gray">Hi, {user.name}!</span>
            <h1 className="m-none main-title">Bets</h1>
          </div>
        </div>
        <div className="flex gap-1">
          <IconButton icon="notification" />
          <Link href="/friends">
            <IconButton icon="group" />
          </Link>
        </div>
      </header>
      <div>
        <Select />
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
        <BetRequestCreateBtn />
      </div>
    </PageWrapper>
  );
}
