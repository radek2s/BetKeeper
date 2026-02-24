import { Locator, Page } from "@playwright/test";
import { ActiveAccountComponent } from "./ActiveAccountComponent";

export class ActiveAccountsTableComponent {

    private readonly rootLocator: Locator;

    constructor( rootLocator: Locator) {
        this.rootLocator = rootLocator;
    }

    get locator(): Locator {
        return this.rootLocator
    }

    get rows(): Locator {
        return this.rootLocator.locator("div.actions-wrapper");
    }

    async getActiveAccountByEmail(email: string): Promise<ActiveAccountComponent> {
        const row = this.rows
            .filter({ hasText: email });

        await row.waitFor({ state: "visible"});

        return new ActiveAccountComponent(row);
    }

    async getAllActiveAccounts(): Promise<ActiveAccountComponent[]> {
        const count = await this.rows.count();

        const activeAccounts: ActiveAccountComponent[] = [];

        for (let i = 0; i < count; i++) {
            activeAccounts.push(new ActiveAccountComponent(this.rows.nth(i)));
        }

        return activeAccounts
    }
}