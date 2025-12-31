"use server";
import {
  getFriendList,
  getSentInvitations,
} from "@app/features/friends/actions";
import { FriendInvite } from "@app/features/friends/components/FriendInvite";
import { FriendList } from "@app/features/friends/components/FriendList";
import { FriendRequestReceived } from "@app/features/friends/components/FriendRequestReceived";
import { FriendRequestsSent } from "@app/features/friends/components/FriendRequestsSent";
import { getUserDetails } from "@app/features/users/actions";
import type { AuthorizedUser } from "@app/lib/user/AuthorizedUser";
import { getAuthenticatedUserFromCookie } from "@app/server/auth/authentication";
import PageHeader from "@app/ui/layout/Header";
import { PageWrapper } from "@app/ui/layout/PageWrapper";
import type { FriendRequest } from "@domain/user";
import type { UserType } from "@domain/user/entities";

export default async function FriendsPage() {
  const user = await getAuthenticatedUserFromCookie();
  if (!user) return <div>User is not logged in!</div>;

  const friendList = await getFriendList(user.id);
  const invitations = await getSentInvitations(user.id);

  const users = await getUsers([
    ...friendList.friends,
    ...friendList.pendingReceivedRequests.map((r) => r.senderId),
  ]);

  async function getUsers(userIds: string[]) {
    if (userIds.length === 0) return [];

    const userPromises = userIds.map(getUserDetails);
    return (await Promise.all(userPromises)).map((u) => u.toObject());
  }

  //TODO: A lot of work... Add when request has been sent
  // Add avatars // use comon type //
  return (
    <PageWrapper>
      <PageHeader title="Friends" returnUrl="/" />
      <div className="flex flex-col gap-3">
        <FriendRequestReceived
          users={friendList.pendingReceivedRequests.map((request) =>
            mapToUsers(request, users),
          )}
        />
        <FriendRequestsSent invitations={invitations} />
        <FriendList friendIds={friendList.friends} users={users} />
      </div>

      <FriendInvite />
    </PageWrapper>
  );
}

function mapToUsers(friendRequest: FriendRequest, users: UserType[]) {
  const sender = users.find(({ id }) => id === friendRequest.senderId);
  if (!sender) throw new Error("Unable to find sender!");
  return {
    ...sender,
    requestId: friendRequest.id,
  };
}
