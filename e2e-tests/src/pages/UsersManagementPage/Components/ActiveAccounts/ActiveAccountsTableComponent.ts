import { Locator, Page } from "@playwright/test";
import { AbstractComponent } from "e2e-tests/src/shared/components/AbstractComponent";
import { ActiveAccountComponent } from "./ActiveAccountComponent";

export class ActiveAccountsTableComponent extends AbstractComponent {

    constructor(page: Page, rootLocator: Locator) {
        super(page, rootLocator);
    }

    async getActiveAccountByEmail(email: string): Promise<ActiveAccountComponent> {
        await this.validateLoaded();
        const rowLocator = this.rootLocator.locator(
            "div.actions-wrapper").filter({
                has: this.page.locator("span", { hasText: email })
            });

        const activeUser = new ActiveAccountComponent(this.page, rowLocator);
        await activeUser.validateLoaded();
        return activeUser;
    }

    async getAllActiveAccounts(): Promise<ActiveAccountComponent[]> {
        await this.validateLoaded();
        const rows = this.rootLocator.locator("div.actions-wrapper");
        const count = await rows.count();
        const activeAccounts: ActiveAccountComponent[] = [];

        for (let i = 0; i < count; i++) {
            const rowLocator = rows.nth(i);
            activeAccounts.push(new ActiveAccountComponent(this.page, rowLocator));
        }

        return activeAccounts
    }
}