/** biome-ignore-all lint/complexity/useArrowFunction: To mock constructor I need to use function instead of arrow function */
import { InMemoryUserRepository } from "@bet-keeper/domain/test/mocks/InMemoryUserRepository";
import { BetRequestCreatedEvent } from "@domain/bet";
import { Email, User, UserStatus } from "@domain/user";
import { vi } from "vitest";
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
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });
  test("send bet request created notification to participant", async () => {
    const inMemoryUserRepository = new InMemoryUserRepository();
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

    const provider = new MailtrapProvider(inMemoryUserRepository);

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
      from: { name: "NoReply", email: "no-reply@betkeeper.ovh" },
      to: [{ email: "recipient@mock.tech" }],
      subject: "New bet request create",
      text: `You have been invited to bet reqest Simple Title created by Creator Bet.`,
    });
  });
});
