import { User } from '../entities/User';
import { FriendList } from '../aggregates/FriendList';
import { Email } from '../value-objects/Email';
import { UserName } from '../value-objects/UserName';
import { UserId } from '../value-objects/UserId';

/**
 * User Repository Interface
 * Defines the contract for user persistence operations
 */
export interface IUserRepository {
  findById(id: UserId): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  save(user: User): Promise<void>;
  exists(email: Email): Promise<boolean>;
}

/**
 * Friend List Repository Interface
 * Defines the contract for friend list persistence operations
 */
export interface IFriendListRepository {
  findByUserId(userId: UserId): Promise<FriendList | null>;
  save(friendList: FriendList): Promise<void>;
}

/**
 * User Domain Service
 * Handles complex business operations that involve multiple aggregates
 */
export class UserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly friendListRepository: IFriendListRepository
  ) {}

  /**
   * Creates a new user and initializes their friend list
   */
  async createUser(email: Email, name: UserName): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create new user
    const user = User.create(email, name);
    await this.userRepository.save(user);

    // Initialize friend list for the new user
    const friendList = FriendList.create(user.id);
    await this.friendListRepository.save(friendList);

    return user;
  }

  /**
   * Handles the complete friend request process between two users
   */
  async sendFriendRequest(senderId: UserId, receiverEmail: Email): Promise<void> {
    // Find sender
    const sender = await this.userRepository.findById(senderId);
    if (!sender) {
      throw new Error('Sender not found');
    }

    if (!sender.canSendFriendRequests()) {
      throw new Error('Sender cannot send friend requests');
    }

    // Find receiver
    const receiver = await this.userRepository.findByEmail(receiverEmail);
    if (!receiver) {
      throw new Error('User with this email does not exist. Consider sending an invitation request.');
    }

    // Get sender's friend list
    const senderFriendList = await this.friendListRepository.findByUserId(senderId);
    if (!senderFriendList) {
      throw new Error('Sender friend list not found');
    }

    // Get receiver's friend list
    const receiverFriendList = await this.friendListRepository.findByUserId(receiver.id);
    if (!receiverFriendList) {
      throw new Error('Receiver friend list not found');
    }

    // Send friend request
    const friendRequest = senderFriendList.sendFriendRequest(receiver);
    receiverFriendList.receiveFriendRequest(friendRequest);

    // Save both friend lists
    await this.friendListRepository.save(senderFriendList);
    await this.friendListRepository.save(receiverFriendList);
  }

  /**
   * Handles friend request approval and establishes mutual friendship
   */
  async approveFriendRequest(receiverId: UserId, requestId: string): Promise<void> {
    // Get receiver's friend list
    const receiverFriendList = await this.friendListRepository.findByUserId(receiverId);
    if (!receiverFriendList) {
      throw new Error('Receiver friend list not found');
    }

    // Get the friend request to find the sender
    const friendRequest = receiverFriendList.getFriendRequest(requestId);
    if (!friendRequest) {
      throw new Error('Friend request not found');
    }

    // Get sender's friend list
    const senderFriendList = await this.friendListRepository.findByUserId(friendRequest.senderId);
    if (!senderFriendList) {
      throw new Error('Sender friend list not found');
    }

    // Approve the request (this adds the sender to receiver's friend list)
    receiverFriendList.approveFriendRequest(requestId);

    // Add receiver to sender's friend list (mutual friendship)
    senderFriendList.addFriend(receiverId);

    // Save both friend lists
    await this.friendListRepository.save(receiverFriendList);
    await this.friendListRepository.save(senderFriendList);
  }

  /**
   * Handles friend removal and ensures mutual removal
   */
  async removeFriend(userId: UserId, friendId: UserId): Promise<void> {
    // Get user's friend list
    const userFriendList = await this.friendListRepository.findByUserId(userId);
    if (!userFriendList) {
      throw new Error('User friend list not found');
    }

    // Get friend's friend list
    const friendFriendList = await this.friendListRepository.findByUserId(friendId);
    if (!friendFriendList) {
      throw new Error('Friend friend list not found');
    }

    // Remove friend from user's list
    userFriendList.removeFriend(friendId);

    // Remove user from friend's list (mutual removal)
    if (friendFriendList.isFriend(userId)) {
      friendFriendList.removeFriend(userId);
    }

    // Save both friend lists
    await this.friendListRepository.save(userFriendList);
    await this.friendListRepository.save(friendFriendList);
  }

  /**
   * Checks if a user exists by email
   */
  async userExists(email: Email): Promise<boolean> {
    return await this.userRepository.exists(email);
  }

  /**
   * Validates if a user can create bet requests (has at least one friend)
   */
  async canCreateBetRequest(userId: UserId): Promise<boolean> {
    const friendList = await this.friendListRepository.findByUserId(userId);
    if (!friendList) {
      return false;
    }

    return friendList.canCreateBetRequest();
  }

  /**
   * Gets a user's friend list with full user details
   */
  async getUserFriendsWithDetails(userId: UserId): Promise<User[]> {
    const friendList = await this.friendListRepository.findByUserId(userId);
    if (!friendList) {
      throw new Error('Friend list not found');
    }

    const friends: User[] = [];
    for (const friendId of friendList.friends) {
      const friend = await this.userRepository.findById(friendId);
      if (friend) {
        friends.push(friend);
      }
    }

    return friends;
  }
}
