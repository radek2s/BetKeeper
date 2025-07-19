import { Email } from "@domain/user/value-objects";
import { UserService } from "../UserService";
import { InMemoryUserRepository } from "@bet-keeper/domain/test/mocks/InMemoryUserRepository";
import { InMemoryFriendListRepository } from "@bet-keeper/domain/test/mocks/InMemoryFriendListRepository";
import { EventDispatcherMock } from "@bet-keeper/domain/test/mocks/EventDispatcherMock";
import { DomainEvent } from "@domain/user/events/DomainEvent";
import { UserCreatedEvent } from "@domain/user/events/UserCreatedEvent";

describe("User UseCases", () => {
  let userService: UserService;
  let userRepository = new InMemoryUserRepository();
  let userFreindListRepository = new InMemoryFriendListRepository();
  let eventDispatcher = new EventDispatcherMock();

  it("Should create a new user", async () => {
    let emitedEvent: DomainEvent | null = null;
    const eventHandler = (event: DomainEvent) => {
      emitedEvent = event;
    };
    eventDispatcher.addHandler(eventHandler);

    userService = new UserService(
      userRepository,
      userFreindListRepository,
      eventDispatcher,
    );

    await userService.createUser(new Email("test@example.com"), "Test", "User");

    expect(emitedEvent).toBeInstanceOf(UserCreatedEvent);
  });
});
