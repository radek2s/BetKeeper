import { Locator, Page } from "@playwright/test";
import { AbstractComponent } from "e2e-tests/src/shared/components/AbstractComponent";

export class PendingRequestsComponent extends AbstractComponent {

    constructor(page: Page, rootLocator: Locator) {
        super(page, rootLocator);
    }
}