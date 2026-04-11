import { AbstractPage } from "../AbstractPage";
import { DeleteBetDialogComponent } from "./Components/Dialogs/DeleteBetDialogComponent";
import { MainPage } from "../MainPage/MainPage";
import { Page, Locator } from "@playwright/test";

export class BetDetailsPage extends AbstractPage {
  readonly uniquePageLocator: Locator;
  readonly deleteButton: Locator;

  constructor(page: Page) {
    super(page);

    this.uniquePageLocator = page.getByRole("heading", { name: "Bet summary" });
    this.deleteButton = page.getByRole("button", { name: "delete" });
  }

  async delete(): Promise<void> {
    await this.deleteButton.click();

    await new DeleteBetDialogComponent(this.page).delete();
    await new MainPage(this.page).isLoaded();
  }
}
