import { BetStatus } from "@domain/bet/types/BetStatus";
import { Email, type User, UserService } from "@domain/user";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  BetRequestApprovedEvent,
  BetRequestCreatedEvent,
  BetRequestDeletedEvent,
  BetRequestRejectedEvent,
  BetRequestUpdatedEvent,
} from "../../src/bet/events/BetRequestEvents";
import {
  BetRequestStatus,
  ParticipantVote,
} from "../../src/bet/types/BetRequestStatus";
import {
  CommonStake,
  IndividualStakes,
} from "../../src/bet/value-objects/Stakes";
import { Terms } from "../../src/bet/value-objects/Terms";
import { EventDispatcherMock } from "../mocks/EventDispatcherMock";
import { InMemoryBetAggregateRepository } from "../mocks/InMemoryBetAggregateRepository";
import { InMemoryBetQueryService } from "../mocks/InMemoryBetQueryService";
import { InMemoryBetRepository } from "../mocks/InMemoryBetRepository";
import { InMemoryBetRequestRepository } from "../mocks/InMemoryBetRequestRepository";
import { InMemoryBetService } from "../mocks/InMemoryBetService";
import { InMemoryFriendListRepository } from "../mocks/InMemoryFriendListRepository";
import { InMemoryUserRepository } from "../mocks/InMemoryUserRepository";
import { InMemoryUserRequestRepository } from "../mocks/InMemoryUserRequestRepository";

