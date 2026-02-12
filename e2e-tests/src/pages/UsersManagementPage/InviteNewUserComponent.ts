import { Locator, Page } from "@playwright/test";
import { AbstractComponent } from "e2e-tests/src/shared/components/AbstractComponent";

export class InviteNewUserComponent extends AbstractComponent {

    constructor(page: Page, rootLocator: Locator) {
        super(page, rootLocator);
    }
}