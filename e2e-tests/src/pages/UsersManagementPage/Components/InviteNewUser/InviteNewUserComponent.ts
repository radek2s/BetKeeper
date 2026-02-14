import { Locator, Page, expect } from "@playwright/test";
import { AbstractComponent } from "e2e-tests/src/shared/components/AbstractComponent";

export class InviteNewUserComponent extends AbstractComponent {

    private readonly emailInput = this.rootLocator.locator("input[placeholder='Give email...']");
    private readonly inviteButton = this.rootLocator.getByRole("button", { name: "send" });
    private readonly errorAlert = this.rootLocator.getByRole("alert");

    async inviteUserByEmail(email: string): Promise<void> {
        await this.validateLoaded();
        await this.emailInput.fill(email);
        await expect(this.emailInput, "Validate email").toHaveValue(email);

        await this.inviteButton.click();
    }

    async inviteUserByEmailExpectingError(email: string): Promise<void> {
        await this.validateLoaded();
        await this.emailInput.fill(email);
        await expect(this.emailInput, "Validate email").toHaveValue(email);

        await this.inviteButton.click();

        const errorVisible = await this.errorAlert
            .waitFor({ state: "visible", timeout: 2000 })
            .then(() => true)
            .catch (() => false);

        if (errorVisible) {
            const errorMessage = await this.errorAlert.textContent();
            throw new Error(`${errorMessage}`);
        } else {
            throw new Error("Expected error alert did not appear");
        }
    }
}