import { render, screen } from "@testing-library/react";
import { describe, it, vi } from "vitest";
import BetSortBtn from "./BetSortBtn";
import type { SortType } from "./types";

describe("Bet Sort Button Tests", () => {
  it("Should render default with sort by label", () => {
    const onChangeMock = vi.fn();
    const state: SortType = { sortBy: null, order: null };
    render(<BetSortBtn state={state} onChange={onChangeMock} />);

    const element = screen.getByRole("button", { name: "Sort by" });
    expect(element).toBeDefined();
  });

  it("Should render CREATED with Created date label", () => {
    const onChangeMock = vi.fn();
    const state: SortType = { sortBy: "CREATED", order: null };
    render(<BetSortBtn state={state} onChange={onChangeMock} />);

    const element = screen.getByRole("button", { name: "Created date" });
    expect(element).toBeDefined();
  });
});
