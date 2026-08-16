import { Locator, Page } from "@playwright/test";
import { AbstractDialogComponent } from "e2e-tests/src/shared/components/AbstractDialogComponent";

export class SetupUserDialogComponent extends AbstractDialogComponent {
  constructor(rootLocator: Locator | Page) {
    super(rootLocator, "Create", "Cancel", "Setup user");
  }

  get firstNameInput(): Locator {
    return this.rootLocator.locator("input[name='firstName']");
  }

  get lastNameInput(): Locator {
    return this.rootLocator.locator("input[name='lastName']");
  }

  get errorAlert(): Locator {
    return this.rootLocator.locator("div.text-error");
  }

  async create(): Promise<void> {
    await this.confirm();
  }
}
