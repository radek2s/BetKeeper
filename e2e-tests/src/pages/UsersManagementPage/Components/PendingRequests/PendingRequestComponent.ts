import { Locator } from "@playwright/test";
import { RejectUserRequestDialogComponent } from "./Dialogs/RejectInvitationRequestDialogComponent";
import { SetupUserDialogComponent } from "./Dialogs/SetupUserDialogComponent";

export class PendingRequestComponent {

    private readonly rootLocator: Locator;

    constructor(rootLocator: Locator) {
        this.rootLocator = rootLocator
    }

    get locator(): Locator {
        return this.rootLocator
    }

    async acceptRequest(): Promise<SetupUserDialogComponent> {
        await this.rootLocator
            .getByRole("button", { name: "check" })
            .click();

        const dialog = new SetupUserDialogComponent(
            this.rootLocator.page()
        );

        return dialog;
    }

    async rejectRequest(): Promise<RejectUserRequestDialogComponent> {
        await this.rootLocator
            .getByRole("button", { name: "close" })
            .click();

        const dialog = new RejectUserRequestDialogComponent(
            this.rootLocator.page()
            .getByRole("dialog", { name: "Reject user request" })
        )

        return dialog;
    }

    async getEmail(): Promise<string | null> {
        return this.rootLocator
            .locator("div.flex.flex-col > span")
            .first()
            .textContent();
    }
}