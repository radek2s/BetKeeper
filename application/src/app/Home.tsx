/** biome-ignore-all lint/performance/noImgElement: <explanation> */
"use client";

import { BetLoader } from "@app/features/bets/components/BetLoader";
import { BetRequestCreateBtn } from "@app/features/bets/components/BetRequestCreateBtn";
import BetBrowser from "@app/features/bets/components/browser";
import { MissingFriends } from "@app/features/bets/components/MissingFriends";
import BetSearch from "@app/features/bets/components/search/BetSearch";
import { FriendLoader } from "@app/features/friends/components/FriendLoader";
import { NotificationBtn } from "@app/features/notification/NotificationBtn";
import { useUserContext } from "@app/features/users/UserProvider";

import { IconButton } from "@app/ui/button/IconButton";
import Link from "next/link";
import { useState } from "react";

export function Home() {
  const user = useUserContext();
  const [isSearchActive, setSearchActive] = useState<boolean>(false);
  return (
    <FriendLoader>
      {(friendResponse) => (
        <>
          <header className="flex w-full justify-between items-center my-4 px-4">
            <div className="flex gap-2 items-center">
              <Link href="/profile">
                <img
                  className="avatar h-12"
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
              <NotificationBtn />
              <Link href="/friends">
                <IconButton
                  icon="group"
                  badge={friendResponse.pendingInvitations.length}
                />
              </Link>
            </div>
          </header>
          <div>
            {friendResponse.friends.length > 0 ? (
              <>
                <BetLoader>
                  {(bets) => (
                    <BetSearch
                      isActive={isSearchActive}
                      onChange={setSearchActive}
                      bets={bets}
                    />
                  )}
                </BetLoader>

                {!isSearchActive && (
                  <>
                    <BetBrowser />

                    <BetRequestCreateBtn
                      friends={friendResponse.friends}
                      creator={user}
                    />
                  </>
                )}
              </>
            ) : (
              <MissingFriends />
            )}
          </div>
        </>
      )}
    </FriendLoader>
  );
}
