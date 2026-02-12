import { Page, Locator } from '@playwright/test'
import { AbstractPage } from '../AbstractPage'
import { ActiveAccountsComponent } from './ActiveAccountsComponent';
import { PendingRequestsComponent } from './PendingRequestsComponent';
import { InviteNewUserComponent } from './InviteNewUserComponent';

export class UserManagementPage extends AbstractPage {
    protected readonly path = "/users";
    protected readonly uniquePageLocator: Locator;
    readonly pendingRequestsComponent: PendingRequestsComponent;
    readonly activeAccountsComponent: ActiveAccountsComponent;
    readonly inviteNewUserComponent: InviteNewUserComponent;

    constructor(page: Page) {
        super(page);

        this.uniquePageLocator = page.getByRole("heading", { name: "Users management" });
        this.pendingRequestsComponent = new PendingRequestsComponent(page, page.locator("section", { 
            has: page.getByRole("heading", { name: "Pending requests" })
        }));

        this.activeAccountsComponent = new ActiveAccountsComponent(page, page.locator("section", {
            has: page.getByRole("heading", { name: "Active accounts" })
        }));

        this.inviteNewUserComponent = new InviteNewUserComponent(page, page.locator("section", {
            has: page.getByRole("heading", { name: "Invite new"})
        }));
    }
}