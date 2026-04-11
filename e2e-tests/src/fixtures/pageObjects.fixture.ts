import { test as base } from "@playwright/test";
import { MainPage } from "@e2e-tests/src/pages/MainPage/MainPage";

export const test = base.extend<{
  mainPage: MainPage;
}>({
  mainPage: async ({ page }, use) => {
    const mainPage = new MainPage(page);
    await use(mainPage);
  },
});

export const expect = test.expect;
