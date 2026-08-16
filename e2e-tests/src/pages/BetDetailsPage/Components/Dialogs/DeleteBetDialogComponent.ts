import { Locator, Page } from "@playwright/test";
import { AbstractDialogComponent } from "e2e-tests/src/shared/components/AbstractDialogComponent";

export class DeleteBetDialogComponent extends AbstractDialogComponent {
  constructor(rootLocator: Locator | Page) {
    super(rootLocator, "Delete", "Cancel", "Delete bet request?");
  }

  async delete(): Promise<void> {
    await this.confirm();
  }
}
