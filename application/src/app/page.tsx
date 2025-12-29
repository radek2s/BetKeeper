/** biome-ignore-all lint/a11y/noSvgWithoutTitle: <explanation> */
/** biome-ignore-all lint/performance/noImgElement: <explanation> */

// import { getBetRequests } from "@app/features/bets/actions";
import { BetCard } from "@app/features/bets/components/BetCard";
import { BetRequestCreateBtn } from "@app/features/bets/components/BetRequestCreateBtn";
import type { BetRequestResponse } from "@app/features/bets/model/betDto";
import { getFriendList } from "@app/features/friends/actions";
import { getUserDetails } from "@app/features/users/actions";
import { getAuthenticatedUserFromCookie } from "@app/server/auth/authentication";
import { Button } from "@app/ui/button/Button";
import { IconButton } from "@app/ui/button/IconButton";
import { PageWrapper } from "@app/ui/layout/PageWrapper";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Index() {
  const user = await getAuthenticatedUserFromCookie();

  if (!user) redirect("/login");

  const friendList = await getFriendList(user.id);

  const friends = await getUsers([...friendList.friends]);

  async function getUsers(userIds: string[]) {
    if (userIds.length === 0) return [];

    const userPromises = userIds.map(getUserDetails);
    return (await Promise.all(userPromises)).map((u) => u.toObject());
  }

  const requests: BetRequestResponse[] = []; // await getBetRequests(user.id);

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
        <section>
          <h2>Pending requests</h2>
          <div className="flex flex-col gap-3">
            {requests.map((request) => (
              <BetCard key={request.id} bet={request} />
            ))}
          </div>
        </section>
        <section>
          <h2>Unresolved</h2>
        </section>
        <section>
          <h2>Uncompleted</h2>
        </section>
        <Button>Show all</Button>
        <BetRequestCreateBtn friends={friends} />
      </div>
    </PageWrapper>
  );
}
