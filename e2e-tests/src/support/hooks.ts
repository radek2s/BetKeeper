import { Before, After } from '@cucumber/cucumber';
import { chromium, request as playwrightRequest } from '@playwright/test';
import { BaseWorld } from './world/base.world';

Before(async function (this: BaseWorld) {
    // API context
    this.request = await playwrightRequest.newContext();

    // UI context
    this.browser = await chromium.launch();
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
});

After(async function (this: BaseWorld) {
    await this.page?.close();
    await this.context?.close();
    await this.browser?.close();
    await this.request?.dispose();
});