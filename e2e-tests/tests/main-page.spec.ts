import { expect, test } from "@playwright/test";

test.describe("Main page", () => {
  test("Main page is visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("header span")).toContainText("Hi, John!");
    await expect(page.locator("h1")).toContainText("Bets");
  });

  test("Should navigate to profile page", async ({ page }) => {
    await page.goto("/");
    await page.locator("img.avatar").click();
  });
});
