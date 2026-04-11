import { Locator, Page } from "@playwright/test";

export abstract class AbstractPage {
  protected readonly page: Page;
  protected abstract readonly uniquePageLocator: Locator;

  constructor(page: Page) {
    this.page = page;
  }

  async isLoaded(): Promise<boolean> {
    try {
      await this.uniquePageLocator.waitFor({ state: "visible" });
      return true;
    } catch {
      return false;
    }
  }
}
