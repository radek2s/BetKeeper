import type { Bet } from "@app/features/bets/components/search/filters/filter.interface";

export const BETS: Bet[] = [
  {
    id: "bet-01",
    creatorId: "creator-01",
    title: "Bet Example",
    terms: "Is this test will be working?",
    createdAt: "2024-01-01T12:00",
    updatedAt: "2024-01-01T12:00",
    stakeType: "COMMON",
    stake: "Coffe",
    participants: [
      {
        userId: "creator-01",
        email: "creator@test.com",
        firstName: "Cris",
        lastName: "Tester",
        avatarUrl: "avatar-01",
        vote: "approved",
        claim: "Win",
      },
      {
        userId: "friend-01",
        email: "friend@test.com",
        firstName: "Frank",
        lastName: "Unit",
        avatarUrl: "avatar-02",
        vote: "approved",
        claim: "Lose",
      },
    ],
  },
  {
    id: "bet-02",
    creatorId: "creator-01",
    title: "Second Bet Example",
    terms: "Will be approved?",
    createdAt: "2025-01-01T12:00",
    updatedAt: "2025-02-05T12:00",
    stakeType: "COMMON",
    stake: "Right",
    participants: [
      {
        userId: "creator-01",
        email: "creator@test.com",
        firstName: "Cris",
        lastName: "Tester",
        avatarUrl: "avatar-01",
        vote: "approved",
        claim: "Win",
      },
      {
        userId: "friend-01",
        email: "friend@test.com",
        firstName: "Frank",
        lastName: "Unit",
        avatarUrl: "avatar-02",
        vote: "unknown",
        claim: "Lose",
      },
    ],
  },
];
