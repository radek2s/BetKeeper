import { Locator, Page } from "@playwright/test";
import { AbstractComponent } from "e2e-tests/src/shared/components/AbstractComponent";

export class ActiveAccountComponent extends AbstractComponent {

    constructor(page: Page, rootLocator: Locator) {
        super(page, rootLocator);
    }

    async getName(): Promise<string> {
        const name = await this.rootLocator
            .locator("div.flex.flex-col > span")
            .first()
            .textContent();

        if (!name) throw new Error("Name not found in ActiveAccountComponent");

        return name;
    }

    async getEmail(): Promise<string> {
        const email = await this.rootLocator
            .locator("div.flex.flex-col > span")
            .nth(1)
            .textContent();

        if (!email) throw new Error("Email not found in ActiveAccountComponent");

        return email;
    }
}