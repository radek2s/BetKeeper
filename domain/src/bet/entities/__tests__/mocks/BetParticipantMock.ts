import type { CommonBetParticipantType } from "@domain/bet/entities/BetParticipant";

export const CreatorCommonBetParticipantMock: CommonBetParticipantType = {
  userId: "user-01",
  claim: "Application will be running smoothly",
  vote: "approved",
} as const;

export const FriendCommonBetParticipantMock: CommonBetParticipantType = {
  userId: "user-02",
  claim: "Application will crash soon",
  vote: "approved",
} as const;
