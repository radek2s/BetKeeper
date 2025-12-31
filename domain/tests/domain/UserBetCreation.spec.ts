import type { CommonBetRequest } from "@domain/bet";
import type { BetParticipantTableRecord } from "@domain/bet/persistence/BetParticipantRepository";
import { Email, type User, UserService } from "@domain/user";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  BetRequestActionEvent,
  BetRequestCreatedEvent,
  BetRequestUpdatedEvent,
} from "../../src/bet/events/BetRequestEvents";
import { EventDispatcherMock } from "../mocks/EventDispatcherMock";
import { InMemoryBetParticipantRepository } from "../mocks/InMemoryBetParticipantRepository";
import { InMemoryBetRepository } from "../mocks/InMemoryBetRepository";
import { InMemoryBetService } from "../mocks/InMemoryBetService";
import { InMemoryFriendListRepository } from "../mocks/InMemoryFriendListRepository";
import { InMemoryUserRepository } from "../mocks/InMemoryUserRepository";
import { InMemoryUserRequestRepository } from "../mocks/InMemoryUserRequestRepository";

describe.sequential("User Bet Creation", () => {
  let userRepository: InMemoryUserRepository;
  let userRequestRepository: InMemoryUserRequestRepository;
  let userFriendListRepository: InMemoryFriendListRepository;
  let betRepository: InMemoryBetRepository;
  let betParticipantRepository: InMemoryBetParticipantRepository;
  let eventDispatcher: EventDispatcherMock;
  let userService: UserService;
  let betService: InMemoryBetService;
  let user: User;
  let friend: User;

  beforeEach(async () => {
    // Initialize repositories and services
    userRepository = new InMemoryUserRepository();
    userRequestRepository = new InMemoryUserRequestRepository();
    userFriendListRepository = new InMemoryFriendListRepository();
    betRepository = new InMemoryBetRepository();
    betParticipantRepository = new InMemoryBetParticipantRepository();
    eventDispatcher = new EventDispatcherMock();

    userService = new UserService(
      userRepository,
      userRequestRepository,
      userFriendListRepository,
      eventDispatcher,
    );

    betService = new InMemoryBetService(
      betRepository,
      betParticipantRepository,
      eventDispatcher,
    );

    // Create and activate users
    user = await userService.createUser(
      new Email("user@example.com"),
      "User",
      "Testing",
    );
    friend = await userService.createUser(
      new Email("friend@example.com"),
      "Friend",
      "Testing",
    );

    user.activate();
    friend.activate();

    await userRepository.save(user);
    await userRepository.save(friend);

    // Establish friendship
    await userService.sendFriendRequest(user.id, friend.email);
    const friendList = await userFriendListRepository.findByUserId(friend.id);

    if (friendList == null) {
      throw new Error("Friend list not found");
    }

    const invitationRequest = friendList.receivedFriendRequests[0];
    await userService.approveFriendRequest(friend.id, invitationRequest.id);

    // Clear events from setup
    eventDispatcher.dispatchedEvents = [];
  });

  it("User can create BetRequest and assign his friend", async () => {
    // Arrange
    const title = "Bet summary";
    const terms =
      "Who will win the next football match between Team A and Team B?";
    const stake = "Loser buys dinner for the winner";

    // Act
    const betRequest = (await betService.create(
      title,
      terms,
      user.id,
      [
        {
          userId: user.id,
          claim: "Team A win",
        },
        {
          userId: friend.id,
          claim: "Team B win",
        },
      ],
      stake,
    )) as CommonBetRequest;

    // Assert

    expect(betRequest.creatorId).toBe(user.id);

    expect(betRequest.title).toBe(title);
    expect(betRequest.terms).toBe(terms);
    expect(betRequest.stake).toEqual(stake);

    // Verify event was dispatched
    const createdEvents = eventDispatcher.dispatchedEvents.filter(
      (e) => e instanceof BetRequestCreatedEvent,
    );
    expect(createdEvents).toHaveLength(1);
    const createdEvent = createdEvents[0] as BetRequestCreatedEvent;
    expect(createdEvent.betId).toBe(betRequest.id);
  });

  it("Creator will be able to delete BetRequest", async () => {
    // Arrange
    const title = "Bet summary";
    const terms = "Who will score the first goal in the next match?";

    const betRequest = await betService.create(title, terms, user.id, [
      {
        userId: user.id,
        claim: "Team A",
        stake: "Buy me a coffee",
      },
      {
        userId: friend.id,
        claim: "Team B",
        stake: "Buy me a donut",
      },
    ]);

    eventDispatcher.dispatchedEvents = []; // Clear creation events

    // Act
    await betService.deleteBetRequest(betRequest.id, user.id);

    // Assert
    const deleted = await betRepository.findById(betRequest.id);
    expect(deleted).toBeNull();
  });

  it("Invited friend can reject BetRequest", async () => {
    // Arrange
    const title = "Bet summary";
    const terms = "Who will win the championship this year?";
    const stake = "Winner gets bragging rights for a year";

    const betRequest = await betService.create(
      title,
      terms,
      user.id,
      [
        {
          userId: user.id,
          claim: "Team A win",
        },
        {
          userId: friend.id,
          claim: "Team B win",
        },
      ],
      stake,
    );

    eventDispatcher.dispatchedEvents = []; // Clear creation events

    // Act
    await betService.reject(betRequest.id, friend.id);

    // Assert
    const participant = await betParticipantRepository.findByUserIdAndBetId(
      friend.id,
      betRequest.id,
    );
    expect(participant?.vote).toBe("rejected");
  });

  it("Invited friend can change BetRequest stakes or terms and this should reset given votes", async () => {
    // Arrange
    const title = "Short bet summary";
    const originalTerms = "Who will win the next basketball game?";
    const originalStakes = "Winner gets lunch";

    const betRequest = await betService.create(
      title,
      originalTerms,
      user.id,
      [
        {
          userId: user.id,
          claim: "Team A win",
        },
        {
          userId: friend.id,
          claim: "Team B win",
        },
      ],
      originalStakes,
    );

    // Verify one vote is approved, one is unknown
    let currentUser: undefined | BetParticipantTableRecord,
      friendUser: undefined | BetParticipantTableRecord;
    [currentUser, friendUser] = await betParticipantRepository.findAllByBetId(
      betRequest.id,
    );
    expect(currentUser.vote).toBe("approved");
    expect(friendUser.vote).toBe("unknown");

    eventDispatcher.dispatchedEvents = []; // Clear previous events

    // Act - Friend changes the terms
    const newTerms = "Who will score more points in the basketball game?";

    await betService.updateTerms(betRequest.id, newTerms, friend.id);

    [currentUser, friendUser] = await betParticipantRepository.findAllByBetId(
      betRequest.id,
    );

    expect(currentUser.vote).toBe("unknown");
    expect(friendUser.vote).toBe("unknown");

    // Verify update event was dispatched
    const updatedEvents = eventDispatcher.dispatchedEvents.filter(
      (e) => e instanceof BetRequestUpdatedEvent,
    );
    expect(updatedEvents).toHaveLength(1);
    const updatedEvent = updatedEvents[0] as BetRequestUpdatedEvent;
    expect(updatedEvent.betId).toBe(betRequest.id);

    eventDispatcher.dispatchedEvents = []; // Clear events

    // Act - Friend changes the stakes
    const newStakes = "Gets pizza";
    await betService.updateStakes(betRequest.id, newStakes, friend.id);

    // Assert - Votes should remain reset and stakes should be updated
    [currentUser, friendUser] = await betParticipantRepository.findAllByBetId(
      betRequest.id,
    );
    expect(currentUser.vote).toBe("unknown");
    expect(friendUser.vote).toBe("unknown");

    expect((await betRepository.findById(betRequest.id))?.stake).toBe(
      newStakes,
    );

    // Verify update event was dispatched
    const stakesUpdatedEvents = eventDispatcher.dispatchedEvents.filter(
      (e) => e instanceof BetRequestUpdatedEvent,
    );
    expect(stakesUpdatedEvents).toHaveLength(1);
  });

  it("Invited friend should be able to approve BetRequest (there should be 2 positive votes)", async () => {
    // Arrange
    const title = "Short bet summary";
    const terms = "Who will finish the project first?";
    const stakes = "Winner gets to choose the next team lunch venue";

    const betRequest = await betService.create(
      title,
      terms,
      user.id,
      [
        {
          userId: user.id,
          claim: "Team A win",
        },
        {
          userId: friend.id,
          claim: "Team B win",
        },
      ],
      stakes,
    );

    eventDispatcher.dispatchedEvents = []; // Clear creation events

    // Act - Friend approves (second approval)
    await betService.approve(betRequest.id, friend.id);

    // Assert - Should be approved with both votes
    const currentBetRequest = await betService.getBetRequestById(betRequest.id);
    expect(currentBetRequest.isApproved()).toBeTruthy();

    // Verify approval event was dispatched
    const approvedEvents = eventDispatcher.dispatchedEvents.filter(
      (e) => e instanceof BetRequestActionEvent,
    );
    expect(approvedEvents).toHaveLength(1);
    const approvedEvent = approvedEvents[0] as BetRequestActionEvent;
    expect(approvedEvent.action).toBe("approve");
  });
  it("User can resolve Bet terms", async () => {
    // Arrange
    const testDate = new Date("2025-01-01");
    vi.setSystemTime(testDate);
    const title = "Bet summary";
    const terms = "Who will finish the project first?";
    const stakes = "Winner gets to choose the next team lunch venue";

    const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

    const betRequest = await betService.create(
      title,
      terms,
      user.id,
      [
        {
          userId: user.id,
          claim: "Team A win",
        },
        {
          userId: friend.id,
          claim: "Team B win",
        },
      ],
      stakes,
    );

    eventDispatcher.dispatchedEvents = []; // Clear creation events

    await betService.approve(betRequest.id, friend.id);
    await betService.convertToBet(betRequest.id);

    await betService.resolve(betRequest.id, user.id, user.id, dueDate);

    // Assert - Should be approved with both votes
    const currentBet = await betService.getBetById(betRequest.id);

    expect(currentBet.status).toBe("resolved");
    expect(currentBet.winnerId).toBe(user.id);
    expect(currentBet.isOverdue()).toBe(false);

    const dateAfterDueDate = new Date("2026-01-02");
    vi.setSystemTime(dateAfterDueDate);

    expect(currentBet.isOverdue()).toBe(true);

    vi.useRealTimers();
  });

  it("User can complete Bet and did stakes", async () => {
    // Arrange
    const title = "Bet summary";
    const terms = "Who will finish the project first?";
    const stakes = "Winner gets to choose the next team lunch venue";

    const betRequest = await betService.create(
      title,
      terms,
      user.id,
      [
        {
          userId: user.id,
          claim: "Team A win",
        },
        {
          userId: friend.id,
          claim: "Team B win",
        },
      ],
      stakes,
    );

    eventDispatcher.dispatchedEvents = []; // Clear creation events

    await betService.approve(betRequest.id, friend.id);
    await betService.convertToBet(betRequest.id);
    await betService.resolve(betRequest.id, user.id, user.id);
    await betService.complete(betRequest.id, user.id);

    // Assert - Should be approved with both votes
    const currentBet = await betService.getBetById(betRequest.id);

    expect(currentBet.status).toBe("completed");
  });

  it("Friend should not be able to delete Bet Request", async () => {
    const title = "Bet summary";
    const terms =
      "Who will win the next football match between Team A and Team B?";

    const stakes = "Loser buys dinner for the winner";

    // Act
    const betRequest = await betService.create(
      title,
      terms,
      user.id,
      [
        {
          userId: user.id,
          claim: "Team A win",
        },
        {
          userId: friend.id,
          claim: "Team B win",
        },
      ],
      stakes,
    );
    expect(
      async () => await betService.deleteBetRequest(betRequest.id, friend.id),
    ).rejects.toThrow(/Only creator can delete bet/);
  });
});
