/** biome-ignore-all lint/a11y/noSvgWithoutTitle: <explanation> */
/** biome-ignore-all lint/performance/noImgElement: <explanation> */

// import { getBetRequests } from "@app/features/bets/actions";
import { getBets } from "@app/features/bets/actions";
import { BetCard } from "@app/features/bets/components/BetCard";
import { BetRequestCreateBtn } from "@app/features/bets/components/BetRequestCreateBtn";
import BetBrowser from "@app/features/bets/components/browser/BetBrowser";
import { BetTabIcon } from "@app/features/bets/components/browser/BetTabIcon";
import {
  type BetRequestResponse,
  type BetResponse,
  isBetResponse,
} from "@app/features/bets/model/betDto";
import { getFriendList } from "@app/features/friends/actions";
import { getUserDetails } from "@app/features/users/actions";
import { authorizedUserToUserType } from "@app/features/users/model/userDto";
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

  const bets = await getBets(user.id);

  return (
    <PageWrapper>
      <header className="flex w-full justify-between items-center my-4 px-4">
        <div className="flex gap-2 items-center">
          <Link href="/profile">
            <img
              className="avatar h-[48px]"
              src={user.avatarUrl ?? "/avatars/avatar_00.png"}
              alt="Profile avatar"
            />
          </Link>
          <div>
            <span className="text-gray">Hi, {user.firstName}!</span>
            <h1 className="m-none main-title font-semibold">Bets</h1>
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
        <BetBrowser bets={bets} />

        <BetRequestCreateBtn
          friends={friends}
          creator={authorizedUserToUserType(user)}
        />
      </div>
    </PageWrapper>
  );
}
