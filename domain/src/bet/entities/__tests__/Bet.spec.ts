import { describe, expect, it } from "vitest";
import { BetActionEvent } from "../../events/BetEvents";
import { CommonBet, type CommonBetType, IndividualBet } from "../Bet";
import type {
  CommonBetParticipantType,
  IndividualBetParticipantType,
} from "../BetParticipant";
import {
  CommonBetRequest,
  type CommonBetRequestType,
  IndividualBetRequest,
  type IndividualBetRequestType,
} from "../BetRequest";
import {
  CreatorCommonBetParticipantMock,
  FriendCommonBetParticipantMock,
} from "./mocks/BetParticipantMock";
import {
  BasicCommonBetMock,
  BasicCommonBetRequestMock,
  BasicIndividualBetRequestMock,
} from "./mocks/BetRequestMocks";

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

    it("should throw error if participant not approved request", () => {
      const friend: CommonBetParticipantType = {
        ...FriendCommonBetParticipantMock,
        vote: "unknown",
      };

      const betRequest = new CommonBetRequest(
        creator.userId,
        betRequestMock.title,
        betRequestMock.terms,
        betRequestMock.stake,
        [creator, friend],
        betRequestMock.id,
      );

      expect(() => {
        new CommonBet(betRequest);
      }).toThrow(
        "Bet Request is not approved by all participants! Can't create bet",
      );
    });

    it("should throw error if there is not enough participants", () => {
      const betRequest = new CommonBetRequest(
        creator.userId,
        betRequestMock.title,
        betRequestMock.terms,
        betRequestMock.stake,
        [creator],
        betRequestMock.id,
      );

      expect(() => {
        new CommonBet(betRequest);
      }).toThrow("Bet Request does not have enough participants to create bet");
    });

    describe("resolve", () => {
      it("should friend resolve bet without due date", () => {
        const betRequest = new CommonBetRequest(
          creator.userId,
          betRequestMock.title,
          betRequestMock.terms,
          betRequestMock.stake,
          [creator, friend],
          betRequestMock.id,
        );
        const bet = new CommonBet(betRequest);

        bet.resolve(friend.userId, friend.userId);

        expect(bet.status).toBe("resolved");
        expect(bet.winnerId).toBe(friend.userId);
        expect(bet.resolvedBy).toBe(friend.userId);
        expect(bet.dueDate).toBeUndefined();

        expect((bet.domainEvents.at(-1) as BetActionEvent).action).toBe(
          "resolve",
        );
      });

      it("should creator resolve bet with due date", () => {
        const betRequest = new CommonBetRequest(
          creator.userId,
          betRequestMock.title,
          betRequestMock.terms,
          betRequestMock.stake,
          [creator, friend],
          betRequestMock.id,
        );
        const bet = new CommonBet(betRequest);

        const dueDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000); //5 days
        bet.resolve(creator.userId, friend.userId, dueDate);

        expect(bet.status).toBe("resolved");
        expect(bet.winnerId).toBe(friend.userId);
        expect(bet.resolvedBy).toBe(creator.userId);
        expect(bet.dueDate).toBeDefined();
        expect(bet.isDueSoon()).toBeFalsy();
      });

      it("should remove due date when bet is resolved", () => {
        const betRequest = new CommonBetRequest(
          creator.userId,
          betRequestMock.title,
          betRequestMock.terms,
          betRequestMock.stake,
          [creator, friend],
          betRequestMock.id,
        );
        const bet = new CommonBet(betRequest);

        const dueDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000); //5 days
        bet.resolve(creator.userId, friend.userId, dueDate);

        bet.dueDate = undefined;

        expect(bet.dueDate).toBeUndefined();
      });

      it("should throw error when setting due date in pending state", () => {
        const betRequest = new CommonBetRequest(
          creator.userId,
          betRequestMock.title,
          betRequestMock.terms,
          betRequestMock.stake,
          [creator, friend],
          betRequestMock.id,
        );
        const bet = new CommonBet(betRequest);

        expect(() => {
          bet.dueDate = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000); //5 days
        }).toThrow(
          "Due date can be modified only when bet is pending completion.",
        );
      });

      it("should throw error if due date is from past", () => {
        const betRequest = new CommonBetRequest(
          creator.userId,
          betRequestMock.title,
          betRequestMock.terms,
          betRequestMock.stake,
          [creator, friend],
          betRequestMock.id,
        );
        const bet = new CommonBet(betRequest);

        const dueDate = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000); //5 days

        expect(() => {
          bet.resolve(creator.userId, friend.userId, dueDate);
        }).toThrow("Due date must be in the future");
      });

      it("should throw error resolved by not participant", () => {
        const betRequest = new CommonBetRequest(
          creator.userId,
          betRequestMock.title,
          betRequestMock.terms,
          betRequestMock.stake,
          [creator, friend],
          betRequestMock.id,
        );
        const bet = new CommonBet(betRequest);

        expect(() => {
          bet.resolve("user-3", friend.userId);
        }).toThrow("Only bet participant can resolve bet!");
      });

      it("should throw error resolved winner id is not participant", () => {
        const betRequest = new CommonBetRequest(
          creator.userId,
          betRequestMock.title,
          betRequestMock.terms,
          betRequestMock.stake,
          [creator, friend],
          betRequestMock.id,
        );
        const bet = new CommonBet(betRequest);

        expect(() => {
          bet.resolve(friend.userId, "user-3");
        }).toThrow("Provided winnerId is not bet participant!");
      });

      it("should throw error when try to complete when bet is pending", () => {
        const betRequest = new CommonBetRequest(
          creator.userId,
          betRequestMock.title,
          betRequestMock.terms,
          betRequestMock.stake,
          [creator, friend],
          betRequestMock.id,
        );
        const bet = new CommonBet(betRequest);

        expect(() => {
          bet.complete(creator.userId);
        }).toThrow("Cannot complete: bet is not in resolved state");
      });
    });

    describe("complete", () => {
      const betMock: CommonBetType = {
        ...BasicCommonBetMock,
        participants: [creator, friend],
        status: "resolved",
        resolvedBy: friend.userId,
        resolvedAt: new Date(Date.parse("2025-01-01T13:00:00Z")),
      };
      it("should friend complete bet", () => {
        const bet = CommonBet.reconstitute(betMock);

        bet.complete(friend.userId);

        expect(bet.status).toBe("completed");
      });

      it("should emit event when complete bet", () => {
        const bet = CommonBet.reconstitute(betMock);

        bet.complete(friend.userId);

        expect((bet.domainEvents.at(-1) as BetActionEvent).action).toBe(
          "complete",
        );
      });

      it("should throw exception when completed by not participant", () => {
        const bet = CommonBet.reconstitute(betMock);

        expect(() => {
          bet.complete("user-3");
        }).toThrow("Only bet participant can complete bet!");
      });
    });

    describe("delete", () => {
      const betMock: CommonBetType = {
        ...BasicCommonBetMock,
        participants: [creator, friend],
      };

      it("should delete pending bet", () => {
        const bet = CommonBet.reconstitute(betMock);

        bet.delete("admin");

        expect(bet.status).toBe("deleted");
      });

      it("should throw error when delete already deleted bet", () => {
        const bet = CommonBet.reconstitute({ ...betMock, status: "deleted" });

        expect(() => {
          bet.delete(creator.userId);
        }).toThrow("Cannot delete: bet is already deleted!");
      });
    });

    describe("Factory methods", () => {
      it('should reconsitute "pending" from object', () => {
        const betMock: CommonBetType = {
          ...BasicCommonBetMock,
          participants: [creator, friend],
        };
        const bet = CommonBet.reconstitute(betMock);

        expect(bet.id).toBe(betMock.id);
        expect(bet.creatorId).toBe(betMock.creatorId);
        expect(bet.status).toBe(betMock.status);
        expect(bet.title).toBe(betMock.title);
        expect(bet.terms).toBe(betMock.terms);
        expect(bet.stakeType).toBe(betMock.stakeType);
        expect(bet.stake).toBe(betMock.stake);
        expect(bet.createdAt).toBe(betMock.createdAt);
        expect(bet.updatedAt).toBe(betMock.updatedAt);
        expect(bet.resolvedBy).toBeUndefined();
        expect(bet.resolvedAt).toBeUndefined();
        expect(bet.completedBy).toBeUndefined();
        expect(bet.completedAt).toBeUndefined();
        expect(bet.winnerId).toBeUndefined();
      });

      it('should reconsitute "resolved" from object', () => {
        const betMock: CommonBetType = {
          ...BasicCommonBetMock,
          participants: [creator, friend],
          status: "resolved",
          resolvedBy: friend.userId,
          resolvedAt: new Date(Date.parse("2025-01-01T13:00:00Z")),
          winnerId: creator.userId,
          dueDate: new Date(Date.parse("2025-01-05T12:00:00Z")),
        };
        const bet = CommonBet.reconstitute(betMock);

        expect(bet.id).toBe(betMock.id);
        expect(bet.creatorId).toBe(betMock.creatorId);
        expect(bet.status).toBe(betMock.status);
        expect(bet.title).toBe(betMock.title);
        expect(bet.terms).toBe(betMock.terms);
        expect(bet.stakeType).toBe(betMock.stakeType);
        expect(bet.stake).toBe(betMock.stake);
        expect(bet.createdAt).toBe(betMock.createdAt);
        expect(bet.updatedAt).toBe(betMock.updatedAt);
        expect(bet.resolvedBy).toBe(betMock.resolvedBy);
        expect(bet.resolvedAt).toBe(betMock.resolvedAt);
        expect(bet.winnerId).toBe(betMock.winnerId);
        expect(bet.dueDate).toBe(betMock.dueDate);
        expect(bet.completedBy).toBeUndefined();
        expect(bet.completedAt).toBeUndefined();
      });

      it('should reconsitute "completed" from object', () => {
        const betMock: CommonBetType = {
          ...BasicCommonBetMock,
          participants: [creator, friend],
          status: "completed",
          resolvedBy: friend.userId,
          resolvedAt: new Date(Date.parse("2025-01-01T13:00:00Z")),
          winnerId: creator.userId,
          completedAt: new Date(Date.parse("2025-01-01T14:00:00Z")),
          completedBy: friend.userId,
        };
        const bet = CommonBet.reconstitute(betMock);

        expect(bet.id).toBe(betMock.id);
        expect(bet.creatorId).toBe(betMock.creatorId);
        expect(bet.status).toBe(betMock.status);
        expect(bet.title).toBe(betMock.title);
        expect(bet.terms).toBe(betMock.terms);
        expect(bet.stakeType).toBe(betMock.stakeType);
        expect(bet.stake).toBe(betMock.stake);
        expect(bet.createdAt).toBe(betMock.createdAt);
        expect(bet.updatedAt).toBe(betMock.updatedAt);
        expect(bet.resolvedBy).toBe(betMock.resolvedBy);
        expect(bet.resolvedAt).toBe(betMock.resolvedAt);
        expect(bet.winnerId).toBe(betMock.winnerId);
        expect(bet.dueDate).toBeUndefined;
        expect(bet.completedBy).toBe(betMock.completedBy);
        expect(bet.completedAt).toBe(betMock.completedAt);
      });
    });

    describe("Equal methods", () => {
      it("Should two the same id be equal", () => {
        const bet1 = CommonBet.reconstitute({
          ...BasicCommonBetMock,
          participants: [creator, friend],
        });
        const bet2 = CommonBet.reconstitute({
          ...BasicCommonBetMock,
          participants: [creator, friend],
        });
        expect(bet1.equals(bet2)).toBeTruthy();
      });
    });
  });
});

