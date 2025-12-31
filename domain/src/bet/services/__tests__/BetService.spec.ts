import { EventDispatcherMock } from "@bet-keeper/domain/test/mocks/EventDispatcherMock";
import { InMemoryBetParticipantRepository } from "@bet-keeper/domain/test/mocks/InMemoryBetParticipantRepository";
import { InMemoryBetRepository } from "@bet-keeper/domain/test/mocks/InMemoryBetRepository";
import { InMemoryBetService } from "@bet-keeper/domain/test/mocks/InMemoryBetService";
import {
  CommonBet,
  CommonBetRequest,
  IndividualBetRequest,
} from "@domain/bet/entities";
import { describe, expect, it } from "vitest";

describe("Bet Service", () => {
  let betRepository: InMemoryBetRepository;
  let betParticipantRepository: InMemoryBetParticipantRepository;
  let eventDispatcher: EventDispatcherMock;
  let betService: InMemoryBetService;

  beforeEach(async () => {
    betRepository = new InMemoryBetRepository();
    betParticipantRepository = new InMemoryBetParticipantRepository();

    eventDispatcher = new EventDispatcherMock();

    betService = new InMemoryBetService(
      betRepository,
      betParticipantRepository,
      eventDispatcher,
    );
  });
  describe("Common Bet Request", () => {
    it("Create common bet request", async () => {
      const betRequest = await betService.create(
        "Simple bet",
        "Bet longer terms to be created",
        "user-01",
        [
          {
            userId: "user-01",
            claim: "I want prize",
          },
          {
            userId: "user-02",
            claim: "I want trophy",
          },
        ],
        "Common stake",
      );
      expect(betRequest).toBeInstanceOf(CommonBetRequest);
      expect(await betRepository.findAll()).toHaveLength(1);
      expect(
        await betParticipantRepository.findAllByBetId(betRequest.id),
      ).toHaveLength(2);
    });

    it("Update terms of common bet request", async () => {
      const betRequest = await betService.create(
        "Simple bet",
        "Bet longer terms to be created",
        "user-01",
        [
          {
            userId: "user-01",
            claim: "I want prize",
          },
          {
            userId: "user-02",
            claim: "I want trophy",
          },
        ],
        "Common stake",
      );

      const updatedTerms = "Shorter terms";
      const updatedRequest = await betService.updateTerms(
        betRequest.id,
        updatedTerms,
        "user-01",
      );
      expect(updatedRequest.updatedAt).not.toBe(betRequest.updatedAt);
      expect(updatedRequest.terms).toBe(updatedTerms);
      expect((await betRepository.findById(betRequest.id))?.terms).toBe(
        updatedTerms,
      );
    });

    it("Update stake of common bet request", async () => {
      const betRequest = await betService.create(
        "Simple bet",
        "Bet longer terms to be created",
        "user-01",
        [
          {
            userId: "user-01",
            claim: "I want prize",
          },
          {
            userId: "user-02",
            claim: "I want trophy",
          },
        ],
        "Common stake",
      );

      const updatedStake = "Shorter terms";
      const updatedRequest = (await betService.updateStakes(
        betRequest.id,
        updatedStake,
        "user-02",
      )) as CommonBetRequest;

      expect(updatedRequest.stake).toBe(updatedStake);
      expect(updatedRequest.isApproved()).toBeFalsy();
    });

    it("Update claims of friend in bet request", async () => {
      const betRequest = await betService.create(
        "Simple bet",
        "Bet longer terms to be created",
        "user-01",
        [
          {
            userId: "user-01",
            claim: "I want prize",
          },
          {
            userId: "user-02",
            claim: "I want trophy",
          },
        ],
        "Common stake",
      );

      const updatedClaims = "Another claims";
      const updatedRequest = (await betService.updateClaims(
        betRequest.id,
        updatedClaims,
        "user-02",
      )) as CommonBetRequest;

      expect(
        (
          await betParticipantRepository.findByUserIdAndBetId(
            "user-02",
            updatedRequest.id,
          )
        )?.claim,
      ).toBe(updatedClaims);
    });

    it("Approve of bet request by friend", async () => {
      const betRequest = await betService.create(
        "Simple bet",
        "Bet longer terms to be created",
        "user-01",
        [
          {
            userId: "user-01",
            claim: "I want prize",
          },
          {
            userId: "user-02",
            claim: "I want trophy",
          },
        ],
        "Common stake",
      );

      const updatedRequest = await betService.approve(betRequest.id, "user-02");
      expect(updatedRequest.isApproved()).toBeTruthy();

      const participants = await betParticipantRepository.findAllByBetId(
        betRequest.id,
      );
      expect(participants.every((p) => p.vote === "approved")).toBeTruthy();
    });

    it("Reject of bet request by friend", async () => {
      const betRequest = await betService.create(
        "Simple bet",
        "Bet longer terms to be created",
        "user-01",
        [
          {
            userId: "user-01",
            claim: "I want prize",
          },
          {
            userId: "user-02",
            claim: "I want trophy",
          },
        ],
        "Common stake",
      );

      await betService.reject(betRequest.id, "user-02");

      const participant = await betParticipantRepository.findByUserIdAndBetId(
        "user-02",
        betRequest.id,
      );
      expect(participant?.vote).toBe("rejected");
    });

    it("Approved bet request can be converted to Bet", async () => {
      const betRequest = await betService.create(
        "Simple bet",
        "Bet longer terms to be created",
        "user-01",
        [
          {
            userId: "user-01",
            claim: "I want prize",
          },
          {
            userId: "user-02",
            claim: "I want trophy",
          },
        ],
        "Common stake",
      );

      await betService.approve(betRequest.id, "user-02");
      const bet = await betService.convertToBet(betRequest.id);
      expect(bet).toBeInstanceOf(CommonBet);

      expect((await betRepository.findById(bet.id))?.status).toBe("pending");

      expect(await betService.getBetById(bet.id)).toBeDefined();
    });

    it("Creator should delete request from db", async () => {
      const betRequest = await betService.create(
        "Simple bet",
        "Bet longer terms to be created",
        "user-01",
        [
          {
            userId: "user-01",
            claim: "I want prize",
          },
          {
            userId: "user-02",
            claim: "I want trophy",
          },
        ],
        "Common stake",
      );

      await betService.deleteBetRequest(betRequest.id, "user-01");

      expect(await betRepository.findAll()).toHaveLength(0);
    });

    it("Admin should delete request from db", async () => {
      const betRequest = await betService.create(
        "Simple bet",
        "Bet longer terms to be created",
        "user-01",
        [
          {
            userId: "user-01",
            claim: "I want prize",
          },
          {
            userId: "user-02",
            claim: "I want trophy",
          },
        ],
        "Common stake",
      );

      await betService.deleteBetRequest(betRequest.id, "user-03", true);

      expect(await betRepository.findAll()).toHaveLength(0);
    });

    it("Should throw error when delete by not creator", async () => {
      const betRequest = await betService.create(
        "Simple bet",
        "Bet longer terms to be created",
        "user-01",
        [
          {
            userId: "user-01",
            claim: "I want prize",
          },
          {
            userId: "user-02",
            claim: "I want trophy",
          },
        ],
        "Common stake",
      );

      await expect(
        betService.deleteBetRequest(betRequest.id, "user-02"),
      ).rejects.toThrow("Only creator can delete bet");
    });
  });

  describe("Individual Bet Request", () => {
    it("Create individual bet request", async () => {
      const betRequest = await betService.create(
        "Simple bet",
        "Bet longer terms to be created",
        "user-01",
        [
          {
            userId: "user-01",
            claim: "Bet is too long",
            stake: "I want GOTY",
          },
          {
            userId: "user-02",
            claim: "Bet is too short",
            stake: "I want trophy",
          },
        ],
      );
      expect(betRequest).toBeInstanceOf(IndividualBetRequest);
      expect(await betRepository.findAll()).toHaveLength(1);
      expect(
        await betParticipantRepository.findAllByBetId(betRequest.id),
      ).toHaveLength(2);
      expect(
        (
          await betParticipantRepository.findByUserIdAndBetId(
            "user-02",
            betRequest.id,
          )
        )?.stake,
      ).toBe("I want trophy");
    });

    it("Update individual stakes bet request", async () => {
      const betRequest = await betService.create(
        "Simple bet",
        "Bet longer terms to be created",
        "user-01",
        [
          {
            userId: "user-01",
            claim: "Bet is too long",
            stake: "I want GOTY",
          },
          {
            userId: "user-02",
            claim: "Bet is too short",
            stake: "I want trophy",
          },
        ],
      );

      const updatedStake = "I want a 5$";
      expect(
        (
          await betParticipantRepository.findByUserIdAndBetId(
            "user-02",
            betRequest.id,
          )
        )?.stake,
      ).toBe("I want trophy");
      await betService.updateStakes(betRequest.id, updatedStake, "user-02");
      expect(
        (
          await betParticipantRepository.findByUserIdAndBetId(
            "user-02",
            betRequest.id,
          )
        )?.stake,
      ).toBe(updatedStake);
    });
  });

  describe("Common Bet", () => {
    beforeEach(() => {
      betRepository.save({
        id: "bet-01",
        creatorId: "user-01",
        status: "pending",
        title: "Simple title",
        terms: "Longer bet terms with details",
        stakeType: "COMMON",
        stake: "Winner gets 5$",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      betParticipantRepository.save({
        betId: "bet-01",
        userId: "user-01",
        claim: "Faster",
        vote: "approved",
        stake: null,
      });
      betParticipantRepository.save({
        betId: "bet-01",
        userId: "user-02",
        claim: "Slower",
        vote: "approved",
        stake: null,
      });
    });

    afterEach(() => {
      betRepository.storage.clear();
      betParticipantRepository.storage.filter(() => true);
    });

    it("Should get bet", async () => {
      const bet = await betService.getBetById("bet-01");
      expect(bet).toBeInstanceOf(CommonBet);
    });

    it("Should resolve bet", async () => {
      const bet = await betService.getBetById("bet-01");
      const dueDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
      await betService.resolve(bet.id, "user-02", "user-01", dueDate);

      const betRecord = await betRepository.findById("bet-01");
      expect(betRecord?.status).toBe("resolved");
      expect(betRecord?.dueDate).toBe(dueDate);
    });

    it("Should complete bet", async () => {
      const bet = await betService.getBetById("bet-01");
      await betService.resolve(bet.id, "user-02", "user-01");
      await betService.complete(bet.id, "user-01");

      expect((await betRepository.findById("bet-01"))?.status).toBe(
        "completed",
      );
    });

    it("Creator should delete bet", async () => {
      const bet = await betService.getBetById("bet-01");
      await betService.deleteBet(bet.id, "user-01");

      expect((await betRepository.findById("bet-01"))?.status).toBe("deleted");
    });

    it("Admin should delete bet", async () => {
      const bet = await betService.getBetById("bet-01");
      await betService.deleteBet(bet.id, "admin", true);

      expect((await betRepository.findById("bet-01"))?.status).toBe("deleted");
    });

    it("Admin should delete bet completly", async () => {
      const bet = await betService.getBetById("bet-01");
      await betService.deleteBetCompletly(bet.id, "admin", true);

      expect(await betRepository.findById("bet-01")).toBeNull();
    });
  });
});
