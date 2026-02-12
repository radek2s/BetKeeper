import { Locator, Page } from '@playwright/test'
import { AbstractComponent } from 'e2e-tests/src/shared/components/AbstractComponent';
import { ProfilePage } from '../ProfilePage/ProfilePage';

export class HeaderComponent extends AbstractComponent {
    readonly profileButton: Locator;
    readonly friendsButton: Locator;

    constructor(page: Page, rootLocator: Locator) {
        super(page, rootLocator);

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
    }
}