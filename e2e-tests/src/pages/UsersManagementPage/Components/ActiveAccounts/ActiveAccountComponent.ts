import { Locator, Page } from "@playwright/test";

export class ActiveAccountComponent {

    private readonly rootLocator: Locator;

    constructor( rootLocator: Locator) {
        this.rootLocator = rootLocator
    }

    get locator(): Locator {
        return this.rootLocator
    }

    get name(): Locator {
        return this.rootLocator.locator("div.flex.flex-col > span").first();
    }

    get email(): Locator {
        return this.rootLocator.locator("div.flex.flex-col > span").nth(1) //TODO fix with a better one after ui changes
    }

    async getName(): Promise<string | null> {
        return this.name.textContent();
    }

    async getEmail(): Promise<string | null> {
        return this.email.textContent();
    }
}