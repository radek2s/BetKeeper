import {
  type BetEventType,
  type DomainEventType,
  isBetActionEvent,
  isBetCreatedEvent,
  isBetEvent,
  isBetUpdateEvent,
} from "@app/server/events/eventDto";
import type { QueryClient } from "@tanstack/react-query";
import { queryKeys } from "../bets/api/betQuery";
import type { BetNotificationType, NotificationType } from "./model";

export function NotificationHandler(
  queryClient: QueryClient,
  watcherId: string,
) {
  const handle = (e: DomainEventType): NotificationType | null => {
    if (isBetEvent(e)) {
      return BetRequestEventHandler(e, queryClient, watcherId);
    }
    return null;
  };

  return {
    handle,
  };
}

function BetRequestEventHandler(
  event: BetEventType,
  queryClient: QueryClient,
  watcherId: string,
): BetNotificationType | null {
  if (isBetCreatedEvent(event)) {
    if (event.creatorId === watcherId) return null;
    if (event.eventType === "BetRequestCreated") {
      queryClient.invalidateQueries({ queryKey: [queryKeys.bets] });
      return {
        id: event.eventId,
        betId: event.betId,
        timestamp: event.occurredOn,
        message: `You have been requested to participate in bet ${event.title}.`,
        isRead: false,
      };
    }
  }
  if (isBetActionEvent(event)) {
    if (event.executedBy === watcherId) return null;
    queryClient.invalidateQueries({ queryKey: [queryKeys.bet, event.betId] });
    return {
      id: event.eventId,
      betId: event.betId,
      timestamp: event.occurredOn,
      message: `Bet ${event.title} has been makred as ${event.action}d.`,
      isRead: false,
    };
  }
  if (isBetUpdateEvent(event)) {
    if (event.changedBy === watcherId) return null;
    queryClient.invalidateQueries({ queryKey: [queryKeys.bet, event.betId] });
    return {
      id: event.eventId,
      betId: event.betId,
      timestamp: event.occurredOn,
      message: `Bet ${event.title} has updated ${event.property}.`,
      isRead: false,
    };
  }
  return null;
}
