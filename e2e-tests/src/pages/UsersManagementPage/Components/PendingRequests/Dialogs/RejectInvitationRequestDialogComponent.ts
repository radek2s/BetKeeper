import { Locator, Page } from "@playwright/test";
import { AbstractDialogComponent } from "e2e-tests/src/shared/components/AbstractDialogComponent";

export class RejectUserRequestDialogComponent extends AbstractDialogComponent {
    
    constructor(page: Page, rootLocator: Locator) {
        super(page, rootLocator, "Reject", "Cancel");
    }

    async confirmRejection(): Promise<void> {
        await this.confirm();
    }
}