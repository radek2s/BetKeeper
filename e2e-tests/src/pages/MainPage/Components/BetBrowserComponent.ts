import { Locator, Page } from "@playwright/test";
import { BetCardComponent } from "./BetCardComponent";
import { BetListComponent } from "./BetListComponent";

export class BetBrowserComponent {
  readonly baseLocator: Locator;
  readonly betListComponent: BetListComponent;

  constructor(rootLocator: Locator | Page) {
    this.baseLocator = rootLocator.locator(".bet-browser");
    this.betListComponent = new BetListComponent(this.baseLocator);
  }

  async getBetCard(title: string): Promise<BetCardComponent> {
    return this.betListComponent.getBetCard(title);
  }
}
