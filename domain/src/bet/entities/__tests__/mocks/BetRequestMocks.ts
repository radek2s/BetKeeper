import type {
  CommonBetRequestType,
  IndividualBetRequestType,
} from "@domain/bet";

export const BasicCommonBetRequestMock: CommonBetRequestType = {
  id: "bet-01",
  creatorId: "user-01",
  stakeType: "COMMON",
  title: "Short bet title",
  terms:
    "Content of the bet. Long terms where we bet that application will be running smoothly",
  participants: [],
  stake: 'Winner receives "golden badge" reward',
  createdAt: new Date(Date.parse("2025-01-01T00:00:00Z")),
  updatedAt: new Date(Date.parse("2025-01-01T00:00:00Z")),
} as const;

export const BasicIndividualBetRequestMock: IndividualBetRequestType = {
  id: "bet-01",
  creatorId: "user-01",
  stakeType: "INDIVIDUAL",
  title: "Short bet title",
  terms:
    "Content of the bet. Long terms where we bet that application will be running smoothly",
  participants: [],
  createdAt: new Date(Date.parse("2025-01-01T00:00:00Z")),
  updatedAt: new Date(Date.parse("2025-01-01T00:00:00Z")),
} as const;
