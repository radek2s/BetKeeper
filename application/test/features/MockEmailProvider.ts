import type { EmailProvider } from "@app/server/email/emailProvider.interface";
import { vi } from "vitest";

export const MockEmailProvider: EmailProvider = {
  sendUserRequestNotification: vi.fn(),
  sendFriendRequestNotification: vi.fn(),
  sendBetRequestCreatedNotification: vi.fn(),
  sendBetCreatedNotification: vi.fn(),
  sendBetUpdateNotification: vi.fn(),
};
