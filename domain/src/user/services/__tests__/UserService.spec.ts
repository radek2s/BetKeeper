import { InMemoryEventDispatcher } from "@domain/shared";
import { FriendRequest, User, UserFriendList, UserStatus } from "@domain/user";
import { UserCreatedEvent } from "@domain/user/events/UserCreatedEvent";
import { Email } from "@domain/user/value-objects";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  type IFriendListRepository,
  type IUserRepository,
  type IUserRequestRepository,
  UserService,
} from "../UserService";

describe("UserService", () => {
  let userService: UserService;
  let mockUserRepository: IUserRepository;
  let mockUserRequestRepository: IUserRequestRepository;
  let mockFriendListRepository: IFriendListRepository;
  let eventDispatcher: InMemoryEventDispatcher;

  beforeEach(() => {
    mockUserRepository = {
      findById: vi.fn(),
      findByEmail: vi.fn(),
      save: vi.fn(),
      exists: vi.fn(),
    };

    mockFriendListRepository = {
      findByUserId: vi.fn(),
      save: vi.fn(),
      deleteRequest: vi.fn(),
      findRequestById: vi.fn(),
      saveRequest: vi.fn(),
    };

    mockUserRequestRepository = {
      findAllPending: vi.fn(),
      findByUserId: vi.fn(),
      save: vi.fn(),
    };

    eventDispatcher = new InMemoryEventDispatcher();

    userService = new UserService(
      mockUserRepository,
      mockUserRequestRepository,
      mockFriendListRepository,
      eventDispatcher,
    );
  });

  describe("createUser", () => {
    it("should create a new user and initialize friend list", async () => {
      const email = new Email("test@example.com");
      const firstName = "Test";
      const lastName = "User";

      vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null);
      vi.mocked(mockUserRepository.save).mockResolvedValue();
      vi.mocked(mockFriendListRepository.save).mockResolvedValue();

      const user = await userService.createUser(email, firstName, lastName);

      expect(user.email).toBe(email);
      expect(user.name).toBe(`${firstName} ${lastName}`);
      expect(mockUserRepository.save).toHaveBeenCalledWith(user);
      expect(mockFriendListRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ userId: user.id }),
      );

      expect(eventDispatcher.dispatchedEvents).toHaveLength(1);
      expect(eventDispatcher.dispatchedEvents[0]).toBeInstanceOf(
        UserCreatedEvent,
      );
    });

    it("should throw error when user already exists", async () => {
      const email = new Email("test@example.com");
      const firstName = "Test";
      const lastName = "User";
      const existingUser = User.create(email, firstName, lastName);

      vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(existingUser);

      await expect(
        userService.createUser(email, firstName, lastName),
      ).rejects.toThrow("User with this email already exists");

      expect(eventDispatcher.dispatchedEvents).toHaveLength(0);
    });
  });

  describe("sendFriendRequest", () => {
    it("should send friend request between two users", async () => {
      const senderId = "sender_123";
      const receiverEmail = new Email("receiver@example.com");

      const sender = new User(
        new Email("sender@example.com"),
        "Sender",
        "Testing",
        UserStatus.ACTIVE,
        senderId,
      );
      const receiver = new User(
        receiverEmail,
        "Receiver",
        "Testing",
        UserStatus.ACTIVE,
        "receiver_123",
      );

      const senderFriendList = UserFriendList.create(senderId);
      const receiverFriendList = UserFriendList.create(receiver.id);

      vi.mocked(mockUserRepository.findById).mockResolvedValue(sender);
      vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(receiver);
      vi.mocked(mockFriendListRepository.findByUserId)
        .mockResolvedValueOnce(senderFriendList)
        .mockResolvedValueOnce(receiverFriendList);
      vi.mocked(mockFriendListRepository.save).mockResolvedValue();

      await userService.sendFriendRequest(senderId, receiverEmail);

      expect(mockFriendListRepository.save).toHaveBeenCalledTimes(2);
      expect(senderFriendList.sentFriendRequests).toHaveLength(1);
      expect(receiverFriendList.receivedFriendRequests).toHaveLength(1);
    });

    it("should throw error when sender not found", async () => {
      const senderId = "sender_123";
      const receiverEmail = new Email("receiver@example.com");

      vi.mocked(mockUserRepository.findById).mockResolvedValue(null);

      await expect(
        userService.sendFriendRequest(senderId, receiverEmail),
      ).rejects.toThrow("Sender not found");
    });

    it("should throw error when receiver not found", async () => {
      const senderId = "sender_123";
      const receiverEmail = new Email("receiver@example.com");
      const sender = new User(
        new Email("sender@example.com"),
        "Sender",
        "Testing",
        UserStatus.ACTIVE,
        senderId,
      );

      vi.mocked(mockUserRepository.findById).mockResolvedValue(sender);
      vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null);

      await expect(
        userService.sendFriendRequest(senderId, receiverEmail),
      ).rejects.toThrow(
        "User with this email does not exist. Consider sending an invitation request.",
      );
    });
  });

  describe("approveFriendRequest", () => {
    it("should approve friend request and establish mutual friendship", async () => {
      const receiverId = "receiver_123";
      const senderId = "sender_123";

      const receiverFriendList = UserFriendList.create(receiverId);
      const senderFriendList = UserFriendList.create(senderId);

      const friendRequest = senderFriendList.sendFriendRequest(
        new User(
          new Email("receiver@example.com"),
          "Receiver",
          "Testing",
          UserStatus.ACTIVE,
          undefined,
          receiverId,
        ),
      );
      receiverFriendList.receiveFriendRequest(friendRequest);

      vi.mocked(mockFriendListRepository.findByUserId)
        .mockResolvedValueOnce(receiverFriendList)
        .mockResolvedValueOnce(senderFriendList);
      vi.mocked(mockFriendListRepository.save).mockResolvedValue();

      await userService.approveFriendRequest(receiverId, friendRequest.id);

      expect(receiverFriendList.isFriend(senderId)).toBe(true);
      expect(mockFriendListRepository.saveRequest).toHaveBeenCalledTimes(1);
    });

    it("should throw error when friend request not found", async () => {
      const receiverId = "receiver_123";
      const receiverFriendList = UserFriendList.create(receiverId);

      vi.mocked(mockFriendListRepository.findByUserId).mockResolvedValue(
        receiverFriendList,
      );

      await expect(
        userService.approveFriendRequest(receiverId, "non-existent"),
      ).rejects.toThrow("Friend request not found");
    });
  });

  describe("removeFriend", () => {
    it("should remove friend from both users friend lists", async () => {
      const userId = "user_123";
      const friendId = "friend_123";

      const userFriendList = UserFriendList.create(userId);
      const friendFriendList = UserFriendList.create(friendId);
      const targetUser = new User(
        new Email("friend@email.com"),
        "Friend",
        "LastName",
        UserStatus.ACTIVE,
        undefined,
        friendId,
      );
      userFriendList.sendFriendRequest(targetUser);

      // Add mutual friendship
      userFriendList.addFriend(friendId);

      vi.mocked(mockFriendListRepository.findByUserId)
        .mockResolvedValueOnce(userFriendList)
        .mockResolvedValueOnce(friendFriendList);
      vi.mocked(mockFriendListRepository.save).mockResolvedValue();
      vi.mocked(mockFriendListRepository.deleteRequest).mockResolvedValue();

      await userService.removeFriend(userId, friendId);

      expect(userFriendList.isFriend(friendId)).toBe(false);
      expect(friendFriendList.isFriend(userId)).toBe(false);
      expect(mockFriendListRepository.save).toHaveBeenCalledTimes(2);
    });
  });

  describe("canCreateBetRequest", () => {
    it("should return true when user has friends", async () => {
      const userId = "user_123";
      const friendList = UserFriendList.create(userId);
      const request = new FriendRequest("req-1", "friend_123", userId);
      friendList.receiveFriendRequest(request);
      friendList.addFriend("friend_123");

      vi.mocked(mockFriendListRepository.findByUserId).mockResolvedValue(
        friendList,
      );

      const result = await userService.canCreateBetRequest(userId);

      expect(result).toBe(true);
    });

    it("should return false when user has no friends", async () => {
      const userId = "user_123";
      const friendList = UserFriendList.create(userId);

      vi.mocked(mockFriendListRepository.findByUserId).mockResolvedValue(
        friendList,
      );

      const result = await userService.canCreateBetRequest(userId);

      expect(result).toBe(false);
    });

    it("should return false when friend list not found", async () => {
      const userId = "user_123";

      vi.mocked(mockFriendListRepository.findByUserId).mockResolvedValue(null);

      const result = await userService.canCreateBetRequest(userId);

      expect(result).toBe(false);
    });
  });

  describe("getUserFriendsWithDetails", () => {
    it("should return friends with full user details", async () => {
      const userId = "user_123";
      const friendId = "friend_123";

      const friendList = UserFriendList.create(userId);
      const request = new FriendRequest("req-1", friendId, userId);
      friendList.receiveFriendRequest(request);
      friendList.addFriend(friendId);

      const friend = new User(
        new Email("friend@example.com"),
        "Friend",
        "Testing",
        UserStatus.ACTIVE,
        friendId,
      );

      vi.mocked(mockFriendListRepository.findByUserId).mockResolvedValue(
        friendList,
      );
      vi.mocked(mockUserRepository.findById).mockResolvedValue(friend);

      const friends = await userService.getUserFriendsWithDetails(userId);

      expect(friends).toHaveLength(1);
      expect(friends[0]).toBe(friend);
    });

    it("should throw error when friend list not found", async () => {
      const userId = "user_123";

      vi.mocked(mockFriendListRepository.findByUserId).mockResolvedValue(null);

      await expect(
        userService.getUserFriendsWithDetails(userId),
      ).rejects.toThrow("Friend list not found");
    });
  });
});
