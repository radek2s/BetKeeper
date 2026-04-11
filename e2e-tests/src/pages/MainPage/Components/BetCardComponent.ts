import { Locator, Page } from "@playwright/test";
import { BetDetailsPage } from "../../BetDetailsPage/BetDetailsPage";

export class BetCardComponent {
  readonly baseLocator: Locator;

  constructor(rootLocator: Locator | Page, title: string) {
    this.baseLocator = rootLocator
      .locator(".bet-card")
      .filter({ hasText: title });
  }

  async gotoBetDetails(): Promise<BetDetailsPage> {
    await this.baseLocator.click();
    const betDetailsPage = new BetDetailsPage(this.baseLocator.page());
    betDetailsPage.isLoaded();

    return betDetailsPage;
  }
}
