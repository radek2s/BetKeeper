import { getSentInvitations } from "@app/features/friends/actions";
import type { FriendsResponse } from "@app/features/friends/model/friendsDto";
import { getUserDetails } from "@app/features/users/actions";
import { OkResponse } from "@app/lib/utils/fetchUtils";
import { getAuth } from "@app/server/auth/authenticatorFactory";
import { ExceptionHandler } from "@app/server/exceptions/ExceptionHandler";
import type { ExceptionResponseBody } from "@app/server/exceptions/exception.interface";
import { NextFriendListRepository } from "@app/server/repositories/NextFriendListRepository";
import { NextUserService } from "@app/server/services/NextUserService";
import { Email, type FriendRequest } from "@domain/user";
import type { UserType } from "@domain/user/entities";

/**
 * Get friend list
 * @tag Friends
 * @description Get friend list
 * @response FriendsResponse
 * @openapi
 */
export async function GET(req: Request) {
  try {
    const user = await getAuth().getUser(req);
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
    return ExceptionHandler(e);
  }
}

type InviteSchema = {
  email: string;
};
type InviteFriendResponseSchema = {
  result: "invite" | "create";
};
/**
 * Invite user to friend list
 * @tag Friends
 * @description Invite new friend by email
 * @body InviteSchema
 * @response InviteFriendResponseSchema
 * @openapi
 */
export async function POST(req: Request) {
  try {
    const user = await getAuth().getUser(req);
    const { email } = await req.json();
    if (!email) {
      const response: ExceptionResponseBody = {
        error: "Invalid Form Data",
        message: "Send payload with email property",
      };
      return Response.json(response, { status: 400 });
    }

    const friendEmail = new Email(email);
    const userExists = await NextUserService.userExists(friendEmail);

    if (userExists) {
      await NextUserService.sendFriendRequest(user.id, friendEmail);
      return OkResponse({ result: "invite" });
    } else {
      return OkResponse({ result: "create" });
    }
  } catch (e) {
    return ExceptionHandler(e);
  }
}
