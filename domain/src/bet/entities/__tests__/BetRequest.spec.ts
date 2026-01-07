import { describe, expect, it } from "vitest";
import {
  BetRequestActionEvent,
  BetRequestCreatedEvent,
  BetRequestUpdatedEvent,
} from "../../events/BetRequestEvents";

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
  BasicCommonBetRequestMock,
  BasicIndividualBetRequestMock,
} from "./mocks/BetRequestMocks";

const SHOW_LOGS = false;

describe("Bet Request Context", () => {
  describe("Common Bet Request", () => {
    const creator: CommonBetParticipantType = {
      ...CreatorCommonBetParticipantMock,
      vote: "approved",
    };
    const friend: CommonBetParticipantType = {
      ...FriendCommonBetParticipantMock,
      vote: "unknown",
    };
    const betRequestMock: CommonBetRequestType = {
      ...BasicCommonBetRequestMock,
      participants: [creator, friend],
    };

    it("Should throw error when creatorId not in participants", () => {
      expect(() => {
        new CommonBetRequest(
          "user",
          betRequestMock.title,
          betRequestMock.terms,
          betRequestMock.stake,
          [creator, friend],
        );
      }).toThrow(
        "Invalid creatorId=user! Creator must be participant of bet request!",
      );
    });

    it("Should create bet request with random id", () => {
      const betRequest = new CommonBetRequest(
        creator.userId,
        betRequestMock.title,
        betRequestMock.terms,
        betRequestMock.stake,
        [creator, friend],
      );
      expect(betRequest.id).not.toBe(betRequestMock.id);
      expect(betRequest.id).toBeTruthy();
      expect(betRequest.domainEvents.at(0)).toBeInstanceOf(
        BetRequestCreatedEvent,
      );

      if (SHOW_LOGS)
        betRequest.domainEvents.forEach((e) => {
          console.log(e.toLog());
        });
    });

    it("Should reconstitute bet request", () => {
      const betRequest = CommonBetRequest.reconstitute({ ...betRequestMock });
      expect(betRequest.id).toBe(betRequestMock.id);
      expect(betRequest.updatedAt).toBe(betRequestMock.updatedAt);

      expect(betRequest.domainEvents).toHaveLength(0);

      if (SHOW_LOGS)
        betRequest.domainEvents.forEach((e) => {
          console.log(e.toLog());
        });
    });

    it("Should update of title reset votes", () => {
      const updatedValue = "Updated title";
      const betRequest = new CommonBetRequest(
        creator.userId,
        betRequestMock.title,
        betRequestMock.terms,
        betRequestMock.stake,
        [creator, friend],
      );
      //act
      betRequest.setTitle(updatedValue, friend.userId);

      //assert
      expect(betRequest.createdAt).not.toBe(betRequest.updatedAt);
      expect(betRequest.title).toBe(updatedValue);
      expect(
        betRequest.participants.find(({ userId }) => userId === creator.userId)
          ?.vote,
      ).toBe("unknown");

      if (SHOW_LOGS)
        betRequest.domainEvents.forEach((e) => {
          console.log(e.toLog());
        });
    });

    it("Should update of terms reset votes", () => {
      const updatedValue = "Updated terms";
      const betRequest = new CommonBetRequest(
        creator.userId,
        betRequestMock.title,
        betRequestMock.terms,
        betRequestMock.stake,
        [creator, friend],
      );
      //act
      betRequest.setTerms(updatedValue, friend.userId);

      //assert
      expect(betRequest.terms).toBe(updatedValue);
      expect(betRequest.createdAt).not.toBe(betRequest.updatedAt);
      expect(
        betRequest.participants.find(({ userId }) => userId === creator.userId)
          ?.vote,
      ).toBe("unknown");

      if (SHOW_LOGS)
        betRequest.domainEvents.forEach((e) => {
          console.log(e.toLog());
        });
    });

    it("Should update of stake reset votes", () => {
      const updatedValue = "Updated common stake";
      const betRequest = new CommonBetRequest(
        creator.userId,
        betRequestMock.title,
        betRequestMock.terms,
        betRequestMock.stake,
        [creator, friend],
      );
      //act
      betRequest.setStake(updatedValue, friend.userId);

      //assert
      expect(betRequest.stake).toBe(updatedValue);
      expect(betRequest.createdAt).not.toBe(betRequest.updatedAt);
      expect(
        betRequest.participants.find(({ userId }) => userId === creator.userId)
          ?.vote,
      ).toBe("unknown");

      if (SHOW_LOGS)
        betRequest.domainEvents.forEach((e) => {
          console.log(e.toLog());
        });
    });

    it("Should update of claims reset votes", () => {
      const updatedValue = "Updated claims of friend";
      const betRequest = new CommonBetRequest(
        creator.userId,
        betRequestMock.title,
        betRequestMock.terms,
        betRequestMock.stake,
        [creator, friend],
      );
      //act
      betRequest.setClaims(updatedValue, friend.userId);

      //assert
      expect(
        betRequest.participants.find(({ userId }) => userId === friend.userId)
          ?.claim,
      ).toBe(updatedValue);
      expect(betRequest.createdAt).not.toBe(betRequest.updatedAt);
      expect(
        betRequest.participants.find(({ userId }) => userId === creator.userId)
          ?.vote,
      ).toBe("unknown");

      if (SHOW_LOGS)
        betRequest.domainEvents.forEach((e) => {
          console.log(e.toLog());
        });
    });

    it("Should friend reject bet request", () => {
      const betRequest = new CommonBetRequest(
        creator.userId,
        betRequestMock.title,
        betRequestMock.terms,
        betRequestMock.stake,
        [creator, friend],
      );
      //act
      betRequest.reject(friend.userId);

      //assert
      expect(betRequest.createdAt).not.toBe(betRequest.updatedAt);
      expect(
        betRequest.participants.find(({ userId }) => userId === friend.userId)
          ?.vote,
      ).toBe("rejected");

      if (SHOW_LOGS)
        betRequest.domainEvents.forEach((e) => {
          console.log(e.toLog());
        });
    });

    it("Should friend approve bet request", () => {
      const betRequest = new CommonBetRequest(
        creator.userId,
        betRequestMock.title,
        betRequestMock.terms,
        betRequestMock.stake,
        [creator, friend],
      );

      expect(betRequest.isApproved()).toBeFalsy();

      //act
      betRequest.approve(friend.userId);

      //assert
      expect(betRequest.createdAt).not.toBe(betRequest.updatedAt);
      expect(
        betRequest.participants.find(({ userId }) => userId === friend.userId)
          ?.vote,
      ).toBe("approved");
      expect(betRequest.isApproved()).toBeTruthy();

      if (SHOW_LOGS)
        betRequest.domainEvents.forEach((e) => {
          console.log(e.toLog());
        });
    });

    it("Other person should not approve bet request", () => {
      const betRequest = new CommonBetRequest(
        creator.userId,
        betRequestMock.title,
        betRequestMock.terms,
        betRequestMock.stake,
        [creator, friend],
      );
      expect(() => {
        betRequest.approve("user-3");
      }).toThrow("Only bet participant can approve bet request!");
    });
  });

  describe("Individual Bet Request", () => {
    const creator: IndividualBetParticipantType = {
      ...CreatorCommonBetParticipantMock,
      vote: "approved",
      stake: "I want that all loosers should take selfie with mustache",
    };
    const friend: IndividualBetParticipantType = {
      ...FriendCommonBetParticipantMock,
      vote: "unknown",
      stake: "I want to gain 5$ from other participants",
    };
    const betRequestMock: IndividualBetRequestType = {
      ...BasicIndividualBetRequestMock,
      participants: [creator, friend],
    };

    it("Should update of user stakes reset votes", () => {
      const updatedValue = "Updated common stake";
      const betRequest = new IndividualBetRequest(
        creator.userId,
        betRequestMock.title,
        betRequestMock.terms,
        [creator, friend],
      );
      //act
      betRequest.setStake(updatedValue, friend.userId);

      //assert
      expect(
        betRequest.participants.find(({ userId }) => userId === friend.userId)
          ?.stake,
      ).toBe(updatedValue);
      expect(betRequest.createdAt).not.toBe(betRequest.updatedAt);
      expect(
        betRequest.participants.find(({ userId }) => userId === creator.userId)
          ?.vote,
      ).toBe("unknown");

      if (SHOW_LOGS)
        betRequest.domainEvents.forEach((e) => {
          console.log(e.toLog());
        });
    });

    it("Other person should not be able to update stakes", () => {
      const betRequest = new IndividualBetRequest(
        creator.userId,
        betRequestMock.title,
        betRequestMock.terms,
        [creator, friend],
      );
      expect(() => {
        betRequest.setStake("Invalid stake", "user-3");
      }).toThrow("Only participant can change his stakes!");
    });
  });

  describe("Bet Request equals method", () => {
    const creator: IndividualBetParticipantType = {
      ...CreatorCommonBetParticipantMock,
      vote: "approved",
      stake: "I want that all loosers should take selfie with mustache",
    };
    const friend: IndividualBetParticipantType = {
      ...FriendCommonBetParticipantMock,
      vote: "unknown",
      stake: "I want to gain 5$ from other participants",
    };
    const betRequestMock: IndividualBetRequestType = {
      ...BasicIndividualBetRequestMock,
      participants: [creator, friend],
    };

    it("Should two various id be not equal", () => {
      const betRequest1 = new IndividualBetRequest(
        creator.userId,
        betRequestMock.title,
        betRequestMock.terms,
        [creator, friend],
      );
      const betRequest2 = new IndividualBetRequest(
        creator.userId,
        betRequestMock.title,
        betRequestMock.terms,
        [creator, friend],
      );
      expect(betRequest1.equals(betRequest2)).toBeFalsy();
    });

    it("Should two the same id be equal", () => {
      const betRequest1 = IndividualBetRequest.reconstitute({
        ...betRequestMock,
      });

      const betRequest2 = IndividualBetRequest.reconstitute({
        ...betRequestMock,
        title: "Another title",
      });
      expect(betRequest1.equals(betRequest2)).toBeTruthy();
    });
  });
});

