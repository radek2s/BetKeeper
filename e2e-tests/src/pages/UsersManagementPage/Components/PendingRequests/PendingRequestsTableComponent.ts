import { Locator, Page } from "@playwright/test";
import { AbstractComponent } from "e2e-tests/src/shared/components/AbstractComponent";
import { PendingRequestComponent } from "./PendingRequestComponent";

export class PendingRequestsTableComponent extends AbstractComponent {

    constructor(page: Page, rootLocator: Locator) {
        super(page, rootLocator);
    }

    async getRequestByEmail(email: string): Promise<PendingRequestComponent> {
        await this.validateLoaded();
        const rowLocator = this.rootLocator.locator(
            "div.actions-wrapper").filter({
                has: this.page.locator("span", { hasText: email })
            });

        const pendingRequest = new PendingRequestComponent(this.page, rowLocator);
        await pendingRequest.validateLoaded();
        return pendingRequest;
    }

    async getAllRequests(): Promise<PendingRequestComponent[]> {
        await this.validateLoaded();
        const rows = this.rootLocator.locator("div.actions-wrapper");
        const count = await rows.count();
        const pendingRequests: PendingRequestComponent[] = [];

        for (let i = 0; i < count; i++) {
            const rowLocator = rows.nth(i);
            pendingRequests.push(new PendingRequestComponent(this.page, rowLocator));
        }

        return pendingRequests;
    }
}