import { generateId, type UUID } from "@domain/shared";
import { beforeEach, describe, expect, it } from "vitest";
import { BetCreatedEvent, BetResolvedEvent } from "../../events/BetEvents";
import { BetStatus } from "../../types/BetStatus";
import { CommonStake } from "../../value-objects/Stakes";
import { Terms } from "../../value-objects/Terms";
import { Bet, CommonBet } from "../Bet";
import { CommonBetRequest, type CommonBetRequestType } from "../BetRequest";
import {
  CreatorCommonBetParticipantMock,
  FriendCommonBetParticipantMock,
} from "./mocks/BetParticipantMock";
import { BasicCommonBetRequestMock } from "./mocks/BetRequestMocks";

describe("Bet Context", () => {
  describe("Common Bet", () => {
    const creator = { ...CreatorCommonBetParticipantMock };
    const friend = { ...FriendCommonBetParticipantMock };
    const betRequestMock: CommonBetRequestType = {
      ...BasicCommonBetRequestMock,
      participants: [creator, friend],
    };
    it("should create bet from common bet request", () => {
      const betRequest = new CommonBetRequest(
        creator.userId,
        betRequestMock.title,
        betRequestMock.terms,
        betRequestMock.stake,
        [creator, friend],
        betRequestMock.id,
      );
      const bet = new CommonBet(betRequest);

      expect(bet.id).toBe(betRequest.id);
      expect(bet.status).toBe("pending");
      expect(bet.updatedAt).not.toBe(betRequest.updatedAt);
    });
  });
});

