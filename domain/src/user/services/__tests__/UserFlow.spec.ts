import { EventDispatcherMock } from "@bet-keeper/domain/test/mocks/EventDispatcherMock";
import { InMemoryFriendListRepository } from "@bet-keeper/domain/test/mocks/InMemoryFriendListRepository";
import { InMemoryUserRepository } from "@bet-keeper/domain/test/mocks/InMemoryUserRepository";
import { InMemoryUserRequestRepository } from "@bet-keeper/domain/test/mocks/InMemoryUserRequestRepository";
import type { DomainEvent } from "@domain/shared";
import type { User } from "@domain/user/entities";

import { UserCreatedEvent } from "@domain/user/events/UserCreatedEvent";
import { UserStatusChangedEvent } from "@domain/user/events/UserStatusChangedEvent";
import { Email } from "@domain/user/value-objects";
import { UserService } from "../UserService";

describe("User UseCases", () => {
  let userService: UserService;
  const userRepository = new InMemoryUserRepository();
  const userRequestRepository = new InMemoryUserRequestRepository();
  const userFriendListRepository = new InMemoryFriendListRepository();
  const eventDispatcher = new EventDispatcherMock();

  let admin: User;
  let user: User;
  let friend: User;

  it("Should create admin user", async () => {
    let emitedEvent: DomainEvent | null = null;
    const eventHandler = (event: DomainEvent) => {
      emitedEvent = event;
    };
    eventDispatcher.addHandler(eventHandler);

    userService = new UserService(
      userRepository,
      userRequestRepository,
      userFriendListRepository,
      eventDispatcher,
    );

    admin = await userService.createUser(
      new Email("admin@example.com"),
      "Admin",
      "User",
    );

    expect(emitedEvent).toBeInstanceOf(UserCreatedEvent);
  });

  it("Should invite new user", async () => {
    await userService.sendUserRequest(admin.id, new Email("user@example.com"));

    const requests = await userRequestRepository.findAllPending();
    expect(requests).toHaveLength(1);
  });

  it("Should activate user", async () => {
    let emitedEvent: DomainEvent | null = null;
    const eventHandler = (event: DomainEvent) => {
      emitedEvent = event;
    };
    eventDispatcher.addHandler(eventHandler);

    //User Invitation Request should be visible for admin when user does not exists in DB
    const [userRequest] = await userRequestRepository.findAllPending();

    userRequest.approve(admin.id);
    await userRequestRepository.save(userRequest);

    user = await userService.createUser(
      new Email(userRequest.inviteeEmail.value),
      "Admin",
      "User",
    );

    user.activate();
    expect(user.status).toBe("active");

    await eventDispatcher.dispatchAll(user.domainEvents);
    user.clearDomainEvents();

    expect(emitedEvent).toBeInstanceOf(UserStatusChangedEvent);
  });

  //User should be able to add somebody by email to his friend list
  it("Should invite friend", async () => {
    friend = await userService.createUser(
      new Email("friend@example.com"),
      "Mock",
      "User",
    );

    await userService.sendFriendRequest(user.id, friend.email);

    const userFriendList = await userFriendListRepository.findByUserId(user.id);
    expect(userFriendList?.sentFriendRequests).toHaveLength(1);
  });

  //Friend Request should be visible for other user
  it("Should approve friend request", async () => {
    const friendList = await userFriendListRepository.findByUserId(friend.id);

    expect(friendList?.receivedFriendRequests).toHaveLength(1);

    if (friendList == null) {
      throw new Error("Friend list not found");
    }

    const invitationRequest = friendList.receivedFriendRequests[0];

    await userService.approveFriendRequest(friend.id, invitationRequest.id);

    const friends = await userService.getUserFriendsWithDetails(user.id);

    expect(friends).toHaveLength(1);
    expect(friends[0]).toBe(friend);
  });

  it("Should remove friend", async () => {
    await userService.removeFriend(user.id, friend.id);

    const friends = await userService.getUserFriendsWithDetails(user.id);

    expect(friends).toHaveLength(0);
  });
});