describe("Bet Flow", () => {
  describe("Simple resolution and completion flow for Individual Stake", () => {
    const creator: IndividualBetParticipantType = {
      ...CreatorCommonBetParticipantMock,
      vote: "approved",
      stake: "I want that all loosers should take selfie with mustache",
    };
    const friend: IndividualBetParticipantType = {
      ...FriendCommonBetParticipantMock,
      vote: "approved",
      stake: "I want to gain 5$ from other participants",
    };
    const betRequestMock: IndividualBetRequestType = {
      ...BasicIndividualBetRequestMock,
      participants: [creator, friend],
    };

    const betRequest = new IndividualBetRequest(
      creator.userId,
      betRequestMock.title,
      betRequestMock.terms,
      [creator, friend],
    );

    const bet = new IndividualBet(betRequest);

    it("Should created date be not changed", () => {
      expect(bet.createdAt).toBe(betRequest.createdAt);
    });

    it("Should update date be changed", () => {
      expect(bet.updatedAt).not.toBe(betRequest.updatedAt);
    });

    it("Should resolve bet emit event", () => {
      const dueDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); //2 days
      bet.resolve(friend.userId, creator.userId, dueDate);

      expect(bet.status).toBe("resolved");
      expect(bet.isDueSoon()).toBeTruthy();
      expect(bet.domainEvents.at(-1)).toBeInstanceOf(BetActionEvent);
    });

    it("Should complete bet", () => {
      bet.complete(creator.userId);

      expect(bet.status).toBe("completed");
      expect(bet.isDueSoon()).toBeFalsy();
    });
  });
});
