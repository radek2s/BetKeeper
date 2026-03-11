import { MockEmailProvider } from "@app-test/features/MockEmailProvider";
import {
  BetActionEvent,
  BetCreatedEvent,
  BetRequestCreatedEvent,
} from "@domain/bet";
import {
  Email,
  FriendRequestSentEvent,
  InvitationRequestSentEvent,
} from "@domain/user";
import { vi } from "vitest";
import { EmailDispatcherHandler } from "./emailDispatcher";

describe("EmailDispatcherHandler Tests", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test("should process InvitationRequestSentEvent", async () => {
    const mockProvider = MockEmailProvider;
    const dispatcher = new EmailDispatcherHandler(mockProvider);

    const event = new InvitationRequestSentEvent(
      "request-01",
      "user-01",
      new Email("test@email.com"),
    );

    await dispatcher.handle(event);

    expect(mockProvider.sendUserRequestNotification).toHaveBeenCalledTimes(1);
  });

  test("should process FriendRequestSentEvent", async () => {
    const mockProvider = MockEmailProvider;
    const dispatcher = new EmailDispatcherHandler(mockProvider);

    const event = new FriendRequestSentEvent(
      "request-01",
      "user-01",
      "friend-01",
    );

    await dispatcher.handle(event);

    expect(mockProvider.sendFriendRequestNotification).toHaveBeenCalledTimes(1);
  });

  test("should process BetRequestCreatedEvent", async () => {
    const mockProvider = MockEmailProvider;
    const dispatcher = new EmailDispatcherHandler(mockProvider);

    const event = new BetRequestCreatedEvent(
      "bet-01",
      "creator-01",
      "title",
      "terms",
      [],
      new Date(),
      "COMMON",
    );

    await dispatcher.handle(event);

    expect(
      mockProvider.sendBetRequestCreatedNotification,
    ).toHaveBeenCalledTimes(1);
  });

  test("should process BetCreatedEvent", async () => {
    const mockProvider = MockEmailProvider;
    const dispatcher = new EmailDispatcherHandler(mockProvider);

    const event = new BetCreatedEvent("bet-01", "creator-01", "title", []);

    await dispatcher.handle(event);

    expect(mockProvider.sendBetCreatedNotification).toHaveBeenCalledTimes(1);
  });

  test("should process BetActionEvent", async () => {
    const mockProvider = MockEmailProvider;
    const dispatcher = new EmailDispatcherHandler(mockProvider);

    const event = new BetActionEvent(
      "bet-01",
      "complete",
      "user-01",
      "title",
      [],
    );

    await dispatcher.handle(event);

    expect(mockProvider.sendBetUpdateNotification).toHaveBeenCalledTimes(1);
  });
});
