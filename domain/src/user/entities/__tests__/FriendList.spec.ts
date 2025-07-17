/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */
import { describe, it, expect, beforeEach } from "vitest";

import { User } from "../../entities/User";
import { Email } from "../../value-objects/Email";
import { UserStatus } from "../../types/RequestStatus";
import { FriendRemovedEvent } from "../../events/FriendRequestEvents";
import { UUID } from "../../../shared/Uuid";
import { UserFriendList } from "../UserFriendList";

describe("FriendList", () => {
  let userId: UUID;
  let friendList: UserFriendList;
  let targetUser: User;

  beforeEach(() => {
    userId = "dee009ab-a335-44d9-baa7-31293d4db194";

    friendList = new UserFriendList(userId);
    targetUser = new User(
      new Email("target@example.com"),
      "Target",
      "User",
      UserStatus.ACTIVE,
      undefined,
      "a9404e77-befb-4c57-bb32-38490aa2eeb3",
    );
  });

  describe("constructor", () => {
    it("should create a friend list for a user", () => {
      expect(friendList.userId).toBe(userId);
      expect(friendList.friends).toHaveLength(0);
      expect(friendList.friendCount).toBe(0);
      expect(friendList.sentFriendRequests).toHaveLength(0);
      expect(friendList.receivedFriendRequests).toHaveLength(0);
      expect(friendList.sentInvitationRequests).toHaveLength(0);
    });
  });

  describe("sendFriendRequest", () => {
    it("should send a friend request to a valid user", () => {
      const friendRequest = friendList.sendFriendRequest(targetUser);

      expect(friendRequest.senderId).toBe(userId);
      expect(friendRequest.receiverId).toBe(targetUser.id);
      expect(friendList.sentFriendRequests).toHaveLength(1);
      expect(friendList.domainEvents).toHaveLength(1);
    });

    it("should throw error when target user cannot receive friend requests", () => {
      const suspendedUser = new User(
        new Email("suspended@example.com"),
        "Suspended",
        "User",
        UserStatus.SUSPENDED,
        undefined,
        "user_suspended",
      );

      expect(() => friendList.sendFriendRequest(suspendedUser)).toThrow(
        "Target user cannot receive friend requests",
      );
    });

    it("should throw error when user is already a friend", () => {
      friendList.addFriend(targetUser.id);

      expect(() => friendList.sendFriendRequest(targetUser)).toThrow(
        "User is already a friend",
      );
    });

    it("should throw error when friend request already sent", () => {
      friendList.sendFriendRequest(targetUser);

      expect(() => friendList.sendFriendRequest(targetUser)).toThrow(
        "Friend request already sent to this user",
      );
    });
  });

  describe("receiveFriendRequest", () => {
    it("should receive a friend request", () => {
      const senderFriendList = new UserFriendList(targetUser.id);
      const friendRequest = senderFriendList.sendFriendRequest(
        new User(
          new Email("user@example.com"),
          "User",
          "Demo",
          UserStatus.ACTIVE,
          undefined,
          userId,
        ),
      );

      friendList.receiveFriendRequest(friendRequest);

      expect(friendList.receivedFriendRequests).toHaveLength(1);
      expect(friendList.pendingReceivedRequests).toHaveLength(1);
    });

    it("should throw error when friend request is not for this user", () => {
      const otherUserId = "user_other";
      const senderFriendList = new UserFriendList(targetUser.id);
      const friendRequest = senderFriendList.sendFriendRequest(
        new User(
          new Email("other@example.com"),
          "Other",
          "Demo",
          UserStatus.ACTIVE,
          undefined,
          otherUserId,
        ),
      );

      expect(() => friendList.receiveFriendRequest(friendRequest)).toThrow(
        "Friend request is not for this user",
      );
    });
  });

  describe("approveFriendRequest", () => {
    it("should approve a friend request and add friend", () => {
      const senderFriendList = new UserFriendList(targetUser.id);
      const friendRequest = senderFriendList.sendFriendRequest(
        new User(
          new Email("user@example.com"),
          "User",
          "Demo",
          UserStatus.ACTIVE,
          undefined,
          userId,
        ),
      );
      friendList.receiveFriendRequest(friendRequest);

      friendList.approveFriendRequest(friendRequest.id);

      expect(friendList.isFriend(targetUser.id)).toBe(true);
      expect(friendList.friendCount).toBe(1);
      expect(friendList.domainEvents.length).toBeGreaterThan(0);
    });

    it("should throw error when friend request not found", () => {
      expect(() => friendList.approveFriendRequest("non-existent")).toThrow(
        "Friend request not found",
      );
    });
  });

  describe("rejectFriendRequest", () => {
    it("should reject a friend request", () => {
      const senderFriendList = new UserFriendList(targetUser.id);
      const friendRequest = senderFriendList.sendFriendRequest(
        new User(
          new Email("user@example.com"),
          "User",
          "Demo",
          UserStatus.ACTIVE,
          undefined,
          userId,
        ),
      );
      friendList.receiveFriendRequest(friendRequest);

      friendList.rejectFriendRequest(friendRequest.id);

      expect(friendList.isFriend(targetUser.id)).toBe(false);
      expect(friendList.domainEvents.length).toBeGreaterThan(0);
    });

    it("should throw error when friend request not found", () => {
      expect(() => friendList.rejectFriendRequest("non-existent")).toThrow(
        "Friend request not found",
      );
    });
  });

  describe("addFriend", () => {
    it("should add a friend to the list", () => {
      friendList.addFriend(targetUser.id);

      expect(friendList.isFriend(targetUser.id)).toBe(true);
      expect(friendList.friendCount).toBe(1);
      expect(friendList.friends).toContain(targetUser.id);
    });

    it("should throw error when trying to add yourself as friend", () => {
      expect(() => friendList.addFriend(userId)).toThrow(
        "Cannot add yourself as a friend",
      );
    });

    it("should not add duplicate friends", () => {
      friendList.addFriend(targetUser.id);
      friendList.addFriend(targetUser.id); // Should not throw or duplicate

      expect(friendList.friendCount).toBe(1);
    });
  });

  describe("removeFriend", () => {
    it("should remove a friend from the list", () => {
      friendList.addFriend(targetUser.id);
      friendList.clearDomainEvents();

      friendList.removeFriend(targetUser.id);

      expect(friendList.isFriend(targetUser.id)).toBe(false);
      expect(friendList.friendCount).toBe(0);

      const events = friendList.domainEvents;
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(FriendRemovedEvent);
    });

    it("should throw error when user is not in friend list", () => {
      expect(() => friendList.removeFriend(targetUser.id)).toThrow(
        "User is not in friend list",
      );
    });
  });

  describe("sendInvitationRequest", () => {
    it("should send an invitation request for a new email", () => {
      const inviteeEmail = new Email("newuser@example.com");

      const invitationRequest = friendList.sendInvitationRequest(inviteeEmail);

      expect(invitationRequest.requesterId).toBe(userId);
      expect(invitationRequest.inviteeEmail).toBe(inviteeEmail);
      expect(friendList.sentInvitationRequests).toHaveLength(1);
      expect(friendList.domainEvents.length).toBeGreaterThan(0);
    });

    it("should throw error when invitation request already sent for email", () => {
      const inviteeEmail = new Email("newuser@example.com");
      friendList.sendInvitationRequest(inviteeEmail);

      expect(() => friendList.sendInvitationRequest(inviteeEmail)).toThrow(
        "Invitation request already sent for this email",
      );
    });
  });

  describe("query methods", () => {
    beforeEach(() => {
      friendList.addFriend(targetUser.id);
    });

    it("should correctly identify friends", () => {
      expect(friendList.isFriend(targetUser.id)).toBe(true);
      expect(friendList.isFriend("non-friend")).toBe(false);
    });

    it("should correctly identify pending friend requests", () => {
      const anotherUser = new User(
        new Email("another@example.com"),
        "Another",
        "User",
        UserStatus.ACTIVE,
        undefined,
        "user_another",
      );

      friendList.sendFriendRequest(anotherUser);

      expect(friendList.hasPendingFriendRequestTo(anotherUser.id)).toBe(true);
      expect(friendList.hasPendingFriendRequestTo("non-existent")).toBe(false);
    });

    it("should correctly identify pending invitation requests", () => {
      const inviteeEmail = new Email("newuser@example.com");
      friendList.sendInvitationRequest(inviteeEmail);

      expect(friendList.hasPendingInvitationRequestFor(inviteeEmail)).toBe(
        true,
      );
      expect(
        friendList.hasPendingInvitationRequestFor(
          new Email("other@example.com"),
        ),
      ).toBe(false);
    });
  });

  describe("business rules", () => {
    it("should allow bet request creation when user has friends", () => {
      friendList.addFriend(targetUser.id);

      expect(friendList.canCreateBetRequest()).toBe(true);
    });

    it("should not allow bet request creation when user has no friends", () => {
      expect(friendList.canCreateBetRequest()).toBe(false);
    });
  });

  describe("factory methods", () => {
    describe("create", () => {
      it("should create a new friend list for a user", () => {
        const newFriendList = UserFriendList.create(userId);

        expect(newFriendList.userId).toBe(userId);
        expect(newFriendList.friendCount).toBe(0);
      });
    });

    describe("reconstitute", () => {
      it("should reconstitute a friend list from persistence data", () => {
        const friends = [targetUser.id];
        const sentRequests: any[] = [];
        const receivedRequests: any[] = [];
        const invitationRequests: any[] = [];

        const reconstitutedList = UserFriendList.reconstitute(
          userId,
          friends,
          sentRequests,
          receivedRequests,
          invitationRequests,
        );

        expect(reconstitutedList.userId).toBe(userId);
        expect(reconstitutedList.friendCount).toBe(1);
        expect(reconstitutedList.isFriend(targetUser.id)).toBe(true);
      });
    });
  });

  describe("toString", () => {
    it("should return string representation", () => {
      friendList.addFriend(targetUser.id);

      expect(friendList.toString()).toBe(
        `FriendList(${friendList.id}, 1 friends)`,
      );
    });
  });
});
