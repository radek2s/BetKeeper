import { Locator, Page, expect } from "@playwright/test";
import { AbstractDialogComponent } from "e2e-tests/src/shared/components/AbstractDialogComponent";

export class SetupUserDialogComponent extends AbstractDialogComponent {
    
    private readonly firstNameInput = this.rootLocator.locator("input[name='firstName']");
    private readonly lastNameInput = this.rootLocator.locator("input[name='lastName']");
    private readonly errorAlert = this.rootLocator.locator("div.text-error");

    constructor(page: Page, rootLocator: Locator) {
        super(page, rootLocator, "Create", "Cancel");
    }

    async create(): Promise<void> {
        await this.confirm();

        const errorVisible = await this.errorAlert.isVisible().catch(() => false);

        if (errorVisible) {
            const errorMessage = await this.errorAlert.textContent();
            throw new Error(`${errorMessage}`);
        }
    }

    async fillFirstName(firstName: string): Promise<void> {
        await this.firstNameInput.fill(firstName);
        await expect(this.firstNameInput, "Validate first name").toHaveValue(firstName);
    }

    async fillLastName(lastName: string): Promise<void> {
        await this.lastNameInput.fill(lastName);
        await expect(this.lastNameInput, "Validate last name").toHaveValue(lastName);
    }
}