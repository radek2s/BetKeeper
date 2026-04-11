import { Locator } from "@playwright/test";
import { AbstractDialogComponent } from "e2e-tests/src/shared/components/AbstractDialogComponent";

export class RejectUserRequestDialogComponent extends AbstractDialogComponent {
  constructor(rootLocator: Locator) {
    super(rootLocator, "Reject", "Cancel", "Reject user request");
  }

  async confirmRejection(): Promise<void> {
    await this.confirm();
  }
}
