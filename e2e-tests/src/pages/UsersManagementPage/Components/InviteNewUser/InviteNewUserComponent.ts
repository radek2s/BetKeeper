import { Locator } from "@playwright/test";

export class InviteNewUserComponent {

    constructor(private readonly rootLocator: Locator) {}

    get locator(): Locator {
        return this.rootLocator
    }

    get emailInput(): Locator {
        return this.rootLocator.locator("input[placeholder='Give email...']");
    }

    get inviteButton(): Locator {
        return this.rootLocator.getByRole("button", { name: "send" });
    }

    get errorAlert() {
        return this.rootLocator.getByRole("alert")
    }

    async inviteUserByEmail(email: string): Promise<void> {
        await this.emailInput.fill(email);
        await this.inviteButton.click();
    }
}