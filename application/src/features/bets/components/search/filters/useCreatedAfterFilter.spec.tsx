import { BETS } from "@app-test/features/bet/mocks/BetMocks";
import { BetSearchFilterMock } from "@app-test/features/bet/search/BetSearchFilterMock";
import { renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { describe, expect, it } from "vitest";
import { useCreatedAfterFilter } from "./useCreatedAfterFilter";

describe("useCreatedAfterFilter tests [2024 and 2025 bets]", () => {
  it("Should return the same array when null", () => {
    const wrapper = ({ children }: PropsWithChildren) => (
      <BetSearchFilterMock>{children}</BetSearchFilterMock>
    );
    const { result: filter } = renderHook(() => useCreatedAfterFilter(), {
      wrapper,
    });

    const bets = filter.current(BETS);

    expect(bets).toHaveLength(2);
  });

  it("Should return array with bet-02 when created after 2024-06-24", () => {
    const wrapper = ({ children }: PropsWithChildren) => (
      <BetSearchFilterMock createdAfter={"2024-06-24T12:00"}>
        {children}
      </BetSearchFilterMock>
    );
    const { result: filter } = renderHook(() => useCreatedAfterFilter(), {
      wrapper,
    });

    const bets = filter.current(BETS);

    expect(bets).toHaveLength(1);
    expect(bets.map(({ id }) => id).includes("bet-02")).toBeTruthy();
  });

  it("Should return the same array when created after 2023-06-24", () => {
    const wrapper = ({ children }: PropsWithChildren) => (
      <BetSearchFilterMock createdAfter="2023-06-24T12:00">
        {children}
      </BetSearchFilterMock>
    );
    const { result: filter } = renderHook(() => useCreatedAfterFilter(), {
      wrapper,
    });

    const bets = filter.current(BETS);

    expect(bets).toHaveLength(2);
  });
});
