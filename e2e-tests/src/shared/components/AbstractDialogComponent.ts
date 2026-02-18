import { Locator } from "@playwright/test";

export abstract class AbstractDialogComponent {
    
    protected readonly rootLocator: Locator;
    protected readonly confirmButton: Locator;
    protected readonly cancelButton: Locator;
    
    constructor(rootLocator: Locator, confirmLabel = "Confirm", cancelLabel = "Cancel") {
        this.rootLocator = rootLocator;
        this.confirmButton = rootLocator.getByRole("button", { name: confirmLabel });
        this.cancelButton = rootLocator.getByRole("button", { name: cancelLabel });
    }

    get locator(): Locator {
        return this.rootLocator
    }

    protected async confirm(): Promise<void> {
        await this.confirmButton.click();
    }

    async cancel(): Promise<void> {
        await this.cancelButton.click();
    }
}