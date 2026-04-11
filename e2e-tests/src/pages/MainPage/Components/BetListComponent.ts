import { Locator, Page } from "@playwright/test";
import { BetCardComponent } from "./BetCardComponent";

export class BetListComponent {
  readonly baseLocator: Locator | Page;

  constructor(rootLocator: Locator | Page) {
    this.baseLocator = rootLocator;
  }

  async getBetCard(title: string): Promise<BetCardComponent> {
    const betCardComponent = new BetCardComponent(this.baseLocator, title);
    betCardComponent.baseLocator.waitFor();

    return betCardComponent;
  }
}
