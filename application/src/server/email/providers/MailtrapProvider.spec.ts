/** biome-ignore-all lint/complexity/useArrowFunction: To mock constructor I need to use function instead of arrow function */

import { UserNotificationSettings } from "@app/features/notification/user/model";
import { InMemoryUserSettingsRepository } from "@bet-keeper/domain/test/mocks/InMemoryUserNotificationsRepository";
import { InMemoryUserRepository } from "@bet-keeper/domain/test/mocks/InMemoryUserRepository";
import {
  BetActionEvent,
  BetCreatedEvent,
  BetRequestCreatedEvent,
} from "@domain/bet";
import {
  Email,
  FriendRequestSentEvent,
  InvitationRequestSentEvent,
  User,
  UserStatus,
} from "@domain/user";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import MailtrapProvider from "./MailtrapProvider";

const sendMock = vi.fn();

vi.mock("mailtrap", () => {
  return {
    MailtrapClient: vi.fn().mockImplementation(function () {
      return {
        send: sendMock,
      };
    }),
  };
});

describe("MailtrapProvider Tests", () => {
  beforeEach(() => {
    vi.stubEnv("EMAIL_MAILTRAP_API_KEY", "temporary-key");
    vi.stubEnv("EMAIL_MAILTRAP_FRIEND_INVITE", "temporary-key");
    vi.stubEnv("EMAIL_MAILTRAP_BET_INVITE", "temporary-key");
    vi.stubEnv("EMAIL_MAILTRAP_BET_AGREED", "temporary-key");
    vi.stubEnv("EMAIL_MAILTRAP_BET_STATUS", "temporary-key");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });
  test("send bet request created notification to participant", async () => {
    const inMemoryUserRepository = new InMemoryUserRepository();
    const inMemoryUserSettingsRepository = new InMemoryUserSettingsRepository();
    const administrator = new User(
      new Email("admin@test.com"),
      "Administrator",
      "Mock",
      UserStatus.ACTIVE,
      "",
      "user-01",
    );
    sendMock.mockResolvedValue({ success: true });

    const creator = User.reconstitute(
      "user-01",
      new Email("test@mock.tech"),
      "Creator",
      "Bet",
      UserStatus.ACTIVE,
    );
    const friend = User.reconstitute(
      "user-02",
      new Email("recipient@mock.tech"),
      "Friend",
      "Bet",
      UserStatus.ACTIVE,
    );

    await inMemoryUserRepository.save(creator);
    await inMemoryUserRepository.save(friend);

    const provider = new MailtrapProvider(
      inMemoryUserRepository,
      inMemoryUserSettingsRepository,
      administrator,
    );

    const event = new BetRequestCreatedEvent(
      "bet-01",
      "user-01",
      "Simple Title",
      "Terms",
      [
        {
          userId: "user-01",
          claim: "Claim 01",
          vote: "approved",
        },
        {
          userId: "user-02",
          claim: "Claim 02",
          vote: "unknown",
        },
      ],
      new Date(),
      "COMMON",
    );

    await provider.sendBetRequestCreatedNotification(event);

    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith({
      from: { name: "BetKeeper", email: "no-reply@betkeeper.ovh" },
      to: [{ email: "recipient@mock.tech" }],
      template_uuid: "temporary-key",
      template_variables: {
        betId: "bet-01",
        betTitle: "Simple Title",
        creatorName: "Creator Bet",
      },
    });
  });

  test("send user request notification to administrator", async () => {
    const inMemoryUserRepository = new InMemoryUserRepository();
    const inMemoryUserSettingsRepository = new InMemoryUserSettingsRepository();
    const administrator = new User(
      new Email("admin@test.com"),
      "Administrator",
      "Mock",
      UserStatus.ACTIVE,
      "",
      "user-01",
    );
    sendMock.mockResolvedValue({ success: true });

    const requester = User.reconstitute(
      "user-02",
      new Email("requester@test.com"),
      "Requester",
      "Test",
      UserStatus.ACTIVE,
    );

    await inMemoryUserRepository.save(requester);

    const provider = new MailtrapProvider(
      inMemoryUserRepository,
      inMemoryUserSettingsRepository,
      administrator,
    );

    const event = new InvitationRequestSentEvent(
      "request-01",
      "user-02",
      new Email("invitee@test.com"),
    );

    await provider.sendUserRequestNotification(event);

    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith({
      from: { name: "BetKeeper", email: "no-reply@betkeeper.ovh" },
      to: [{ email: "admin@test.com" }],
      subject: "New pending user request",
      text: "Requester Test invited invitee@test.com to join to BetKeeper. Check users management panel.",
    });
  });

  test("send friend request notification to recipient", async () => {
    const inMemoryUserRepository = new InMemoryUserRepository();
    const inMemoryUserSettingsRepository = new InMemoryUserSettingsRepository();
    const administrator = new User(
      new Email("admin@test.com"),
      "Administrator",
      "Mock",
      UserStatus.ACTIVE,
      "",
      "user-01",
    );
    sendMock.mockResolvedValue({ success: true });

    const sender = User.reconstitute(
      "user-02",
      new Email("sender@test.com"),
      "Sender",
      "Test",
      UserStatus.ACTIVE,
    );
    const recipient = User.reconstitute(
      "user-03",
      new Email("recipient@test.com"),
      "Recipient",
      "Test",
      UserStatus.ACTIVE,
    );

    await inMemoryUserRepository.save(sender);
    await inMemoryUserRepository.save(recipient);

    const provider = new MailtrapProvider(
      inMemoryUserRepository,
      inMemoryUserSettingsRepository,
      administrator,
    );

    const event = new FriendRequestSentEvent(
      "request-01",
      "user-02",
      "user-03",
    );

    await provider.sendFriendRequestNotification(event);

    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith({
      from: { name: "BetKeeper", email: "no-reply@betkeeper.ovh" },
      to: [{ email: "recipient@test.com" }],
      template_uuid: "temporary-key",
      template_variables: {
        senderName: "Sender Test",
      },
    });
  });

  test("send bet created notification to watchers with active settings", async () => {
    const inMemoryUserRepository = new InMemoryUserRepository();
    const inMemoryUserSettingsRepository = new InMemoryUserSettingsRepository();
    const administrator = new User(
      new Email("admin@test.com"),
      "Administrator",
      "Mock",
      UserStatus.ACTIVE,
      "",
      "user-01",
    );
    sendMock.mockResolvedValue({ success: true });

    const watcher = User.reconstitute(
      "user-02",
      new Email("watcher@test.com"),
      "Watcher",
      "Test",
      UserStatus.ACTIVE,
    );

    await inMemoryUserRepository.save(watcher);

    await inMemoryUserSettingsRepository.save(
      UserNotificationSettings.reconstitute(
        watcher.id,
        true,
        true,
        true,
        false,
        false,
      ),
    );

    const provider = new MailtrapProvider(
      inMemoryUserRepository,
      inMemoryUserSettingsRepository,
      administrator,
    );

    const event = new BetCreatedEvent("bet-02", "user-01", "Created Title", [
      watcher.id,
    ]);

    await provider.sendBetCreatedNotification(event);

    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith({
      from: { name: "BetKeeper", email: "no-reply@betkeeper.ovh" },
      to: [{ email: "watcher@test.com" }],
      template_uuid: "temporary-key",
      template_variables: {
        betId: "bet-02",
        betTitle: "Created Title",
      },
    });
  });

  test("send bet update notification to watchers with active settings", async () => {
    const inMemoryUserRepository = new InMemoryUserRepository();
    const inMemoryUserSettingsRepository = new InMemoryUserSettingsRepository();
    const administrator = new User(
      new Email("admin@test.com"),
      "Administrator",
      "Mock",
      UserStatus.ACTIVE,
      "",
      "user-01",
    );
    sendMock.mockResolvedValue({ success: true });

    const watcher = User.reconstitute(
      "user-02",
      new Email("watcher@test.com"),
      "Watcher",
      "Test",
      UserStatus.ACTIVE,
    );

    await inMemoryUserRepository.save(watcher);

    await inMemoryUserSettingsRepository.save(
      UserNotificationSettings.reconstitute(
        watcher.id,
        true,
        true,
        false,
        false,
        true,
      ),
    );

    const provider = new MailtrapProvider(
      inMemoryUserRepository,
      inMemoryUserSettingsRepository,
      administrator,
    );

    const event = new BetActionEvent(
      "bet-03",
      "complete",
      "user-01",
      "Updated Title",
      [watcher.id],
    );

    await provider.sendBetUpdateNotification(event);

    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith({
      from: { name: "BetKeeper", email: "no-reply@betkeeper.ovh" },
      to: [{ email: "watcher@test.com" }],
      template_uuid: "temporary-key",
      template_variables: {
        betId: "bet-03",
        betStatus: "complete",
        betTitle: "Updated Title",
      },
    });
  });
});