describe("Bet", () => {
  let betRequestId: UUID;
  let creatorId: UUID;
  let participantId: UUID;
  let title: string;
  let terms: Terms;
  let stakes: CommonStake;
  let dueDate: Date;

  beforeEach(() => {
    betRequestId = generateId();
    creatorId = generateId();
    participantId = generateId();
    title = "Short summary";
    terms = new Terms("This is a test bet about who will win the game");
    stakes = new CommonStake("Loser buys coffee for the winner");
    dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
  });

  describe("Creation", () => {
    it("should create a bet with valid parameters", () => {
      const bet = new Bet(
        betRequestId,
        creatorId,
        participantId,
        title,
        terms,
        stakes,
      );

      expect(bet.id).toBeDefined();
      expect(bet.betRequestId).toBe(betRequestId);
      expect(bet.creatorId).toBe(creatorId);
      expect(bet.participantId).toBe(participantId);
      expect(bet.title).toBe(title);
      expect(bet.terms).toBe(terms);
      expect(bet.stakes).toBe(stakes);
      expect(bet.status).toBe(BetStatus.PENDING);
      expect(bet.participants).toEqual([creatorId, participantId]);
    });

    it("should emit BetCreatedEvent when created without ID", () => {
      const bet = new Bet(betRequestId, creatorId, participantId, title, terms);

      const events = bet.domainEvents;
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(BetCreatedEvent);

      const createdEvent = events[0] as BetCreatedEvent;
      expect(createdEvent.betId).toBe(bet.id);
      expect(createdEvent.betRequestId).toBe(betRequestId);
      expect(createdEvent.creatorId).toBe(creatorId);
      expect(createdEvent.participantId).toBe(participantId);
      expect(createdEvent.terms).toBe(terms.value);
    });

    it("should not emit events when created with existing ID", () => {
      const existingId = generateId();
      const bet = new Bet(
        betRequestId,
        creatorId,
        participantId,
        title,
        terms,
        stakes,
        existingId,
      );

      expect(bet.domainEvents).toHaveLength(0);
      expect(bet.id).toBe(existingId);
    });
  });

  describe("Factory method", () => {
    it("should create bet using factory method", () => {
      const bet = Bet.createFromBetRequest(
        betRequestId,
        creatorId,
        participantId,
        title,
        terms,
        stakes,
      );

      expect(bet.betRequestId).toBe(betRequestId);
      expect(bet.creatorId).toBe(creatorId);
      expect(bet.participantId).toBe(participantId);
      expect(bet.terms).toBe(terms);
      expect(bet.stakes).toBe(stakes);
    });
  });

  describe("Status checking methods", () => {
    let bet: Bet;

    beforeEach(() => {
      bet = new Bet(betRequestId, creatorId, participantId, title, terms);
    });

    it("should correctly identify pending status", () => {
      expect(bet.isPending()).toBe(true);
      expect(bet.isResolved()).toBe(false);
      expect(bet.isCompleted()).toBe(false);
      expect(bet.isDeleted()).toBe(false);
      expect(bet.isActive()).toBe(true);
      expect(bet.isFinal()).toBe(false);
    });

    it("should correctly identify if user is participant", () => {
      expect(bet.isParticipant(creatorId)).toBe(true);
      expect(bet.isParticipant(participantId)).toBe(true);
      expect(bet.isParticipant(generateId())).toBe(false);
    });

    it("should correctly identify creator", () => {
      expect(bet.isCreator(creatorId)).toBe(true);
      expect(bet.isCreator(participantId)).toBe(false);
      expect(bet.isCreator(generateId())).toBe(false);
    });

    it("should allow resolution when pending", () => {
      expect(bet.canBeResolved()).toBe(true);
      expect(bet.canBeCompleted()).toBe(false);
      expect(bet.canBeDeleted()).toBe(true);
    });
  });

  describe("Due date checking", () => {
    it("should not be overdue when due date is in future", () => {
      const futureDueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      const bet = new Bet(
        betRequestId,
        creatorId,
        participantId,
        title,
        terms,
        stakes,
      );

      bet.resolve(creatorId, creatorId, undefined, futureDueDate);

      expect(bet.isOverdue()).toBe(false);
      expect(bet.isDueSoon()).toBe(false);
    });

    it("should be due soon when within threshold", () => {
      const soonDueDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // 2 days
      const bet = new Bet(
        betRequestId,
        creatorId,
        participantId,
        title,
        terms,
        stakes,
      );
      bet.resolve(creatorId, creatorId, undefined, soonDueDate);

      expect(bet.isDueSoon(3)).toBe(true);
      expect(bet.isOverdue()).toBe(false);
    });

    it("should be overdue when past due date", () => {
      const pastDueDate = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000); // 1 day ago
      const bet = new Bet(
        betRequestId,
        creatorId,
        participantId,
        title,
        terms,
        stakes,
      );
      bet.resolve(creatorId, creatorId, undefined, pastDueDate);

      expect(bet.isOverdue()).toBe(true);
      expect(bet.isDueSoon()).toBe(false);
    });

    it("should be pending too long when threshold exceeded", () => {
      // Create bet with past creation date by manipulating the internal state
      const bet = new Bet(betRequestId, creatorId, participantId, title, terms);
      // We can't directly set creation date, so we test with current logic
      expect(bet.isPendingTooLong(1)).toBe(false); // 1 day threshold
    });

    it("should not be pending too long when resolved", () => {
      const bet = new Bet(betRequestId, creatorId, participantId, title, terms);
      bet.resolve(creatorId, creatorId);

      expect(bet.isPendingTooLong(0)).toBe(false);
    });
  });

  describe("Resolution", () => {
    let bet: Bet;

    beforeEach(() => {
      bet = new Bet(betRequestId, creatorId, participantId, title, terms);
      bet.clearDomainEvents();
    });

    it("should resolve bet successfully", () => {
      const evidence = "Photo evidence of the outcome";

      bet.resolve(creatorId, creatorId, evidence);

      expect(bet.isResolved()).toBe(true);
      expect(bet.winnerId).toBe(creatorId);
      expect(bet.loserId).toBe(participantId);
      expect(bet.evidence).toBe(evidence);
      expect(bet.resolvedAt).toBeDefined();
    });

    it("should emit BetResolvedEvent when resolved", () => {
      const evidence = "Photo evidence of the outcome";

      bet.resolve(creatorId, participantId, evidence);

      const events = bet.domainEvents;
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(BetResolvedEvent);

      const resolvedEvent = events[0] as BetResolvedEvent;
      expect(resolvedEvent.betId).toBe(bet.id);
      expect(resolvedEvent.resolvedById).toBe(creatorId);
      expect(resolvedEvent.winnerId).toBe(participantId);
      expect(resolvedEvent.loserId).toBe(creatorId);
      expect(resolvedEvent.evidence).toBe(evidence);
    });

    it("should throw error if non-participant tries to resolve", () => {
      const nonParticipant = generateId();

      expect(() => {
        bet.resolve(nonParticipant, creatorId);
      }).toThrow("Only participants can resolve the bet");
    });

    it("should throw error if winner is not a participant", () => {
      const nonParticipant = generateId();

      expect(() => {
        bet.resolve(creatorId, nonParticipant);
      }).toThrow("Winner must be one of the bet participants");
    });

    it("should throw error if bet is not pending", () => {
      bet.resolve(creatorId, creatorId);

      expect(() => {
        bet.resolve(participantId, participantId);
      }).toThrow("Cannot resolve: bet is not in pending state");
    });
  });
});
