import { describe, it, expect, beforeEach } from "vitest";
import { User } from "../User";
import { Email } from "../../value-objects/Email";

import { UserStatus } from "../../types/RequestStatus";
import { UserCreatedEvent } from "../../events/UserCreatedEvent";
import { UserStatusChangedEvent } from "../../events/UserStatusChangedEvent";
import type { UUID } from "../../../shared/Uuid";
import { generateId } from "../../../shared/Uuid";

describe("User", () => {
  let userId: UUID;
  let email: Email;
  let firstName: string;
  let lastName: string;

  beforeEach(() => {
    userId = "dee009ab-a335-44d9-baa7-31293d4db194";
    email = new Email("test@example.com");
    firstName = "John";
    lastName = "Doe";
  });

  describe("constructor", () => {
    it("should create a user with provided values", () => {
      const user = new User(
        email,
        firstName,
        lastName,
        undefined,
        undefined,
        userId,
      );

      expect(user.id).toBe(userId);
      expect(user.email).toBe(email);
      expect(user.name).toBe(`${firstName} ${lastName}`);
      expect(user.status).toBe(UserStatus.PENDING_ACTIVATION);
    });

    it("should create a user with custom status", () => {
      const user = new User(
        email,
        firstName,
        lastName,
        UserStatus.ACTIVE,
        undefined,
        userId,
      );

      expect(user.status).toBe(UserStatus.ACTIVE);
    });

    it("should raise UserCreatedEvent for new users", () => {
      const user = new User(email, firstName, lastName);

      const events = user.domainEvents;
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(UserCreatedEvent);
      expect((events[0] as UserCreatedEvent).userId).toBe(user.id);
    });

    it("should not raise UserCreatedEvent for reconstituted users", () => {
      const user = new User(
        email,
        firstName,
        lastName,
        UserStatus.ACTIVE,
        undefined,
        userId,
      );

      expect(user.domainEvents).toHaveLength(0);
    });
  });

  describe("activate", () => {
    it("should activate a pending user", () => {
      const user = new User(
        email,
        firstName,
        lastName,
        UserStatus.PENDING_ACTIVATION,
      );

      user.activate();

      expect(user.status).toBe(UserStatus.ACTIVE);

      const events = user.domainEvents;
      const statusChangedEvent = events.find(
        (e) => e instanceof UserStatusChangedEvent,
      ) as UserStatusChangedEvent;
      expect(statusChangedEvent).toBeDefined();
      expect(statusChangedEvent.previousStatus).toBe(
        UserStatus.PENDING_ACTIVATION,
      );
      expect(statusChangedEvent.newStatus).toBe(UserStatus.ACTIVE);
    });

    it("should throw error when activating already active user", () => {
      const user = new User(
        email,
        firstName,
        lastName,
        UserStatus.ACTIVE,
        undefined,
        userId,
      );

      expect(() => user.activate()).toThrow("User is already active");
    });

    it("should throw error when activating suspended user", () => {
      const user = new User(
        email,
        firstName,
        lastName,
        UserStatus.SUSPENDED,
        undefined,
        userId,
      );

      expect(() => user.activate()).toThrow("Cannot activate suspended user");
    });
  });

  describe("deactivate", () => {
    it("should deactivate an active user", () => {
      const user = new User(
        email,
        firstName,
        lastName,
        UserStatus.ACTIVE,
        undefined,
        userId,
      );

      user.deactivate();

      expect(user.status).toBe(UserStatus.INACTIVE);

      const events = user.domainEvents;
      const statusChangedEvent = events.find(
        (e) => e instanceof UserStatusChangedEvent,
      ) as UserStatusChangedEvent;
      expect(statusChangedEvent).toBeDefined();
      expect(statusChangedEvent.previousStatus).toBe(UserStatus.ACTIVE);
      expect(statusChangedEvent.newStatus).toBe(UserStatus.INACTIVE);
    });

    it("should throw error when deactivating already inactive user", () => {
      const user = new User(
        email,
        firstName,
        lastName,
        UserStatus.INACTIVE,
        undefined,
        userId,
      );

      expect(() => user.deactivate()).toThrow("User is already inactive");
    });
  });

  describe("suspend", () => {
    it("should suspend an active user", () => {
      const user = new User(
        email,
        firstName,
        lastName,
        UserStatus.ACTIVE,
        undefined,
        userId,
      );

      user.suspend();

      expect(user.status).toBe(UserStatus.SUSPENDED);

      const events = user.domainEvents;
      const statusChangedEvent = events.find(
        (e) => e instanceof UserStatusChangedEvent,
      ) as UserStatusChangedEvent;
      expect(statusChangedEvent).toBeDefined();
      expect(statusChangedEvent.previousStatus).toBe(UserStatus.ACTIVE);
      expect(statusChangedEvent.newStatus).toBe(UserStatus.SUSPENDED);
    });

    it("should throw error when suspending already suspended user", () => {
      const user = new User(
        email,
        firstName,
        lastName,
        UserStatus.SUSPENDED,
        undefined,
        userId,
      );

      expect(() => user.suspend()).toThrow("User is already suspended");
    });
  });

  describe("updateName", () => {
    it("should update user name", () => {
      const user = new User(
        email,
        firstName,
        lastName,
        undefined,
        undefined,
        userId,
      );
      const [newFirstName, newLastName] = "Jane Doe".split(" ");

      user.updateName(newFirstName, newLastName);

      expect(user.name).toBe(`${newFirstName} ${newLastName}`);
    });

    it("should not update if name is the same", () => {
      const user = new User(
        email,
        firstName,
        lastName,
        undefined,
        undefined,
        userId,
      );

      user.updateName(firstName, lastName);

      expect(user.name).toBe(`${firstName} ${lastName}`);
    });
  });

  describe("updateEmail", () => {
    it("should update user email", () => {
      const user = new User(
        email,
        firstName,
        lastName,
        undefined,
        undefined,
        userId,
      );
      const newEmail = new Email("new@example.com");

      user.updateEmail(newEmail);

      expect(user.email).toBe(newEmail);
    });

    it("should not update if email is the same", () => {
      const user = new User(
        email,
        firstName,
        lastName,
        undefined,
        undefined,
        userId,
      );

      user.updateEmail(email);

      expect(user.email).toBe(email);
    });
  });

  describe("business behavior checks", () => {
    it("should allow active users to receive friend requests", () => {
      const user = new User(
        email,
        firstName,
        lastName,
        UserStatus.ACTIVE,
        undefined,
        userId,
      );

      expect(user.canReceiveFriendRequests()).toBe(true);
    });

    it("should allow pending users to receive friend requests", () => {
      const user = new User(
        email,
        firstName,
        lastName,
        UserStatus.PENDING_ACTIVATION,
        undefined,
        userId,
      );

      expect(user.canReceiveFriendRequests()).toBe(true);
    });

    it("should not allow suspended users to receive friend requests", () => {
      const user = new User(
        email,
        firstName,
        lastName,
        UserStatus.SUSPENDED,
        undefined,
        userId,
      );

      expect(user.canReceiveFriendRequests()).toBe(false);
    });

    it("should only allow active users to send friend requests", () => {
      const activeUser = new User(
        email,
        firstName,
        lastName,
        UserStatus.ACTIVE,
        undefined,
        userId,
      );
      const pendingUser = new User(
        email,
        firstName,
        lastName,
        UserStatus.PENDING_ACTIVATION,
        undefined,
        userId,
      );

      expect(activeUser.canSendFriendRequests()).toBe(true);
      expect(pendingUser.canSendFriendRequests()).toBe(false);
    });

    it("should correctly identify active users", () => {
      const activeUser = new User(
        email,
        firstName,
        lastName,
        UserStatus.ACTIVE,
        undefined,
        userId,
      );
      const inactiveUser = new User(
        email,
        firstName,
        lastName,
        UserStatus.INACTIVE,
        undefined,
        userId,
      );

      expect(activeUser.isActive()).toBe(true);
      expect(inactiveUser.isActive()).toBe(false);
    });
  });

  describe("domain events management", () => {
    it("should clear domain events", () => {
      const user = new User(email, firstName, lastName);

      expect(user.domainEvents).toHaveLength(1);

      user.clearDomainEvents();

      expect(user.domainEvents).toHaveLength(0);
    });
  });

  describe("factory methods", () => {
    describe("create", () => {
      it("should create a new user with generated ID", () => {
        const user = User.create(email, firstName, lastName);

        expect(user.email).toBe(email);
        expect(user.name).toBe(`${firstName} ${lastName}`);
        expect(user.status).toBe(UserStatus.PENDING_ACTIVATION);
        // expect(user.id).toMatch(/^user_/);
      });
    });

    describe("reconstitute", () => {
      it("should reconstitute a user from persistence data", () => {
        const user = User.reconstitute(
          userId,
          email,
          firstName,
          lastName,
          UserStatus.ACTIVE,
          undefined,
        );

        expect(user.id).toBe(userId);
        expect(user.email).toBe(email);
        expect(user.name).toBe(`${firstName} ${lastName}`);
        expect(user.status).toBe(UserStatus.ACTIVE);
        expect(user.domainEvents).toHaveLength(0);
      });
    });
  });

  describe("equality", () => {
    it("should be equal to users with same ID", () => {
      const user1 = new User(
        email,
        firstName,
        lastName,
        undefined,
        undefined,
        userId,
      );
      const user2 = new User(
        new Email("other@example.com"),
        "Other",
        "Name",
        undefined,
        undefined,
        userId,
      );

      expect(user1.equals(user2)).toBe(true);
    });

    it("should not be equal to users with different ID", () => {
      const user1 = new User(
        email,
        firstName,
        lastName,
        undefined,
        undefined,
        userId,
      );
      const user2 = new User(
        email,
        firstName,
        lastName,
        undefined,
        undefined,
        generateId(),
      );

      expect(user1.equals(user2)).toBe(false);
    });
  });

  describe("toString", () => {
    it("should return string representation", () => {
      const user = new User(
        email,
        firstName,
        lastName,
        undefined,
        undefined,
        userId,
      );

      expect(user.toString()).toBe(
        `User(${userId}, test@example.com, John Doe)`,
      );
    });
  });
});
