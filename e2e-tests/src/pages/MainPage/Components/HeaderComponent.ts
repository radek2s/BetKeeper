import { Locator, Page } from "@playwright/test";
import { ProfilePage } from "../../ProfilePage/ProfilePage";

export class HeaderComponent {
  readonly baseLocator: Locator;
  readonly profileButton: Locator;
  readonly friendsButton: Locator;

  constructor(private readonly page: Page) {
    this.baseLocator = page.getByRole("banner");
    this.profileButton = this.baseLocator.getByRole("link", {
      name: "Profile avatar",
    });
    this.friendsButton = this.baseLocator.getByRole("button", {
      name: "group",
    });
  }

  async openProfilePage(): Promise<ProfilePage> {
    await this.profileButton.click();
    const profilePage = new ProfilePage(this.page);

    return profilePage;
  }

  async openFriendsPage(): Promise<void> {
    await this.friendsButton.click();
    //TODO: implement friends page and return its instance
  }
}
