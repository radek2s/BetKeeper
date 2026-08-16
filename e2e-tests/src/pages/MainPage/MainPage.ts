import { Page, Locator } from "@playwright/test";
import { AbstractPage } from "../AbstractPage";
import { HeaderComponent } from "./Components/HeaderComponent";
import { BetBrowserComponent } from "./Components/BetBrowserComponent";
import { BetSearchComponent } from "./Components/BetSearchComponent";

export class MainPage extends AbstractPage {
  protected readonly path = "/";
  protected readonly uniquePageLocator: Locator;

  readonly header: HeaderComponent;
  readonly betSearch: BetSearchComponent;
  readonly betBrowserComponent: BetBrowserComponent;

  constructor(page: Page) {
    super(page);

    this.uniquePageLocator = page.getByRole("button", { name: "notification" });

    this.header = new HeaderComponent(page);
    this.betSearch = new BetSearchComponent(page);
    this.betBrowserComponent = new BetBrowserComponent(page);
  }

  async navigate(): Promise<this> {
    await this.page.goto(this.path);
    return this;
  }
}
