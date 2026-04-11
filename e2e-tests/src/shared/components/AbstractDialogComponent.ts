import { Locator, Page } from "@playwright/test";

export abstract class AbstractDialogComponent {
  protected readonly rootLocator: Locator | Page;
  protected readonly confirmButton: Locator;
  protected readonly cancelButton: Locator;
  readonly baseLocator: Locator;

  constructor(
    rootLocator: Locator | Page,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    title?: string,
  ) {
    this.rootLocator = rootLocator;
    this.confirmButton = rootLocator.getByRole("button", {
      name: confirmLabel,
    });
    this.cancelButton = rootLocator.getByRole("button", { name: cancelLabel });
    this.baseLocator =
      rootLocator.getByRole("dialog", { name: title }) ??
      rootLocator.getByRole("dialog");
  }

  protected async confirm(): Promise<void> {
    await this.confirmButton.click();
    this.baseLocator.waitFor({ state: "hidden" });
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
    this.baseLocator.waitFor({ state: "hidden" });
  }
}
