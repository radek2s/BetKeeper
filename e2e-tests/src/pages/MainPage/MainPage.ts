import { Page, Locator } from '@playwright/test'
import { AbstractPage } from '../AbstractPage'
import { HeaderComponent } from './Components/HeaderComponent';

export class MainPage extends AbstractPage {
    protected readonly path = "/";
    protected readonly uniquePageLocator: Locator;

    readonly header: HeaderComponent;

    constructor(page: Page) {
        super(page);

        this.uniquePageLocator = page.getByRole("button", { name: "notification" });

        const headerRoot = page.locator('header.flex.w-full.justify-between.items-center.my-4.px-4');
        this.header = new HeaderComponent(page, headerRoot);
    }
}