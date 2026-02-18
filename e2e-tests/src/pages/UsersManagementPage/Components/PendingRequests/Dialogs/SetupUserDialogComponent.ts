import { Locator } from "@playwright/test";
import { AbstractDialogComponent } from "e2e-tests/src/shared/components/AbstractDialogComponent";

export class SetupUserDialogComponent extends AbstractDialogComponent {
    
    constructor(rootLocator: Locator) {
        super(rootLocator, "Create", "Cancel");
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