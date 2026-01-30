import { BETS } from "@app-test/features/bet/mocks/BetMocks";
import { describe, expect, it } from "vitest";
import { sortByCreatedAt, sortByUpdatedAt } from "./sortUtils";

describe("bet sort utils tests", () => {
  it("should sortByCreatedAt from latest to oldest", () => {
    const unsortedBets = [
      {
        id: "bet-02",
        createdAt: "2026-01-01T12:00",
      },
      {
        id: "bet-01",
        createdAt: "2025-01-01T12:00",
      },
      {
        id: "bet-03",
        createdAt: "2026-01-01T13:00",
      },
    ];

    const sortedBets = unsortedBets.sort(sortByCreatedAt);

    const [bet03, bet02, bet01] = sortedBets;

    expect(bet03.id).toBe("bet-03");
    expect(bet02.id).toBe("bet-02");
    expect(bet01.id).toBe("bet-01");
  });

  it("should sortByUpdatedAt from latest to oldest", () => {
    const unsortedBets = [
      {
        id: "bet-02",
        updatedAt: "2026-01-01T12:00",
      },
      {
        id: "bet-01",
        updatedAt: "2025-01-01T12:00",
      },
      {
        id: "bet-03",
        updatedAt: "2026-01-01T13:00",
      },
    ];

    const sortedBets = unsortedBets.sort(sortByUpdatedAt);

    const [bet03, bet02, bet01] = sortedBets;

    expect(bet03.id).toBe("bet-03");
    expect(bet02.id).toBe("bet-02");
    expect(bet01.id).toBe("bet-01");
  });
});
