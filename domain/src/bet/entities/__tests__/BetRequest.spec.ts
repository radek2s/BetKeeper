import { generateId, type UUID } from "@domain/shared";
import { beforeEach, describe, expect, it } from "vitest";
import {
  BetRequestApprovedEvent,
  BetRequestBlockedEvent,
  BetRequestCreatedEvent,
  BetRequestDeletedEvent,
  BetRequestParticipantVoteChangedEvent,
  BetRequestRejectedEvent,
  BetRequestUpdatedEvent,
} from "../../events/BetRequestEvents";
import {
  BetRequestStatus,
  ParticipantVote,
} from "../../types/BetRequestStatus";
import { CommonStake, IndividualStakes } from "../../value-objects/Stakes";
import { Terms } from "../../value-objects/Terms";
import { BetRequest } from "../BetRequest";

describe("BetRequest", () => {
  let creatorId: UUID;
  let participantId: UUID;
  let terms: Terms;
  let stakes: CommonStake;
  let dueDate: Date;

  beforeEach(() => {
    creatorId = generateId();
    participantId = generateId();
    terms = new Terms("This is a test bet about who will win the game");
    stakes = new CommonStake("Loser buys coffee for the winner");
    dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
  });

  describe("Creation", () => {
    it("should create a bet request with valid parameters", () => {
      const betRequest = new BetRequest(
        creatorId,
        participantId,
        terms,
        stakes,
        dueDate,
      );

      expect(betRequest.id).toBeDefined();
      expect(betRequest.creatorId).toBe(creatorId);
      expect(betRequest.participantId).toBe(participantId);
      expect(betRequest.terms).toBe(terms);
      expect(betRequest.stakes).toBe(stakes);
      expect(betRequest.status).toBe(BetRequestStatus.PENDING);
      expect(betRequest.dueDate).toBe(dueDate);
      expect(betRequest.participants).toEqual([creatorId, participantId]);
    });

    it("should emit BetRequestCreatedEvent when created without ID", () => {
      const betRequest = new BetRequest(creatorId, participantId, terms);

      const events = betRequest.domainEvents;
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(BetRequestCreatedEvent);

      const createdEvent = events[0] as BetRequestCreatedEvent;
      expect(createdEvent.betRequestId).toBe(betRequest.id);
      expect(createdEvent.creatorId).toBe(creatorId);
      expect(createdEvent.participantId).toBe(participantId);
      expect(createdEvent.terms).toBe(terms.value);
    });

    it("should not emit events when created with existing ID", () => {
      const existingId = generateId();
      const betRequest = new BetRequest(
        creatorId,
        participantId,
        terms,
        stakes,
        dueDate,
        existingId,
      );

      expect(betRequest.domainEvents).toHaveLength(0);
      expect(betRequest.id).toBe(existingId);
    });

    it("should initialize participant votes as unknown", () => {
      const betRequest = new BetRequest(creatorId, participantId, terms);

      expect(betRequest.getParticipantVote(creatorId)).toBe(
        ParticipantVote.UNKNOWN,
      );
      expect(betRequest.getParticipantVote(participantId)).toBe(
        ParticipantVote.UNKNOWN,
      );
    });
  });

  describe("Factory method", () => {
    it("should create bet request using factory method", () => {
      const betRequest = BetRequest.create(
        creatorId,
        participantId,
        terms,
        stakes,
        dueDate,
      );

      expect(betRequest.creatorId).toBe(creatorId);
      expect(betRequest.participantId).toBe(participantId);
      expect(betRequest.terms).toBe(terms);
      expect(betRequest.stakes).toBe(stakes);
      expect(betRequest.dueDate).toBe(dueDate);
    });

    it("should throw error if creator and participant are the same", () => {
      expect(() => {
        BetRequest.create(creatorId, creatorId, terms);
      }).toThrow("Creator and participant cannot be the same person");
    });
  });

  describe("Status checking methods", () => {
    let betRequest: BetRequest;

    beforeEach(() => {
      betRequest = new BetRequest(creatorId, participantId, terms);
    });

    it("should correctly identify pending status", () => {
      expect(betRequest.isPending()).toBe(true);
      expect(betRequest.isApproved()).toBe(false);
      expect(betRequest.isRejected()).toBe(false);
      expect(betRequest.isBlocked()).toBe(false);
      expect(betRequest.isDeleted()).toBe(false);
    });

    it("should correctly identify if user is participant", () => {
      expect(betRequest.isParticipant(creatorId)).toBe(true);
      expect(betRequest.isParticipant(participantId)).toBe(true);
      expect(betRequest.isParticipant(generateId())).toBe(false);
    });

    it("should correctly identify creator", () => {
      expect(betRequest.isCreator(creatorId)).toBe(true);
      expect(betRequest.isCreator(participantId)).toBe(false);
      expect(betRequest.isCreator(generateId())).toBe(false);
    });

    it("should allow modification when pending", () => {
      expect(betRequest.canBeModified()).toBe(true);
    });
  });

  describe("Terms update", () => {
    let betRequest: BetRequest;

    beforeEach(() => {
      betRequest = new BetRequest(creatorId, participantId, terms);
      betRequest.clearDomainEvents(); // Clear creation events
    });

    it("should update terms successfully", () => {
      const newTerms = new Terms(
        "Updated terms for the bet about the championship",
      );

      betRequest.updateTerms(newTerms, creatorId);

      expect(betRequest.terms).toBe(newTerms);
      expect(betRequest.updatedAt).toBeDefined();
    });

    it("should emit BetRequestUpdatedEvent when terms are updated", () => {
      const newTerms = new Terms(
        "Updated terms for the bet about the championship",
      );
      const originalTerms = betRequest.terms.value;

      betRequest.updateTerms(newTerms, creatorId);

      const events = betRequest.domainEvents;
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(BetRequestUpdatedEvent);

      const updatedEvent = events[0] as BetRequestUpdatedEvent;
      expect(updatedEvent.betRequestId).toBe(betRequest.id);
      expect(updatedEvent.updatedById).toBe(creatorId);
      expect(updatedEvent.previousTerms).toBe(originalTerms);
      expect(updatedEvent.newTerms).toBe(newTerms.value);
      expect(updatedEvent.votesReset).toBe(true);
    });

    it("should reset participant votes when terms are updated", () => {
      // First approve by creator
      betRequest.approve(creatorId);
      expect(betRequest.getParticipantVote(creatorId)).toBe(
        ParticipantVote.APPROVED,
      );

      betRequest.clearDomainEvents();

      // Update terms
      const newTerms = new Terms(
        "Updated terms for the bet about the championship",
      );
      betRequest.updateTerms(newTerms, participantId);

      // Votes should be reset
      expect(betRequest.getParticipantVote(creatorId)).toBe(
        ParticipantVote.UNKNOWN,
      );
      expect(betRequest.getParticipantVote(participantId)).toBe(
        ParticipantVote.UNKNOWN,
      );
    });

    it("should throw error if non-participant tries to update terms", () => {
      const nonParticipant = generateId();
      const newTerms = new Terms(
        "Updated terms for the bet about the championship",
      );

      expect(() => {
        betRequest.updateTerms(newTerms, nonParticipant);
      }).toThrow("Only participants can update bet request terms");
    });

    it("should throw error if bet request is not pending", () => {
      betRequest.approve(creatorId);
      betRequest.approve(participantId);
      expect(betRequest.isApproved()).toBe(true);

      const newTerms = new Terms(
        "Updated terms for the bet about the championship",
      );

      expect(() => {
        betRequest.updateTerms(newTerms, creatorId);
      }).toThrow("Cannot update terms: bet request is not in pending state");
    });
  });

  describe("Stakes update", () => {
    let betRequest: BetRequest;

    beforeEach(() => {
      betRequest = new BetRequest(creatorId, participantId, terms, stakes);
      betRequest.clearDomainEvents();
    });

    it("should update stakes successfully", () => {
      const newStakes = new IndividualStakes(
        "Creator pays $10",
        "Participant pays $20",
      );

      betRequest.updateStakes(newStakes, creatorId);

      expect(betRequest.stakes).toBe(newStakes);
      expect(betRequest.updatedAt).toBeDefined();
    });

    it("should emit BetRequestUpdatedEvent when stakes are updated", () => {
      const newStakes = new IndividualStakes(
        "Creator pays $10",
        "Participant pays $20",
      );

      betRequest.updateStakes(newStakes, creatorId);

      const events = betRequest.domainEvents;
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(BetRequestUpdatedEvent);
    });

    it("should reset participant votes when stakes are updated", () => {
      betRequest.approve(creatorId);
      expect(betRequest.getParticipantVote(creatorId)).toBe(
        ParticipantVote.APPROVED,
      );

      betRequest.clearDomainEvents();

      const newStakes = new IndividualStakes(
        "Creator pays $10",
        "Participant pays $20",
      );
      betRequest.updateStakes(newStakes, participantId);

      expect(betRequest.getParticipantVote(creatorId)).toBe(
        ParticipantVote.UNKNOWN,
      );
      expect(betRequest.getParticipantVote(participantId)).toBe(
        ParticipantVote.UNKNOWN,
      );
    });
  });

  describe("Approval flow", () => {
    let betRequest: BetRequest;

    beforeEach(() => {
      betRequest = new BetRequest(creatorId, participantId, terms);
      betRequest.clearDomainEvents();
    });

    it("should allow participant to approve", () => {
      betRequest.approve(creatorId);

      expect(betRequest.getParticipantVote(creatorId)).toBe(
        ParticipantVote.APPROVED,
      );
      expect(betRequest.isPending()).toBe(true); // Still pending until both approve
    });

    it("should emit ParticipantVoteChangedEvent when approving", () => {
      betRequest.approve(creatorId);

      const events = betRequest.domainEvents;
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(BetRequestParticipantVoteChangedEvent);

      const voteEvent = events[0] as BetRequestParticipantVoteChangedEvent;
      expect(voteEvent.participantId).toBe(creatorId);
      expect(voteEvent.previousVote).toBe(ParticipantVote.UNKNOWN);
      expect(voteEvent.newVote).toBe(ParticipantVote.APPROVED);
    });

    it("should approve bet request when all participants approve", () => {
      betRequest.approve(creatorId);
      betRequest.clearDomainEvents();

      betRequest.approve(participantId);

      expect(betRequest.isApproved()).toBe(true);
      expect(betRequest.allParticipantsApproved()).toBe(true);

      const events = betRequest.domainEvents;
      expect(events).toHaveLength(2); // Vote changed + approved events
      expect(events[1]).toBeInstanceOf(BetRequestApprovedEvent);
    });

    it("should throw error if participant tries to approve twice", () => {
      betRequest.approve(creatorId);

      expect(() => {
        betRequest.approve(creatorId);
      }).toThrow("Participant has already approved this bet request");
    });

    it("should throw error if non-participant tries to approve", () => {
      const nonParticipant = generateId();

      expect(() => {
        betRequest.approve(nonParticipant);
      }).toThrow("Only participants can approve bet request");
    });
  });

  describe("Rejection flow", () => {
    let betRequest: BetRequest;

    beforeEach(() => {
      betRequest = new BetRequest(creatorId, participantId, terms);
      betRequest.clearDomainEvents();
    });

    it("should allow participant to reject", () => {
      betRequest.reject(creatorId);

      expect(betRequest.getParticipantVote(creatorId)).toBe(
        ParticipantVote.REJECTED,
      );
      expect(betRequest.isRejected()).toBe(true);
    });

    it("should emit events when rejecting", () => {
      betRequest.reject(creatorId);

      const events = betRequest.domainEvents;
      expect(events).toHaveLength(2); // Vote changed + rejected events
      expect(events[0]).toBeInstanceOf(BetRequestParticipantVoteChangedEvent);
      expect(events[1]).toBeInstanceOf(BetRequestRejectedEvent);
    });

    it("should throw error if participant tries to reject twice", () => {
      betRequest.reject(creatorId);

      expect(() => {
        betRequest.reject(creatorId);
      }).toThrow("Cannot reject: bet request is not in pending state");
    });
  });

  describe("Blocking flow", () => {
    let betRequest: BetRequest;

    beforeEach(() => {
      betRequest = new BetRequest(creatorId, participantId, terms);
      betRequest.clearDomainEvents();
    });

    it("should allow participant to block bet request", () => {
      betRequest.block(creatorId);

      expect(betRequest.isBlockedByParticipant(creatorId)).toBe(true);
      expect(betRequest.isBlockedByParticipant(participantId)).toBe(false);
    });

    it("should emit BetRequestBlockedEvent when blocking", () => {
      betRequest.block(creatorId);

      const events = betRequest.domainEvents;
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(BetRequestBlockedEvent);

      const blockedEvent = events[0] as BetRequestBlockedEvent;
      expect(blockedEvent.betRequestId).toBe(betRequest.id);
      expect(blockedEvent.blockedById).toBe(creatorId);
    });

    it("should allow participant to unblock bet request", () => {
      betRequest.block(creatorId);
      betRequest.clearDomainEvents();

      betRequest.unblock(creatorId);

      expect(betRequest.isBlockedByParticipant(creatorId)).toBe(false);
    });

    it("should throw error if non-participant tries to block", () => {
      const nonParticipant = generateId();

      expect(() => {
        betRequest.block(nonParticipant);
      }).toThrow("Only participants can block bet request");
    });
  });

  describe("Deletion", () => {
    let betRequest: BetRequest;

    beforeEach(() => {
      betRequest = new BetRequest(creatorId, participantId, terms);
      betRequest.clearDomainEvents();
    });

    it("should allow creator to delete bet request", () => {
      betRequest.delete(creatorId);

      expect(betRequest.isDeleted()).toBe(true);
    });

    it("should emit BetRequestDeletedEvent when deleting", () => {
      betRequest.delete(creatorId);

      const events = betRequest.domainEvents;
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(BetRequestDeletedEvent);

      const deletedEvent = events[0] as BetRequestDeletedEvent;
      expect(deletedEvent.betRequestId).toBe(betRequest.id);
      expect(deletedEvent.deletedById).toBe(creatorId);
    });

    it("should throw error if non-creator tries to delete", () => {
      expect(() => {
        betRequest.delete(participantId);
      }).toThrow("Only the creator can delete this bet request");
    });

    it("should throw error if trying to delete already deleted bet request", () => {
      betRequest.delete(creatorId);

      expect(() => {
        betRequest.delete(creatorId);
      }).toThrow("Bet request is already deleted");
    });
  });

  describe("Entity implementation", () => {
    it("should implement equals correctly", () => {
      const betRequest1 = new BetRequest(creatorId, participantId, terms);
      const betRequest2 = new BetRequest(
        creatorId,
        participantId,
        terms,
        stakes,
        dueDate,
        betRequest1.id,
      );
      const betRequest3 = new BetRequest(creatorId, participantId, terms);

      expect(betRequest1.equals(betRequest2)).toBe(true);
      expect(betRequest1.equals(betRequest3)).toBe(false);
    });

    it("should implement toString correctly", () => {
      const betRequest = new BetRequest(creatorId, participantId, terms);
      const result = betRequest.toString();

      expect(result).toContain("BetRequest");
      expect(result).toContain(betRequest.id);
      expect(result).toContain(betRequest.status);
      expect(result).toContain(creatorId);
      expect(result).toContain(participantId);
    });
  });

  describe("Business rules", () => {
    it("should not allow modification when not pending", () => {
      const betRequest = new BetRequest(creatorId, participantId, terms);
      betRequest.approve(creatorId);
      betRequest.approve(participantId);

      expect(betRequest.canBeModified()).toBe(false);
    });

    it("should track participant votes correctly", () => {
      const betRequest = new BetRequest(creatorId, participantId, terms);

      expect(betRequest.allParticipantsApproved()).toBe(false);
      expect(betRequest.hasAnyRejection()).toBe(false);

      betRequest.approve(creatorId);
      expect(betRequest.allParticipantsApproved()).toBe(false);
      expect(betRequest.hasAnyRejection()).toBe(false);

      betRequest.approve(participantId);
      expect(betRequest.allParticipantsApproved()).toBe(true);
      expect(betRequest.hasAnyRejection()).toBe(false);
    });

    it("should detect rejections correctly", () => {
      const betRequest = new BetRequest(creatorId, participantId, terms);

      betRequest.approve(creatorId);
      betRequest.reject(participantId);

      expect(betRequest.hasAnyRejection()).toBe(true);
      expect(betRequest.allParticipantsApproved()).toBe(false);
    });
  });
});
