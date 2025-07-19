import { User } from "../entities/User";

import { Email } from "../value-objects/Email";
import { DomainService } from "../../shared/DomainService";
import { IEventDispatcher } from "../../shared/EventDispatcher";
import { UserFriendList } from "../entities/UserFriendList";
import { UUID } from "../../shared";

/**
 * User Repository Interface
 * Defines the contract for user persistence operations
 */
export interface IUserRepository {
  findById(id: UUID): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  save(user: User): Promise<void>;
  exists(email: Email): Promise<boolean>;
}

/**
 * Friend List Repository Interface
 * Defines the contract for friend list persistence operations
 */
export interface IFriendListRepository {
  findByUserId(userId: UUID): Promise<UserFriendList | null>;
  save(friendList: UserFriendList): Promise<void>;
}

/**
 * User Domain Service
 * Handles complex business operations that involve multiple aggregates
 */
export class UserService extends DomainService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly friendListRepository: IFriendListRepository,
    eventDispatcher?: IEventDispatcher,
  ) {
    super(eventDispatcher);
  }

  /**
   * Creates a new user and initializes their friend list
   */
  async createUser(
    email: Email,
    firstName: string,
    lastName: string,
  ): Promise<User> {
    if (await this.userRepository.findByEmail(email)) {
      throw new Error("User with this email already exists");
    }

    const user = new User(email, firstName, lastName);
    await this.userRepository.save(user);

    const friendList = UserFriendList.create(user.id);
    await this.friendListRepository.save(friendList);

    // Dispatch collected domain events if everything was successfull
    await this.dispatchDomainEvents(user);

    return user;
  }

  async sendFriendRequest(senderId: UUID, receiverEmail: Email): Promise<void> {
    const sender = await this.userRepository.findById(senderId);
    if (!sender) {
      throw new Error("Sender not found");
    }

    if (!sender.canSendFriendRequests()) {
      throw new Error("Sender cannot send friend requests");
    }

    const receiver = await this.userRepository.findByEmail(receiverEmail);
    if (!receiver) {
      throw new Error(
        "User with this email does not exist. Consider sending an invitation request.",
      );
    }

    const senderFriendList =
      await this.friendListRepository.findByUserId(senderId);
    if (!senderFriendList) {
      throw new Error("Sender friend list not found");
    }

    const receiverFriendList = await this.friendListRepository.findByUserId(
      receiver.id,
    );
    if (!receiverFriendList) {
      throw new Error("Receiver friend list not found");
    }

    const friendRequest = senderFriendList.sendFriendRequest(receiver);
    receiverFriendList.receiveFriendRequest(friendRequest);

    await this.friendListRepository.save(senderFriendList);
    await this.friendListRepository.save(receiverFriendList);
  }

  /**
   * Handles friend request approval and establishes mutual friendship
   */
  async approveFriendRequest(
    receiverId: UUID,
    requestId: string,
  ): Promise<void> {
    const receiverFriendList =
      await this.friendListRepository.findByUserId(receiverId);
    if (!receiverFriendList) {
      throw new Error("Receiver friend list not found");
    }

    const friendRequest = receiverFriendList.getFriendRequest(requestId);
    if (!friendRequest) {
      throw new Error("Friend request not found");
    }

    const senderFriendList = await this.friendListRepository.findByUserId(
      friendRequest.senderId,
    );
    if (!senderFriendList) {
      throw new Error("Sender friend list not found");
    }

    receiverFriendList.approveFriendRequest(requestId);
    senderFriendList.addFriend(receiverId);

    await this.friendListRepository.save(receiverFriendList);
    await this.friendListRepository.save(senderFriendList);
  }

  /**
   * Handles friend removal and ensures mutual removal
   */
  async removeFriend(userId: UUID, friendId: UUID): Promise<void> {
    // Get user's friend list
    const userFriendList = await this.friendListRepository.findByUserId(userId);
    if (!userFriendList) {
      throw new Error("User friend list not found");
    }

    const friendFriendList =
      await this.friendListRepository.findByUserId(friendId);
    if (!friendFriendList) {
      throw new Error("Friend friend list not found");
    }

    userFriendList.removeFriend(friendId);

    if (friendFriendList.isFriend(userId)) {
      friendFriendList.removeFriend(userId);
    }

    await this.friendListRepository.save(userFriendList);
    await this.friendListRepository.save(friendFriendList);
  }

  async userExists(email: Email): Promise<boolean> {
    return await this.userRepository.exists(email);
  }

  async canCreateBetRequest(userId: UUID): Promise<boolean> {
    const friendList = await this.friendListRepository.findByUserId(userId);
    if (!friendList) {
      return false;
    }

    return friendList.canCreateBetRequest();
  }

  async getUserFriendsWithDetails(userId: UUID): Promise<User[]> {
    const friendList = await this.friendListRepository.findByUserId(userId);
    if (!friendList) {
      throw new Error("Friend list not found");
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
