/** biome-ignore-all lint/a11y/noSvgWithoutTitle: <explanation> */
/** biome-ignore-all lint/performance/noImgElement: <explanation> */

// import { getBetRequests } from "@app/features/bets/actions";
import { getBets } from "@app/features/bets/actions";
import { BetCard } from "@app/features/bets/components/BetCard";
import { BetRequestCreateBtn } from "@app/features/bets/components/BetRequestCreateBtn";
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

  const { requests, pending, resolved, completed } = groupBets(
    await getBets(user.id),
  );

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
        <div className="flex justify-between my-4">
          <BetTabIcon isActive icon="waving-hand" name="Requests" />
          <BetTabIcon icon="handshake" name="Unresolved" />
          <BetTabIcon icon="timeline" name="In progress" />
          <BetTabIcon icon="fact-check" name="Finished" />
        </div>
        <section>
          <div className="flex flex-col gap-3">
            {requests.map((request) => (
              <BetCard key={request.id} bet={request} />
            ))}
          </div>
        </section>

        <BetRequestCreateBtn
          friends={friends}
          creator={authorizedUserToUserType(user)}
        />
      </div>
    </PageWrapper>
  );
}

function groupBets(bets: (BetRequestResponse | BetResponse)[]) {
  const requests: BetRequestResponse[] = [];
  const pending: BetResponse[] = [];
  const resolved: BetResponse[] = [];
  const completed: BetResponse[] = [];

  bets.forEach((bet) => {
    if (isBetResponse(bet)) {
      switch (bet.status) {
        case "pending": {
          pending.push(bet);
          break;
        }
        case "resolved": {
          resolved.push(bet);
          break;
        }
        case "completed": {
          completed.push(bet);
          break;
        }
      }
    } else {
      requests.push(bet);
    }
  });
  return {
    requests,
    pending,
    resolved,
    completed,
  };
}
