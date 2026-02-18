import { Locator, Page } from '@playwright/test';
import { ProfilePage } from '../../ProfilePage/ProfilePage';

export class HeaderComponent {
    readonly profileButton: Locator;
    readonly friendsButton: Locator;

    constructor(private readonly page: Page, rootLocator: Locator) {
        this.profileButton = rootLocator.getByRole("link", { name: "Profile avatar" });
        this.friendsButton = rootLocator.getByRole("button", { name: "group" });
    }

    async openProfilePage(): Promise<ProfilePage> {
        await this.profileButton.click();
        const profilePage = new ProfilePage(this.page);
        await profilePage.validatePageLoaded();

        return profilePage;
    }

    async openFriendsPage(): Promise<void> {
        await this.friendsButton.click();
        //TODO: implement friends page and return its instance
    }
}