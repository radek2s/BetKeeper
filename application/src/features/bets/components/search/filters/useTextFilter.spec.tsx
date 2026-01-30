import { BETS } from "@app-test/features/bet/mocks/BetMocks";
import { BetSearchFilterMock } from "@app-test/features/bet/search/BetSearchFilterMock";
import { renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { describe, expect, it } from "vitest";
import { useTextFilter } from "./useTextFilter";

describe("useTextFilter tests", () => {
  it("Should return the same array when null", () => {
    const wrapper = ({ children }: PropsWithChildren) => (
      <BetSearchFilterMock>{children}</BetSearchFilterMock>
    );
    const { result: filter } = renderHook(() => useTextFilter(), {
      wrapper,
    });

    const bets = filter.current(BETS);

    expect(bets).toHaveLength(2);
  });

  it("Should return bet-02 that title containing 'seco' ", () => {
    const wrapper = ({ children }: PropsWithChildren) => (
      <BetSearchFilterMock searchText={"seco"}>{children}</BetSearchFilterMock>
    );
    const { result: filter } = renderHook(() => useTextFilter(), {
      wrapper,
    });

    const bets = filter.current(BETS);

    expect(bets).toHaveLength(1);
    expect(bets.map(({ id }) => id).includes("bet-02")).toBeTruthy();
  });

  it("Should return bet-01 that terms containing 'working' ", () => {
    const wrapper = ({ children }: PropsWithChildren) => (
      <BetSearchFilterMock searchText={"working"}>
        {children}
      </BetSearchFilterMock>
    );
    const { result: filter } = renderHook(() => useTextFilter(), {
      wrapper,
    });

    const bets = filter.current(BETS);

    expect(bets).toHaveLength(1);
    expect(bets.map(({ id }) => id).includes("bet-01")).toBeTruthy();
  });
});
