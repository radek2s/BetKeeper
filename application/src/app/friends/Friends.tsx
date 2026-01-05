"use client";

import { FriendList } from "@app/features/friends/components/FriendList";
import { FriendLoader } from "@app/features/friends/components/FriendLoader";
import { FriendRequestReceived } from "@app/features/friends/components/FriendRequestReceived";
import { FriendRequestsSent } from "@app/features/friends/components/FriendRequestsSent";

export function Friends() {
  return (
    <FriendLoader>
      {(friendResponse) => (
        <div className="flex flex-col gap-3">
          <FriendRequestReceived users={friendResponse.pendingInvitations} />
          <FriendRequestsSent invitations={friendResponse.sentInvitations} />
          <FriendList friends={friendResponse.friends} />
        </div>
      )}
    </FriendLoader>
  );
}
