import type { BetRequestCreatedEvent } from "@domain/bet";
import type {
  FriendRequestSentEvent,
  InvitationRequestSentEvent,
} from "@domain/user";

export interface EmailProvider {
  sendBetRequestCreatedNotification(
    event: BetRequestCreatedEvent,
  ): Promise<void>;
  sendUserRequestNotification(event: InvitationRequestSentEvent): Promise<void>;
  sendFriendRequestNotification(event: FriendRequestSentEvent): Promise<void>;
}
