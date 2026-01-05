import { getSentInvitations } from "@app/features/friends/actions";
import type { FriendsResponse } from "@app/features/friends/model/friendsDto";
import { getUserDetails } from "@app/features/users/actions";
import { getAuthenticatedUserFromCookie } from "@app/server/auth/authentication";
import { NextFriendListRepository } from "@app/server/repositories/NextFriendListRepository";
import type { FriendRequest } from "@domain/user";
import type { UserType } from "@domain/user/entities";

export async function GET() {
  try {
    const user = await getAuthenticatedUserFromCookie();
    if (!user) throw new Error("Unauthorized");

    const friendList = await new NextFriendListRepository().findByUserId(
      user.id,
    );

    if (!friendList) throw new Error("Friend List not found!");

    async function getUsers(userIds: string[]) {
      if (userIds.length === 0) return [];

      const userPromises = userIds.map(getUserDetails);
      return (await Promise.all(userPromises)).map((u) => u.toObject());
    }

    const [friends, pendingUsers] = await Promise.all([
      getUsers([...friendList.friends]),
      getUsers(friendList.pendingReceivedRequests.map((r) => r.senderId)),
    ]);

    const pendingInvitations = friendList.pendingReceivedRequests.map(
      (request) => mapToUsers(request, pendingUsers),
    );

    const sentInvitations = await getSentInvitations(user.id);

    const response: FriendsResponse = {
      friends,
      pendingInvitations,
      sentInvitations,
    };

    function mapToUsers(friendRequest: FriendRequest, users: UserType[]) {
      const sender = users.find(({ id }) => id === friendRequest.senderId);
      if (!sender) throw new Error("Unable to find sender!");
      return {
        ...sender,
        requestId: friendRequest.id,
      };
    }

    return Response.json(response);
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
