import { Email, User, UserService } from "@domain/user";
import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryUserRepository } from "../mocks/InMemoryUserRepository";
import { InMemoryUserRequestRepository } from "../mocks/InMemoryUserRequestRepository";
import { InMemoryFriendListRepository } from "../mocks/InMemoryFriendListRepository";
import { EventDispatcherMock } from "../mocks/EventDispatcherMock";

describe("Bet Creation by User", async () => {
  let userRepository = new InMemoryUserRepository();
  let userRequestRepository = new InMemoryUserRequestRepository();
  let userFriendListRepository = new InMemoryFriendListRepository();
  let eventDispatcher = new EventDispatcherMock();

  let userService = new UserService(
    userRepository,
    userRequestRepository,
    userFriendListRepository,
    eventDispatcher,
  );

  let user = await userService.createUser(
    new Email("user@example.com"),
    "User",
    "Testing",
  );
  let friend = await userService.createUser(
    new Email("friend@example.com"),
    "Friend",
    "Testing",
  );

  user.activate();
  friend.activate();

  userRepository.save(user);
  userRepository.save(friend);

  userService.sendFriendRequest(user.id, friend.email);
  const friendList = await userFriendListRepository.findByUserId(friend.id);

  if (friendList == null) {
    throw new Error("Friend list not found");
  }

  const invitationRequest = friendList.receivedFriendRequests[0];
  await userService.approveFriendRequest(friend.id, invitationRequest.id);

  it("User should create bet request", async () => {
    //TODO: Implement tes
  });
});
