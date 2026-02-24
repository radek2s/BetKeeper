import { Locator, Page, expect } from '@playwright/test'

export abstract class AbstractPage {
    protected readonly page: Page;
    protected abstract readonly path: string;
    protected abstract readonly uniquePageLocator: Locator

    constructor(page: Page) {
        this.page = page;
    }

    async navigate(): Promise<this> {
        await this.page.goto(this.path);
        return this
    }

    async isLoaded(): Promise<boolean> {
        try {
            await this.uniquePageLocator.waitFor({ state: "visible" });
            return true;
        } catch {
            return false;
        }
    }
}