describe.sequential("User Bet Creation", () => {
  let userRepository: InMemoryUserRepository;
  let userRequestRepository: InMemoryUserRequestRepository;
  let userFriendListRepository: InMemoryFriendListRepository;
  let betAggregateRepository: InMemoryBetAggregateRepository;
  let betQueryService: InMemoryBetQueryService;
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
    const betRequestRepository = new InMemoryBetRequestRepository();
    const betRepository = new InMemoryBetRepository();
    betAggregateRepository = new InMemoryBetAggregateRepository(
      betRequestRepository,
      betRepository,
    );
    betQueryService = new InMemoryBetQueryService(
      betRequestRepository,
      betRepository,
      betAggregateRepository,
    );
    eventDispatcher = new EventDispatcherMock();

    userService = new UserService(
      userRepository,
      userRequestRepository,
      userFriendListRepository,
      eventDispatcher,
    );

    betService = new InMemoryBetService(
      betAggregateRepository,
      betQueryService,
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
    const terms = new Terms(
      "Who will win the next football match between Team A and Team B?",
    );
    const stakes = new CommonStake("Loser buys dinner for the winner");

    // Act
    const betAggregate = await betService.create(
      user.id,
      friend.id,
      title,
      terms,
      stakes,
    );

    // Assert
    expect(betAggregate).toBeDefined();
    expect(betAggregate.betRequest.creatorId).toBe(user.id);
    expect(betAggregate.betRequest.participantId).toBe(friend.id);
    expect(betAggregate.betRequest.title).toBe(title);
    expect(betAggregate.betRequest.terms.value).toBe(terms.value);
    expect(betAggregate.betRequest.stakes).toEqual(stakes);
    expect(betAggregate.betRequest.status).toBe(BetRequestStatus.PENDING);
    expect(betAggregate.betRequest.getParticipantVote(user.id)).toBe(
      ParticipantVote.UNKNOWN,
    );
    expect(betAggregate.betRequest.getParticipantVote(friend.id)).toBe(
      ParticipantVote.UNKNOWN,
    );

    // Verify event was dispatched
    const createdEvents = eventDispatcher.dispatchedEvents.filter(
      (e) => e instanceof BetRequestCreatedEvent,
    );
    expect(createdEvents).toHaveLength(1);
    const createdEvent = createdEvents[0] as BetRequestCreatedEvent;
    expect(createdEvent.betRequestId).toBe(betAggregate.id);
    expect(createdEvent.creatorId).toBe(user.id);
    expect(createdEvent.participantId).toBe(friend.id);
  });

  it("Creator will be able to delete BetRequest", async () => {
    // Arrange
    const title = "Bet summary";
    const terms = new Terms("Who will score the first goal in the next match?");
    const stakes = new IndividualStakes("Buy a coffee", "Buy a donut");

    const betAggregate = await betService.create(
      user.id,
      friend.id,
      title,
      terms,
      stakes,
    );

    eventDispatcher.dispatchedEvents = []; // Clear creation events

    // Act
    await betService.delete(betAggregate.id, user.id);

    // Assert
    const updatedAggregate = await betService.getById(betAggregate.id);
    expect(updatedAggregate?.betRequest.status).toBe(BetRequestStatus.DELETED);
    expect(updatedAggregate?.betRequest.isDeleted()).toBe(true);

    // Verify event was dispatched
    const deletedEvents = eventDispatcher.dispatchedEvents.filter(
      (e) => e instanceof BetRequestDeletedEvent,
    );
    expect(deletedEvents).toHaveLength(1);
    const deletedEvent = deletedEvents[0] as BetRequestDeletedEvent;
    expect(deletedEvent.betRequestId).toBe(betAggregate.id);
    expect(deletedEvent.deletedById).toBe(user.id);
  });

  it("Invited friend can reject BetRequest", async () => {
    // Arrange
    const title = "Bet summary";
    const terms = new Terms("Who will win the championship this year?");
    const stakes = new CommonStake("Winner gets bragging rights for a year");

    const betAggregate = await betService.create(
      user.id,
      friend.id,
      title,
      terms,
      stakes,
    );

    eventDispatcher.dispatchedEvents = []; // Clear creation events

    // Act
    await betService.reject(betAggregate.id, friend.id);

    // Assert
    const updatedAggregate = await betAggregateRepository.findById(
      betAggregate.id,
    );
    expect(updatedAggregate?.betRequest.status).toBe(BetRequestStatus.REJECTED);
    expect(updatedAggregate?.betRequest.isRejected()).toBe(true);
    expect(updatedAggregate?.betRequest.getParticipantVote(friend.id)).toBe(
      ParticipantVote.REJECTED,
    );

    // Verify event was dispatched
    const rejectedEvents = eventDispatcher.dispatchedEvents.filter(
      (e) => e instanceof BetRequestRejectedEvent,
    );
    expect(rejectedEvents).toHaveLength(1);
    const rejectedEvent = rejectedEvents[0] as BetRequestRejectedEvent;
    expect(rejectedEvent.betRequestId).toBe(betAggregate.id);
    expect(rejectedEvent.rejectedById).toBe(friend.id);
  });

  it("Invited friend can change BetRequest stakes or terms and this should reset given votes", async () => {
    // Arrange
    const title = "Short bet summary";
    const originalTerms = new Terms("Who will win the next basketball game?");
    const originalStakes = new CommonStake("Loser pays for lunch");

    const betAggregate = await betService.create(
      user.id,
      friend.id,
      title,
      originalTerms,
      originalStakes,
    );

    // Only one participant approves initially (not both, to avoid creating active bet)
    await betService.approve(betAggregate.id, user.id);

    // Verify one vote is approved, one is unknown
    let currentAggregate = await betAggregateRepository.findById(
      betAggregate.id,
    );
    expect(currentAggregate?.betRequest.getParticipantVote(user.id)).toBe(
      ParticipantVote.APPROVED,
    );
    expect(currentAggregate?.betRequest.getParticipantVote(friend.id)).toBe(
      ParticipantVote.UNKNOWN,
    );
    expect(currentAggregate?.betRequest.status).toBe(BetRequestStatus.PENDING);

    eventDispatcher.dispatchedEvents = []; // Clear previous events

    // Act - Friend changes the terms
    const newTerms = new Terms(
      "Who will score more points in the basketball game?",
    );
    await betService.updateTerms(betAggregate.id, newTerms, friend.id);

    // Assert - Votes should be reset
    currentAggregate = await betAggregateRepository.findById(betAggregate.id);
    expect(currentAggregate?.betRequest.terms.value).toBe(newTerms.value);
    expect(currentAggregate?.betRequest.getParticipantVote(user.id)).toBe(
      ParticipantVote.UNKNOWN,
    );
    expect(currentAggregate?.betRequest.getParticipantVote(friend.id)).toBe(
      ParticipantVote.UNKNOWN,
    );

    // Verify update event was dispatched
    const updatedEvents = eventDispatcher.dispatchedEvents.filter(
      (e) => e instanceof BetRequestUpdatedEvent,
    );
    expect(updatedEvents).toHaveLength(1);
    const updatedEvent = updatedEvents[0] as BetRequestUpdatedEvent;
    expect(updatedEvent.betRequestId).toBe(betAggregate.id);
    expect(updatedEvent.updatedById).toBe(friend.id);

    eventDispatcher.dispatchedEvents = []; // Clear events

    // Act - Friend changes the stakes
    const newStakes = new IndividualStakes("Buy pizza", "Buy soda");
    await betService.updateStakes(betAggregate.id, newStakes, friend.id);

    // Assert - Votes should remain reset and stakes should be updated
    currentAggregate = await betAggregateRepository.findById(betAggregate.id);
    expect(currentAggregate?.betRequest.stakes).toEqual(newStakes);
    expect(currentAggregate?.betRequest.getParticipantVote(user.id)).toBe(
      ParticipantVote.UNKNOWN,
    );
    expect(currentAggregate?.betRequest.getParticipantVote(friend.id)).toBe(
      ParticipantVote.UNKNOWN,
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
    const terms = new Terms("Who will finish the project first?");
    const stakes = new CommonStake(
      "Winner gets to choose the next team lunch venue",
    );

    const betAggregate = await betService.create(
      user.id,
      friend.id,
      title,
      terms,
      stakes,
    );

    eventDispatcher.dispatchedEvents = []; // Clear creation events

    // Act - Creator approves first
    await betService.approve(betAggregate.id, user.id);

    // Assert - Should still be pending with one approval
    let currentAggregate = await betAggregateRepository.findById(
      betAggregate.id,
    );
    expect(currentAggregate?.betRequest.status).toBe(BetRequestStatus.PENDING);
    expect(currentAggregate?.betRequest.getParticipantVote(user.id)).toBe(
      ParticipantVote.APPROVED,
    );
    expect(currentAggregate?.betRequest.getParticipantVote(friend.id)).toBe(
      ParticipantVote.UNKNOWN,
    );
    expect(currentAggregate?.betRequest.allParticipantsApproved()).toBe(false);

    // Act - Friend approves (second approval)
    await betService.approve(betAggregate.id, friend.id);

    // Assert - Should be approved with both votes
    currentAggregate = await betAggregateRepository.findById(betAggregate.id);
    expect(currentAggregate?.betRequest.status).toBe(BetRequestStatus.APPROVED);
    expect(currentAggregate?.betRequest.isApproved()).toBe(true);
    expect(currentAggregate?.betRequest.getParticipantVote(user.id)).toBe(
      ParticipantVote.APPROVED,
    );
    expect(currentAggregate?.betRequest.getParticipantVote(friend.id)).toBe(
      ParticipantVote.APPROVED,
    );
    expect(currentAggregate?.betRequest.allParticipantsApproved()).toBe(true);

    // Verify that a bet was created from the approved bet request
    expect(currentAggregate?.bet).toBeDefined();
    expect(currentAggregate?.bet?.creatorId).toBe(user.id);
    expect(currentAggregate?.bet?.participantId).toBe(friend.id);
    expect(currentAggregate?.bet?.terms.value).toBe(terms.value);
    expect(currentAggregate?.bet?.stakes).toEqual(stakes);

    // Verify approval event was dispatched
    const approvedEvents = eventDispatcher.dispatchedEvents.filter(
      (e) => e instanceof BetRequestApprovedEvent,
    );
    expect(approvedEvents).toHaveLength(1);
    const approvedEvent = approvedEvents[0] as BetRequestApprovedEvent;
    expect(approvedEvent.betRequestId).toBe(betAggregate.id);
  });
  it("User can resolve Bet terms", async () => {
    // Arrange
    const testDate = new Date("2025-01-01");
    vi.setSystemTime(testDate);
    const title = "Bet summary";
    const terms = new Terms("Who will finish the project first?");
    const stakes = new CommonStake(
      "Winner gets to choose the next team lunch venue",
    );
    const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
    const resolveEvidence = "I finished first I don't lie!";

    const betAggregate = await betService.create(
      user.id,
      friend.id,
      title,
      terms,
      stakes,
    );

    eventDispatcher.dispatchedEvents = []; // Clear creation events

    // Act - Both participants approves => bet is created
    await betService.approve(betAggregate.id, user.id);
    await betService.approve(betAggregate.id, friend.id);

    await betService.resolve(
      betAggregate.id,
      user.id,
      user.id,
      resolveEvidence,
      dueDate,
    );

    // Assert - Should be approved with both votes
    const currentBet = await betService.getBetById(betAggregate.id);

    expect(currentBet.status).toBe(BetStatus.RESOLVED);
    expect(currentBet.winnerId).toBe(user.id);
    expect(currentBet.evidence).toBe(resolveEvidence);

    expect(currentBet.isOverdue()).toBe(false);
    const dateAfterDueDate = new Date("2026-01-02");
    vi.setSystemTime(dateAfterDueDate);
    expect(currentBet.isOverdue()).toBe(true);

    vi.useRealTimers();
  });

  it("User can complete Bet and did stakes", async () => {
    // Arrange
    const title = "Bet summary";
    const terms = new Terms("Who will finish the project first?");
    const stakes = new CommonStake(
      "Winner gets to choose the next team lunch venue",
    );
    const completionNotes = "We was at italian restaurant";

    const betAggregate = await betService.create(
      user.id,
      friend.id,
      title,
      terms,
      stakes,
    );

    eventDispatcher.dispatchedEvents = []; // Clear creation events

    // Act - Both participants approves => bet is created
    await betService.approve(betAggregate.id, user.id);
    await betService.approve(betAggregate.id, friend.id);

    await betService.resolve(betAggregate.id, user.id, user.id);

    await betService.complete(betAggregate.id, user.id, completionNotes);

    // Assert - Should be approved with both votes
    const currentBet = await betService.getBetById(betAggregate.id);

    expect(currentBet.status).toBe(BetStatus.COMPLETED);
    expect(currentBet.completionNotes).toBe(completionNotes);
  });

  it("Friend should not be able to delete Bet Request", async () => {
    const title = "Bet summary";
    const terms = new Terms(
      "Who will win the next football match between Team A and Team B?",
    );
    const stakes = new CommonStake("Loser buys dinner for the winner");

    // Act
    const betAggregate = await betService.create(
      user.id,
      friend.id,
      title,
      terms,
      stakes,
    );
    expect(
      async () =>
        await betService.delete(betAggregate.betRequest.id, friend.id),
    ).rejects.toThrow(/Only the creator or admin can delete this bet request/);
  });
});
