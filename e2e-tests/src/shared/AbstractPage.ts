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

    async validatePageLoaded(): Promise<this> {
        await expect(this.uniquePageLocator,
            `Validate page ${this.constructor.name} is loaded`
        ).toBeVisible();

        return this;
    }
}