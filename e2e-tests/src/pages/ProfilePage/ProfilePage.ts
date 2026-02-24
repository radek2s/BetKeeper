import { Page, Locator } from '@playwright/test'
import { AbstractPage } from '../AbstractPage'
import { MainPage } from '../MainPage/MainPage';
import { UsersManagementPage } from '../UsersManagementPage/UsersManagementPage';

export class ProfilePage extends AbstractPage {
    protected readonly path = "/profile";
    protected readonly uniquePageLocator: Locator;
    readonly returnButton: Locator;
    readonly applicationUsersButton: Locator;


    constructor(page: Page) {
        super(page);

        this.uniquePageLocator = page.getByRole("heading", { name: "Profile" });
        this.returnButton = page.getByRole("button", { name: "chevron-left" });
        this.applicationUsersButton = page.getByRole("link", { name: "Application user" });
    }

    async returnToMainPage(): Promise<MainPage> {
        await this.returnButton.click();
        const mainPage = new MainPage(this.page);

        return mainPage;
    }

    async openUsersManagementPage(): Promise<UsersManagementPage> {
        await this.applicationUsersButton.click();
        const userManagementPage = new UsersManagementPage(this.page);

        return userManagementPage;
    }
}
