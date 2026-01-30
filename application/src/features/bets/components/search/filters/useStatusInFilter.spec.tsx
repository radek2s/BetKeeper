import { BETS } from "@app-test/features/bet/mocks/BetMocks";
import { BetSearchFilterMock } from "@app-test/features/bet/search/BetSearchFilterMock";
import { renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { describe, expect, it } from "vitest";
import { useStatusInFilter } from "./useStatusInFilter";

describe("useStatusInFilter tests", () => {
  it("Should return the same array when null", () => {
    const wrapper = ({ children }: PropsWithChildren) => (
      <BetSearchFilterMock>{children}</BetSearchFilterMock>
    );
    const { result: filter } = renderHook(() => useStatusInFilter(), {
      wrapper,
    });

    const bets = filter.current(BETS);

    expect(bets).toHaveLength(2);
  });

  it("Should return empty array when selected state 'completed'", () => {
    const wrapper = ({ children }: PropsWithChildren) => (
      <BetSearchFilterMock status={["completed"]}>
        {children}
      </BetSearchFilterMock>
    );
    const { result: filter } = renderHook(() => useStatusInFilter(), {
      wrapper,
    });

    const bets = filter.current(BETS);

    expect(bets).toHaveLength(0);
  });

  it("Should return bet-02 when selected state 'resolved'", () => {
    const wrapper = ({ children }: PropsWithChildren) => (
      <BetSearchFilterMock status={["resolved"]}>
        {children}
      </BetSearchFilterMock>
    );
    const { result: filter } = renderHook(() => useStatusInFilter(), {
      wrapper,
    });

    const bets = filter.current(BETS);

    expect(bets).toHaveLength(1);
    expect(bets.map(({ id }) => id).includes("bet-02")).toBeTruthy();
  });

  it("Should return bet-01 when selected state 'pending'", () => {
    const wrapper = ({ children }: PropsWithChildren) => (
      <BetSearchFilterMock status={["pending"]}>{children}</BetSearchFilterMock>
    );
    const { result: filter } = renderHook(() => useStatusInFilter(), {
      wrapper,
    });

    const bets = filter.current(BETS);

    expect(bets).toHaveLength(1);
    expect(bets.map(({ id }) => id).includes("bet-01")).toBeTruthy();
  });
});
