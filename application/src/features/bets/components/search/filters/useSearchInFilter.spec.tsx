import { BETS } from "@app-test/features/bet/mocks/BetMocks";
import { BetSearchFilterMock } from "@app-test/features/bet/search/BetSearchFilterMock";
import { UserContextMock } from "@app-test/features/user/UserContextMock";
import { renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { describe, expect, it } from "vitest";
import { useSearchInFilter } from "./useSearchInFilter";
import { useStatusInFilter } from "./useStatusInFilter";

describe("useSearchInFilter tests", () => {
  it("Should return the same array when null", () => {
    const wrapper = ({ children }: PropsWithChildren) => (
      <UserContextMock id="creator-01">
        <BetSearchFilterMock>{children}</BetSearchFilterMock>
      </UserContextMock>
    );
    const { result: filter } = renderHook(() => useSearchInFilter(), {
      wrapper,
    });

    const bets = filter.current(BETS);

    expect(bets).toHaveLength(2);
  });

  it("Should return empty array when selected 'invited'", () => {
    const wrapper = ({ children }: PropsWithChildren) => (
      <UserContextMock id="creator-01">
        <BetSearchFilterMock searchIn="INVITED">{children}</BetSearchFilterMock>
      </UserContextMock>
    );
    const { result: filter } = renderHook(() => useSearchInFilter(), {
      wrapper,
    });

    const bets = filter.current(BETS);

    expect(bets).toHaveLength(0);
  });

  it("Should return all elements when selected 'creator'", () => {
    const wrapper = ({ children }: PropsWithChildren) => (
      <UserContextMock id="creator-01">
        <BetSearchFilterMock searchIn="CREATOR">{children}</BetSearchFilterMock>
      </UserContextMock>
    );
    const { result: filter } = renderHook(() => useStatusInFilter(), {
      wrapper,
    });

    const bets = filter.current(BETS);

    expect(bets).toHaveLength(2);
  });
});
