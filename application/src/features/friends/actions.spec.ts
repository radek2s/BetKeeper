import { AuthorizedUser } from "@app/lib/user/AuthorizedUser";
import { validateToken } from "@app/server/auth/authentication";
import NextUserRepository from "@app/server/repositories/NextUserRepository";
import { NextUserService } from "@app/server/services/NextUserService";
import { Email, FriendRequest, UserFriendList } from "@domain/user";
import { expect, type Mock, vi } from "vitest";
import { createUserRequest } from "../users/actions";
import {
  approveFriendRequest,
  cancelRequest,
  getSentInvitations,
  rejectFriendRequest,
  removeFriend,
  sendFriendRequest,
} from "./actions";

vi.mock("@app/server/auth/authentication", () => ({
  validateToken: vi.fn(),
}));
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));
vi.mock("../users/actions", () => ({
  createUserRequest: vi.fn(),
}));
vi.spyOn(NextUserService, "userExists");

describe("Friend Actions Tests", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("sendFriendRequest", () => {
    it('Should throw "Invalid email format" when sent "test"', async () => {
      const email = "test";
      await expect(async () => {
        await sendFriendRequest(email, undefined);
      }).rejects.toThrow("Invalid email format");
    });

    it('Should throw "Provided UserId is not allowed"', async () => {
      (validateToken as jest.Mock).mockRejectedValueOnce(
        new Error(
          "Provided UserId=${providerId} is not allowed to use BetKeeper",
        ),
      );

      await expect(async () => {
        await sendFriendRequest("test", "invalid");
      }).rejects.toThrow(
        "Provided UserId=${providerId} is not allowed to use BetKeeper",
      );
    });

    it("Should send friend request when user is in Database", async () => {
      (validateToken as Mock).mockResolvedValue(
        new AuthorizedUser(new Email("user@mock.pl"), "User", "Mock"),
      );
      vi.spyOn(NextUserService, "userExists").mockResolvedValue(true);
      vi.spyOn(NextUserService, "sendFriendRequest").mockResolvedValue(
        new FriendRequest("id", "sender-01", "reciver-01"),
      );
      const sendFn = vi.spyOn(NextUserService, "sendFriendRequest");

      await sendFriendRequest("test@mock.pl", "token");
      await expect(sendFn).toBeCalledTimes(1);
    });

    it("Should send user request when user is not in Database", async () => {
      (validateToken as Mock).mockResolvedValue(
        new AuthorizedUser(new Email("user@mock.pl"), "User", "Mock"),
      );
      const createFn = createUserRequest as Mock;
      vi.spyOn(NextUserService, "userExists").mockResolvedValue(false);

      await sendFriendRequest("test@mock.pl", "token");
      await expect(createFn).toBeCalledTimes(1);
    });
  });

  describe("approveFriendRequest", () => {
    it("Should approve friend request", async () => {
      (validateToken as Mock).mockResolvedValue(
        new AuthorizedUser(new Email("user@mock.pl"), "User", "Mock"),
      );
      vi.spyOn(NextUserService, "approveFriendRequest").mockResolvedValue();
      const approvedFn = vi.spyOn(NextUserService, "approveFriendRequest");
      await approveFriendRequest("request-01", "token");
      expect(approvedFn).toHaveBeenCalledTimes(1);
    });
  });

  describe("rejectFriendRequest", () => {
    it("Should reject friend request", async () => {
      (validateToken as Mock).mockResolvedValue(
        new AuthorizedUser(new Email("user@mock.pl"), "User", "Mock"),
      );
      vi.spyOn(NextUserService, "rejectFriendRequest").mockResolvedValue();
      const rejectedFn = vi.spyOn(NextUserService, "rejectFriendRequest");
      await rejectFriendRequest("request-01", "token");
      expect(rejectedFn).toHaveBeenCalledTimes(1);
    });
  });

  describe("cancelFriendRequest", () => {
    it("Should cancel friend request", async () => {
      (validateToken as Mock).mockResolvedValue(
        new AuthorizedUser(new Email("user@mock.pl"), "User", "Mock"),
      );
      vi.spyOn(NextUserService, "cancelFriendRequest").mockResolvedValue();
      const cancelFn = vi.spyOn(NextUserService, "cancelFriendRequest");
      await cancelRequest("request-01", "token");
      expect(cancelFn).toHaveBeenCalledTimes(1);
    });
  });

  describe("removeFriend", () => {
    it("Should remove friend", async () => {
      (validateToken as Mock).mockResolvedValue(
        new AuthorizedUser(new Email("user@mock.pl"), "User", "Mock"),
      );
      vi.spyOn(NextUserService, "removeFriend").mockResolvedValue();
      const removeFn = vi.spyOn(NextUserService, "removeFriend");
      await removeFriend("request-01", "token");
      expect(removeFn).toHaveBeenCalledTimes(1);
    });
  });
});
