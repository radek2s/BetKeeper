import { mapToResponse } from "@app/features/bets/model/betDto";
import { userIdToUserType } from "@app/features/users/model/userDto";
import {
  getAuthenticatedUserFromCookie,
  validateToken,
} from "@app/server/auth/authentication";
import NextUserRepository from "@app/server/repositories/NextUserRepository";
import NextBetService from "@app/server/services/NextBetService";
import type { UserType } from "@domain/user/entities";

export async function GET() {
  try {
    const user = await getAuthenticatedUserFromCookie();
    if (!user) throw new Error("Unauthorized");
    const requests = await NextBetService.getAllByParticipantId(user?.id);
    const repository = new NextUserRepository();

    const usersIds = new Set(
      requests.flatMap((request) => request.participants.map((p) => p.userId)),
    )
      .values()
      .toArray();
    const users = await Promise.all(
      usersIds.map((userId) => userIdToUserType(userId, repository)),
    );
    const userMap = new Map<string, UserType>();
    users.forEach((user) => {
      userMap.set(user.id, user);
    });

    const reponse = requests.map((request) => mapToResponse(request, userMap));
    return Response.json(reponse);
  } catch (e) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
