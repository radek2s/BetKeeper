import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserService, IUserRepository, IFriendListRepository } from '../UserService';
import { User } from '../../entities/User';
import { FriendList } from '../../aggregates/FriendList';
import { UserId } from '../../value-objects/UserId';
import { Email } from '../../value-objects/Email';
import { UserName } from '../../value-objects/UserName';
import { UserStatus } from '../../types/RequestStatus';

describe('UserService', () => {
  let userService: UserService;
  let mockUserRepository: IUserRepository;
  let mockFriendListRepository: IFriendListRepository;

  beforeEach(() => {
    mockUserRepository = {
      findById: vi.fn(),
      findByEmail: vi.fn(),
      save: vi.fn(),
      exists: vi.fn()
    };

    mockFriendListRepository = {
      findByUserId: vi.fn(),
      save: vi.fn()
    };

    userService = new UserService(mockUserRepository, mockFriendListRepository);
  });

  describe('createUser', () => {
    it('should create a new user and initialize friend list', async () => {
      const email = new Email('test@example.com');
      const name = new UserName('Test User');

      vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null);
      vi.mocked(mockUserRepository.save).mockResolvedValue();
      vi.mocked(mockFriendListRepository.save).mockResolvedValue();

      const user = await userService.createUser(email, name);

      expect(user.email).toBe(email);
      expect(user.name).toBe(name);
      expect(mockUserRepository.save).toHaveBeenCalledWith(user);
      expect(mockFriendListRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ userId: user.id })
      );
    });

    it('should throw error when user already exists', async () => {
      const email = new Email('test@example.com');
      const name = new UserName('Test User');
      const existingUser = User.create(email, name);

      vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(existingUser);

      await expect(userService.createUser(email, name))
        .rejects.toThrow('User with this email already exists');
    });
  });

  describe('sendFriendRequest', () => {
    it('should send friend request between two users', async () => {
      const senderId = new UserId('sender_123');
      const receiverEmail = new Email('receiver@example.com');
      
      const sender = new User(senderId, new Email('sender@example.com'), new UserName('Sender'), UserStatus.ACTIVE);
      const receiver = new User(new UserId('receiver_123'), receiverEmail, new UserName('Receiver'), UserStatus.ACTIVE);
      
      const senderFriendList = FriendList.create(senderId);
      const receiverFriendList = FriendList.create(receiver.id);

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

    it('should throw error when sender not found', async () => {
      const senderId = new UserId('sender_123');
      const receiverEmail = new Email('receiver@example.com');

      vi.mocked(mockUserRepository.findById).mockResolvedValue(null);

      await expect(userService.sendFriendRequest(senderId, receiverEmail))
        .rejects.toThrow('Sender not found');
    });

    it('should throw error when receiver not found', async () => {
      const senderId = new UserId('sender_123');
      const receiverEmail = new Email('receiver@example.com');
      const sender = new User(senderId, new Email('sender@example.com'), new UserName('Sender'), UserStatus.ACTIVE);

      vi.mocked(mockUserRepository.findById).mockResolvedValue(sender);
      vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null);

      await expect(userService.sendFriendRequest(senderId, receiverEmail))
        .rejects.toThrow('User with this email does not exist. Consider sending an invitation request.');
    });
  });

  describe('approveFriendRequest', () => {
    it('should approve friend request and establish mutual friendship', async () => {
      const receiverId = new UserId('receiver_123');
      const senderId = new UserId('sender_123');
      const requestId = 'request_123';

      const receiverFriendList = FriendList.create(receiverId);
      const senderFriendList = FriendList.create(senderId);
      
      // Create and add a friend request to receiver's list
      const friendRequest = senderFriendList.sendFriendRequest(
        new User(receiverId, new Email('receiver@example.com'), new UserName('Receiver'), UserStatus.ACTIVE)
      );
      receiverFriendList.receiveFriendRequest(friendRequest);

      vi.mocked(mockFriendListRepository.findByUserId)
        .mockResolvedValueOnce(receiverFriendList)
        .mockResolvedValueOnce(senderFriendList);
      vi.mocked(mockFriendListRepository.save).mockResolvedValue();

      await userService.approveFriendRequest(receiverId, friendRequest.id.value);

      expect(receiverFriendList.isFriend(senderId)).toBe(true);
      expect(senderFriendList.isFriend(receiverId)).toBe(true);
      expect(mockFriendListRepository.save).toHaveBeenCalledTimes(2);
    });

    it('should throw error when friend request not found', async () => {
      const receiverId = new UserId('receiver_123');
      const receiverFriendList = FriendList.create(receiverId);

      vi.mocked(mockFriendListRepository.findByUserId).mockResolvedValue(receiverFriendList);

      await expect(userService.approveFriendRequest(receiverId, 'non-existent'))
        .rejects.toThrow('Friend request not found');
    });
  });

  describe('removeFriend', () => {
    it('should remove friend from both users friend lists', async () => {
      const userId = new UserId('user_123');
      const friendId = new UserId('friend_123');

      const userFriendList = FriendList.create(userId);
      const friendFriendList = FriendList.create(friendId);
      
      // Add mutual friendship
      userFriendList.addFriend(friendId);
      friendFriendList.addFriend(userId);

      vi.mocked(mockFriendListRepository.findByUserId)
        .mockResolvedValueOnce(userFriendList)
        .mockResolvedValueOnce(friendFriendList);
      vi.mocked(mockFriendListRepository.save).mockResolvedValue();

      await userService.removeFriend(userId, friendId);

      expect(userFriendList.isFriend(friendId)).toBe(false);
      expect(friendFriendList.isFriend(userId)).toBe(false);
      expect(mockFriendListRepository.save).toHaveBeenCalledTimes(2);
    });
  });

  describe('canCreateBetRequest', () => {
    it('should return true when user has friends', async () => {
      const userId = new UserId('user_123');
      const friendList = FriendList.create(userId);
      friendList.addFriend(new UserId('friend_123'));

      vi.mocked(mockFriendListRepository.findByUserId).mockResolvedValue(friendList);

      const result = await userService.canCreateBetRequest(userId);

      expect(result).toBe(true);
    });

    it('should return false when user has no friends', async () => {
      const userId = new UserId('user_123');
      const friendList = FriendList.create(userId);

      vi.mocked(mockFriendListRepository.findByUserId).mockResolvedValue(friendList);

      const result = await userService.canCreateBetRequest(userId);

      expect(result).toBe(false);
    });

    it('should return false when friend list not found', async () => {
      const userId = new UserId('user_123');

      vi.mocked(mockFriendListRepository.findByUserId).mockResolvedValue(null);

      const result = await userService.canCreateBetRequest(userId);

      expect(result).toBe(false);
    });
  });

  describe('getUserFriendsWithDetails', () => {
    it('should return friends with full user details', async () => {
      const userId = new UserId('user_123');
      const friendId = new UserId('friend_123');
      
      const friendList = FriendList.create(userId);
      friendList.addFriend(friendId);
      
      const friend = new User(friendId, new Email('friend@example.com'), new UserName('Friend'), UserStatus.ACTIVE);

      vi.mocked(mockFriendListRepository.findByUserId).mockResolvedValue(friendList);
      vi.mocked(mockUserRepository.findById).mockResolvedValue(friend);

      const friends = await userService.getUserFriendsWithDetails(userId);

      expect(friends).toHaveLength(1);
      expect(friends[0]).toBe(friend);
    });

    it('should throw error when friend list not found', async () => {
      const userId = new UserId('user_123');

      vi.mocked(mockFriendListRepository.findByUserId).mockResolvedValue(null);

      await expect(userService.getUserFriendsWithDetails(userId))
        .rejects.toThrow('Friend list not found');
    });
  });
});
