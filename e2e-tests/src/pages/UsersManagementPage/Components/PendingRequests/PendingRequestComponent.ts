import { Locator, Page } from "@playwright/test";
import { AbstractComponent } from "e2e-tests/src/shared/components/AbstractComponent";
import { RejectUserRequestDialogComponent } from "./Dialogs/RejectInvitationRequestDialogComponent";
import { SetupUserDialogComponent } from "./Dialogs/SetupUserDialogComponent";

export class PendingRequestComponent extends AbstractComponent {

    constructor(page: Page, rootLocator: Locator) {
        super(page, rootLocator);
    }

    async acceptRequest(): Promise<SetupUserDialogComponent> {
        await this.rootLocator
            .getByRole("button", { name: "check" })
            .click();

        const dialog = new SetupUserDialogComponent(
            this.page,
            this.page.getByRole("dialog", { name: "Setup user" })
        );

        await dialog.validateLoaded();
        return dialog;
    }

    async rejectRequest(): Promise<RejectUserRequestDialogComponent> {
        await this.rootLocator
            .getByRole("button", { name: "close" })
            .click();

        const dialog = new RejectUserRequestDialogComponent(
            this.page,
            this.page.getByRole("dialog", { name: "Reject user request" })
        )

        await dialog.validateLoaded();
        return dialog;
    }

    async getEmail(): Promise<string> {
        const email = await this.rootLocator
            .locator("div.flex.flex-col > span")
            .first()
            .textContent();

        if (!email) throw new Error("Email not found in pending request row");

        return email;
    }
}