import { Locator, Page, expect } from "@playwright/test";

export abstract class AbstractComponent {

    constructor(
        protected readonly page: Page,
        protected readonly rootLocator: Locator
    ) {
        this.rootLocator = rootLocator;
    }

    async validateLoaded(): Promise<this> {
        await expect(
            this.rootLocator,
        `Componenent ${this.constructor.name} should be loaded`).toBeVisible();

        return this;
    }

    async validateNotVisible(timeout = 5000) {
        await expect(
            this.rootLocator,
            `Component ${this.constructor.name} should not be visible`
        ).not.toBeVisible({ timeout });
    }

    async click(): Promise<this> {
        await this.rootLocator.click();
        return this;
    }
}