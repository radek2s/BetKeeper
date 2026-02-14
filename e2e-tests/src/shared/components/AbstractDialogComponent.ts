import { Locator, Page } from "@playwright/test";
import { AbstractComponent } from "./AbstractComponent";

export abstract class AbstractDialogComponent extends AbstractComponent {
    
    protected readonly confirmButton: Locator;
    protected readonly cancelButton: Locator;
    
    constructor(page: Page, rootLocator: Locator, confirmLabel = "Confirm", cancelLabel = "Cancel") {
        super(page, rootLocator);

        this.confirmButton = rootLocator.getByRole("button", { name: confirmLabel });
        this.cancelButton = rootLocator.getByRole("button", { name: cancelLabel });
    }

    protected async confirm(): Promise<void> {
        await this.confirmButton.click();
    }

    async cancel(): Promise<void> {
        await this.cancelButton.click();
    }
}