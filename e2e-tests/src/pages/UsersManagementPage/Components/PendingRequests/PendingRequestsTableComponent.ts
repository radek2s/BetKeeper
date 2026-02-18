import { Locator } from "@playwright/test";
import { PendingRequestComponent } from "./PendingRequestComponent";

export class PendingRequestsTableComponent {

    private readonly rootLocator: Locator

    constructor(rootLocator: Locator) {
        this.rootLocator = rootLocator;
    }
    
    get locator(): Locator {
        return this.rootLocator
    }

    get rows(): Locator {
        return this.rootLocator.locator("div.actions-wrapper");
    }

    async getRequestByEmail(email: string): Promise<PendingRequestComponent> {
        const row = this.rows
            .filter({ hasText: email });

        await row.waitFor({ state: "visible"});

        return new PendingRequestComponent(row);
    }

    async getAllRequests(): Promise<PendingRequestComponent[]> {
        const count = await this.rows.count();
        const pendingRequests: PendingRequestComponent[] = [];

        for (let i = 0; i < count; i++) {
            pendingRequests.push(new PendingRequestComponent(this.rows.nth(i)));
        }

        return pendingRequests;
    }
}