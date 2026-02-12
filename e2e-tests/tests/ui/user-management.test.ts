import { expect, test } from "@playwright/test";
import { MainPage } from "e2e-tests/src/pages/MainPage/MainPage";

test.describe("Invite new user to system", () => {
    test("should access main page", async ({ page }) => {
        const mainPage = new MainPage(page);
        await mainPage.navigate();
    });

    test("should open profile page", async ({ page }) => {
        const mainPage = new MainPage(page);
        await mainPage.navigate();
        await mainPage.header.openProfilePage();
    });
});
