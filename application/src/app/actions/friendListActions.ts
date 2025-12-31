"use server";
import type { UUID } from "@domain/shared";
import { Email } from "@domain/user";
import NextUserService from "application/src/core/services/NextUserService";

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
