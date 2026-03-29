import type {
  BetActionEvent,
  BetCreatedEvent,
  BetRequestCreatedEvent,
} from "@domain/bet";
import type {
  FriendRequestSentEvent,
  InvitationRequestSentEvent,
} from "@domain/user";

export interface EmailProvider {
  sendUserRequestNotification(event: InvitationRequestSentEvent): Promise<void>;
  sendFriendRequestNotification(event: FriendRequestSentEvent): Promise<void>;
  sendBetRequestCreatedNotification(
    event: BetRequestCreatedEvent,
  ): Promise<void>;
  sendBetCreatedNotification(event: BetCreatedEvent): Promise<void>;
  sendBetUpdateNotification(event: BetActionEvent): Promise<void>;
}
