import { AuthorizedUser } from "@app/lib/user/AuthorizedUser";

import {
  Email,
  FriendRequest,
  RequestStatus,
  UserFriendList,
  UserRequest,
  UserStatus,
} from "@domain/user";
import { expect, vi } from "vitest";
import { getSentInvitations } from "./actions";

vi.mock("@app/server/auth/authentication", () => ({
  validateToken: vi.fn(),
}));
vi.mock("@app/server/repositories/NextUserRepository", () => {
  return {
    default: vi.fn().mockImplementation(() => {
      return {
        findById: vi
          .fn()
          .mockResolvedValue(
            AuthorizedUser.reconstituteAuth(
              "user-01",
              new Email("test@mock.pl"),
              "Test",
              "Mock",
              UserStatus.ACTIVE,
              "prov-id",
              "avatar-01",
            ),
          ),
      };
    }),
  };
});
vi.mock("@app/server/repositories/NextUserRequestRepository", () => {
  return {
    NextUserRequestRepository: vi.fn().mockImplementation(() => {
      return {
        findAllPendingByRequesterId: vi
          .fn()
          .mockResolvedValue([
            UserRequest.reconstitute(
              "req-01",
              "user-01",
              new Email("invitee@email.com"),
              RequestStatus.APPROVED,
              new Date(),
            ),
          ]),
      };
    }),
  };
});
vi.mock("@app/server/repositories/NextFriendListRepository", () => {
  return {
    NextFriendListRepository: vi.fn().mockImplementation(() => {
      return {
        findByUserId: vi
          .fn()
          .mockResolvedValue(
            UserFriendList.reconstitute(
              "user-01",
              [],
              [
                FriendRequest.reconstitute(
                  "req-02",
                  "user-01",
                  "user-02",
                  RequestStatus.PENDING,
                  new Date(),
                ),
              ],
              [],
            ),
          ),
      };
    }),
  };
});

describe("Friend Actions Tests", () => {
  describe("getSentInvitations", () => {
    it("Should return sent inviations for users and friend-requests", async () => {
      const invitations = await getSentInvitations("user-id");
      expect(invitations).toHaveLength(2);
    });
  });
});
