import { Page, Locator } from '@playwright/test'
import { AbstractPage } from '../../shared/AbstractPage'
import { ActiveAccountsTableComponent } from './Components/ActiveAccounts/ActiveAccountsTableComponent';
import { PendingRequestsTableComponent } from './Components/PendingRequests/PendingRequestsTableComponent';
import { InviteNewUserComponent } from './Components/InviteNewUser/InviteNewUserComponent';

export class UsersManagementPage extends AbstractPage {
    protected readonly path = "/users";
    protected readonly uniquePageLocator: Locator;
    readonly pendingRequestsComponent: PendingRequestsTableComponent;
    readonly activeAccountsComponent: ActiveAccountsTableComponent;
    readonly inviteNewUserComponent: InviteNewUserComponent;

    constructor(page: Page) {
        super(page);

        this.uniquePageLocator = page.getByRole("heading", { name: "Users management" });
        this.pendingRequestsComponent = new PendingRequestsTableComponent(page, page.locator("section", {
            has: page.getByRole("heading", { name: "Pending requests" })
        }));

        this.activeAccountsComponent = new ActiveAccountsTableComponent(page, page.locator("section", {
            has: page.getByRole("heading", { name: "Active accounts" })
        }));

        this.inviteNewUserComponent = new InviteNewUserComponent(page, page.locator("section", {
            has: page.getByRole("heading", { name: "Invite new" })
        }));
    }
}