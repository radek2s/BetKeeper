import { BETS } from "@app-test/features/bet/mocks/BetMocks";
import { BetSearchFilterMock } from "@app-test/features/bet/search/BetSearchFilterMock";
import { UserContextMock } from "@app-test/features/user/UserContextMock";
import { renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { describe, expect, it } from "vitest";
import { useParticipantFilter } from "./useParticipantFilter";

describe("useParticipantFilter tests", () => {
  it("Should return the same array when null", () => {
    const wrapper = ({ children }: PropsWithChildren) => (
      <UserContextMock id="creator-01">
        <BetSearchFilterMock>{children}</BetSearchFilterMock>
      </UserContextMock>
    );
    const { result: filter } = renderHook(() => useParticipantFilter(), {
      wrapper,
    });

    const bets = filter.current(BETS);

    expect(bets).toHaveLength(2);
  });

  it("Should return array with bet-01 when selected user friend-01", () => {
    const wrapper = ({ children }: PropsWithChildren) => (
      <UserContextMock id="creator-01">
        <BetSearchFilterMock participantIds={["friend-01"]}>
          {children}
        </BetSearchFilterMock>
      </UserContextMock>
    );
    const { result: filter } = renderHook(() => useParticipantFilter(), {
      wrapper,
    });

    const bets = filter.current(BETS);

    expect(bets).toHaveLength(1);
    expect(bets.map(({ id }) => id).includes("bet-01")).toBeTruthy();
  });

  it("Should return the same array when selected both friends", () => {
    const wrapper = ({ children }: PropsWithChildren) => (
      <UserContextMock id="creator-01">
        <BetSearchFilterMock participantIds={["friend-01", "friend-02"]}>
          {children}
        </BetSearchFilterMock>
      </UserContextMock>
    );
    const { result: filter } = renderHook(() => useParticipantFilter(), {
      wrapper,
    });

    const bets = filter.current(BETS);

    expect(bets).toHaveLength(2);
  });

  it("Should return the same array when selected is empty array", () => {
    const wrapper = ({ children }: PropsWithChildren) => (
      <UserContextMock id="creator-01">
        <BetSearchFilterMock participantIds={[]}>
          {children}
        </BetSearchFilterMock>
      </UserContextMock>
    );
    const { result: filter } = renderHook(() => useParticipantFilter(), {
      wrapper,
    });

    const bets = filter.current(BETS);

    expect(bets).toHaveLength(2);
  });
});
