import { expect } from "@e2e-tests/src/fixtures/pageObjects.fixture";
import { BetListComponent } from "@e2e-tests/src/pages/MainPage/Components/BetListComponent";
import { Locator, Page } from "@playwright/test";
import { BetCardComponent } from "./BetCardComponent";

export class BetSearchComponent {
  readonly baseLocator: Locator;
  readonly searchInput: Locator;
  readonly emptyListText: Locator;
  readonly betListComponent: BetListComponent;

  constructor(rootLocator: Locator | Page) {
    this.searchInput = rootLocator.getByRole("textbox", {
      name: "Search bets...",
    });

    this.baseLocator = rootLocator.locator(".bet-search");
    this.emptyListText = this.baseLocator.getByText("No results found.");
    this.betListComponent = new BetListComponent(this.baseLocator);
  }

  async getBetCard(title: string): Promise<BetCardComponent> {
    return this.betListComponent.getBetCard(title);
  }

  async verifyBetListIsEmpty(): Promise<void> {
    const betCards = await this.baseLocator.locator(".bet-card").all();
    expect(betCards.length).toBe(0);

    await expect(this.emptyListText).toBeVisible();
  }
}
