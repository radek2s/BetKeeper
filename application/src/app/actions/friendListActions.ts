"use server";
import NextUserService from "@app/server/services/NextUserService";
import type { UUID } from "@domain/shared";
import { Email } from "@domain/user";

export async function sendFriendRequest(
  senderId: UUID,
  receiverEmail: string,
): Promise<string> {
  const request = await NextUserService.sendFriendRequest(
    senderId,
    new Email(receiverEmail),
  );
  return request.id;
}

export async function approveFriendRequest(reciverId: UUID, requestId: UUID) {
  await NextUserService.approveFriendRequest(reciverId, requestId);
}