describe("Bet Request Flow", () => {
  describe("Simple approval flow for Common stake", () => {
    const creator: CommonBetParticipantType = {
      ...CreatorCommonBetParticipantMock,
      vote: "approved",
    };
    const friend: CommonBetParticipantType = {
      ...FriendCommonBetParticipantMock,
      vote: "unknown",
    };
    const betRequestMock: CommonBetRequestType = {
      ...BasicCommonBetRequestMock,
      participants: [creator, friend],
    };

    const betRequest = new CommonBetRequest(
      creator.userId,
      betRequestMock.title,
      betRequestMock.terms,
      betRequestMock.stake,
      [creator, friend],
    );

    it("Bet request should be created by user", () => {
      expect(betRequest.creatorId).toBe(creator.userId);
    });
    it("Invited user shold have unknown vote", () => {
      expect(
        betRequest.participants.find((p) => p.userId === friend.userId)?.vote,
      ).toBe("unknown");
    });
    it("Bet Request Created Event should be emited", () => {
      expect(betRequest.domainEvents.at(0)).toBeInstanceOf(
        BetRequestCreatedEvent,
      );
    });
    it("Friend approves bet request", () => {
      betRequest.approve(friend.userId);
      expect(betRequest.domainEvents.at(-1)).toBeInstanceOf(
        BetRequestActionEvent,
      );
      expect(
        betRequest.participants.find((p) => p.userId === friend.userId)?.vote,
      ).toBe("approved");
    });

    it("Friend updates common stake", () => {
      betRequest.setStake("Winner get's coffe", friend.userId);
      expect(betRequest.domainEvents.at(-1)).toBeInstanceOf(
        BetRequestUpdatedEvent,
      );
      expect(betRequest.isApproved()).toBeFalsy();
    });
    it("Creator approves bet request", () => {
      betRequest.approve(creator.userId);
      expect(betRequest.domainEvents.at(-1)).toBeInstanceOf(
        BetRequestActionEvent,
      );
      expect(
        betRequest.participants.find((p) => p.userId === creator.userId)?.vote,
      ).toBe("approved");
    });
    it("Bet Request should be approved", () => {
      expect(betRequest.isApproved()).toBeTruthy();
    });
  });
});
